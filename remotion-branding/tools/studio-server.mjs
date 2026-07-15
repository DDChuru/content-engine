/**
 * Content Studio bridge (Stage-1).
 *
 * A tiny zero-dependency Node server that ties the studio shell to the repo:
 *   • serves studio.html + annotate.html
 *   • /api/config — studio + terminal URLs for the shell to embed
 *   • /api/term   — types a command into the embedded terminal's tmux session
 *                   (the Claude / Codex / Render buttons). The real CLI runs in
 *                   the terminal pane; we never reimplement it here.
 *
 * Run from the remotion-branding dir:  node tools/studio-server.mjs
 */
import http from 'node:http';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const PORT = 8910;
const REPO = path.resolve(fileURLToPath(import.meta.url), '..', '..'); // remotion-branding
const TOOLS = path.join(REPO, 'tools');
const STUDIO_URL = 'http://localhost:3000'; // remotion studio
const TERM_URL = 'http://localhost:7682';   // ttyd terminal (tmux session "studio")
const TMUX_SESSION = 'studio';

const send = (res, code, type, body) => {
  res.writeHead(code, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*' });
  res.end(body);
};

const serveFile = async (res, file, type) => {
  try { send(res, 200, type, await readFile(path.join(TOOLS, file))); }
  catch { send(res, 404, 'text/plain', 'not found'); }
};

const readBody = (req) => new Promise((resolve) => {
  let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => resolve(b));
});

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/studio.html'))
    return serveFile(res, 'studio.html', 'text/html; charset=utf-8');
  if (req.method === 'GET' && url.pathname === '/annotate.html')
    return serveFile(res, 'annotate.html', 'text/html; charset=utf-8');
  if (req.method === 'GET' && url.pathname === '/api/config')
    return send(res, 200, 'application/json', JSON.stringify({ studioUrl: STUDIO_URL, termUrl: TERM_URL, repo: REPO }));

  // Type a command into the embedded terminal's tmux session (the Claude /
  // Codex / Render buttons). We don't reimplement the CLI — we just drop you
  // into the real one, running interactively where you can see everything.
  if (req.method === 'POST' && url.pathname === '/api/term') {
    const { cmd } = JSON.parse((await readBody(req)) || '{}');
    if (!cmd) return send(res, 400, 'text/plain', 'missing cmd');
    // send-keys the literal command, then Enter, into the running session.
    const child = spawn('tmux', ['send-keys', '-t', TMUX_SESSION, cmd, 'Enter'], { env: process.env });
    child.on('close', (code) => send(res, code === 0 ? 200 : 500, 'text/plain', code === 0 ? 'ok' : 'tmux send-keys failed (is the terminal running?)'));
    child.on('error', (e) => send(res, 500, 'text/plain', e.message));
    return;
  }

  send(res, 404, 'text/plain', 'not found');
});

server.listen(PORT, () => console.log(`Content Studio bridge → http://localhost:${PORT}  (repo: ${REPO})`));
