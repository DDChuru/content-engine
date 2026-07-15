/**
 * VidStud bridge.
 *
 * A tiny zero-dependency Node server that ties the VidStud shell to the repo:
 *   • serves studio.html + annotate.html
 *   • /api/config          — studio + terminal URLs for the shell to embed
 *   • /api/term            — types a command into the embedded terminal's tmux
 *                            session (the Claude / Codex / Render buttons)
 *   • GET  /api/projects   — list saved projects under public/projects
 *   • POST /api/projects/new       — stream an uploaded recording to
 *                            public/projects/<slug>/clip.mp4, ffprobe it
 *                            (fps / dims / duration), write project.json
 *   • POST /api/projects/activate  — write a project's marks.json + compose the
 *                            "active project" (src/tapdemo/active-project.json)
 *                            that the AnnotatedVideo comp previews + renders
 *
 * Run from the remotion-branding dir:  node tools/studio-server.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const PORT = 8910;
const REPO = path.resolve(fileURLToPath(import.meta.url), '..', '..'); // remotion-branding
const TOOLS = path.join(REPO, 'tools');
const PUBLIC = path.join(REPO, 'public');
const PROJECTS = path.join(PUBLIC, 'projects');
const ACTIVE = path.join(REPO, 'src', 'tapdemo', 'active-project.json');
const STUDIO_URL = 'http://localhost:3000'; // remotion studio
const TERM_URL = 'http://localhost:7682';   // ttyd terminal (tmux session "studio")
const TMUX_SESSION = 'studio';

const send = (res, code, type, body) => {
  res.writeHead(code, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*' });
  res.end(body);
};
const sendJson = (res, code, obj) => send(res, code, 'application/json', JSON.stringify(obj));

const serveFile = async (res, file, type) => {
  try { send(res, 200, type, await readFile(path.join(TOOLS, file))); }
  catch { send(res, 404, 'text/plain', 'not found'); }
};

const readBody = (req) => new Promise((resolve) => {
  let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => resolve(b));
});

const slugify = (s) => (s || 'clip')
  .replace(/\.[^.]+$/, '')            // drop extension
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'clip';

// ffprobe a video → { fps, srcW, srcH, clipSeconds }
const ffprobe = (file) => new Promise((resolve, reject) => {
  const args = ['-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=r_frame_rate,width,height',
    '-show_entries', 'format=duration', '-of', 'json', file];
  const p = spawn('ffprobe', args);
  let out = '', err = '';
  p.stdout.on('data', (d) => (out += d));
  p.stderr.on('data', (d) => (err += d));
  p.on('error', reject);
  p.on('close', (code) => {
    if (code !== 0) return reject(new Error('ffprobe failed: ' + err.trim()));
    try {
      const j = JSON.parse(out);
      const s = (j.streams && j.streams[0]) || {};
      const [n, d] = (s.r_frame_rate || '30/1').split('/').map(Number);
      const fps = d ? Math.round(n / d) : 30;   // integer fps (29.97→30, 59.94→60)
      const clipSeconds = Math.round(parseFloat(j.format?.duration || '0') * 1000) / 1000;
      resolve({ fps: fps || 30, srcW: s.width || 1080, srcH: s.height || 1920, clipSeconds });
    } catch (e) { reject(e); }
  });
});

const listProjects = async () => {
  try {
    const dirs = await readdir(PROJECTS, { withFileTypes: true });
    const out = [];
    for (const d of dirs) {
      if (!d.isDirectory()) continue;
      try {
        const p = JSON.parse(await readFile(path.join(PROJECTS, d.name, 'project.json'), 'utf8'));
        let hasMarks = false;
        try { await readFile(path.join(PROJECTS, d.name, 'marks.json')); hasMarks = true; } catch {}
        out.push({ ...p, hasMarks });
      } catch {}
    }
    return out;
  } catch { return []; }
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/studio.html'))
    return serveFile(res, 'studio.html', 'text/html; charset=utf-8');
  if (req.method === 'GET' && url.pathname === '/annotate.html')
    return serveFile(res, 'annotate.html', 'text/html; charset=utf-8');
  if (req.method === 'GET' && url.pathname === '/api/config')
    return sendJson(res, 200, { studioUrl: STUDIO_URL, termUrl: TERM_URL, repo: REPO });

  // Type a command into the embedded terminal's tmux session (Claude/Codex/Render).
  if (req.method === 'POST' && url.pathname === '/api/term') {
    const { cmd } = JSON.parse((await readBody(req)) || '{}');
    if (!cmd) return send(res, 400, 'text/plain', 'missing cmd');
    const child = spawn('tmux', ['send-keys', '-t', TMUX_SESSION, cmd, 'Enter'], { env: process.env });
    child.on('close', (code) => send(res, code === 0 ? 200 : 500, 'text/plain', code === 0 ? 'ok' : 'tmux send-keys failed (is the terminal running?)'));
    child.on('error', (e) => send(res, 500, 'text/plain', e.message));
    return;
  }

  // List saved projects.
  if (req.method === 'GET' && url.pathname === '/api/projects')
    return sendJson(res, 200, { projects: await listProjects() });

  // New project: stream the uploaded recording to disk, then ffprobe it.
  if (req.method === 'POST' && url.pathname === '/api/projects/new') {
    const name = url.searchParams.get('name') || 'clip.mp4';
    const layout = url.searchParams.get('layout') === 'wide' ? 'wide' : 'phone';
    const slug = slugify(name);
    const dir = path.join(PROJECTS, slug);
    try { await mkdir(dir, { recursive: true }); } catch (e) { return send(res, 500, 'text/plain', e.message); }
    const dest = path.join(dir, 'clip.mp4');
    const ws = fs.createWriteStream(dest);
    ws.on('error', (e) => send(res, 500, 'text/plain', 'write failed: ' + e.message));
    req.on('error', () => { try { ws.destroy(); } catch {} });
    ws.on('finish', async () => {
      try {
        const meta = await ffprobe(dest);
        const project = {
          slug, name,
          video: `projects/${slug}/clip.mp4`,
          fps: meta.fps, srcW: meta.srcW, srcH: meta.srcH, clipSeconds: meta.clipSeconds,
          layout,
        };
        await writeFile(path.join(dir, 'project.json'), JSON.stringify(project, null, 2));
        sendJson(res, 200, project);
      } catch (e) { send(res, 500, 'text/plain', 'ffprobe failed: ' + e.message); }
    });
    req.pipe(ws);
    return;
  }

  // Activate: save the project's marks + compose the active project the
  // AnnotatedVideo composition previews (defaultProps) and renders (--props).
  if (req.method === 'POST' && url.pathname === '/api/projects/activate') {
    const body = JSON.parse((await readBody(req)) || '{}');
    const { slug, marks, layout, bookend } = body;
    if (!slug || !Array.isArray(marks)) return send(res, 400, 'text/plain', 'need { slug, marks[] }');
    const dir = path.join(PROJECTS, slug);
    let project;
    try { project = JSON.parse(await readFile(path.join(dir, 'project.json'), 'utf8')); }
    catch { return send(res, 404, 'text/plain', 'unknown project: ' + slug); }
    try {
      await writeFile(path.join(dir, 'marks.json'), JSON.stringify({ clip: project.name, fps: project.fps, annotations: marks }, null, 2));
      const active = {
        video: project.video,
        fps: project.fps, clipSeconds: project.clipSeconds, srcW: project.srcW, srcH: project.srcH,
        layout: layout || project.layout || 'phone',
        holdMode: 'asDrawn',
        bookend: bookend || null,
        marks,
      };
      await writeFile(ACTIVE, JSON.stringify(active, null, 2));
      sendJson(res, 200, { ok: true, slug, propsPath: 'src/tapdemo/active-project.json', markCount: marks.length });
    } catch (e) { send(res, 500, 'text/plain', e.message); }
    return;
  }

  send(res, 404, 'text/plain', 'not found');
});

server.listen(PORT, () => console.log(`VidStud bridge → http://localhost:${PORT}  (repo: ${REPO})`));
