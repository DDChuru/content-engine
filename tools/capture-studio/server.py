#!/usr/bin/env python3
"""Capture Studio — drive an adb phone in the browser AND author the storyboard
in one pass. Each step logs: the screenshot, the exact highlight point, a caption
(on-screen), and a narration line (spoken). Two click modes:

  • Tap & advance  — click a button: logs (screen, point, caption, narration) then
                     forwards the tap so the app moves on.
  • Annotate only  — click an element: logs the highlight + caption WITHOUT tapping
                     (for "look here" beats: the checked-in banner, the ✓/✗ buttons…).

Plus: Snap (screen, no point), Scroll, Back, Type-into-field, Undo.

Run:  python3 server.py   →   http://localhost:7799
Out:  ./session/step-NN.png + ./session/captures.json  (a ready storyboard)
"""
import http.server, json, subprocess, socketserver
from pathlib import Path

OUT = Path(__file__).parent / "session"
OUT.mkdir(exist_ok=True)
LOG = OUT / "captures.json"
steps = json.loads(LOG.read_text()) if LOG.exists() else []

def sh(*a): return subprocess.run(["adb", *a], capture_output=True)
def screencap() -> bytes: return sh("exec-out", "screencap", "-p").stdout

def save_step(d, x, y, kind):
    idx = len(steps); fn = f"step-{idx:02d}.png"
    (OUT / fn).write_bytes(screencap())
    steps.append({"i": idx, "file": fn, "x": x, "y": y, "kind": kind,
                  "label": d.get("label", ""), "caption": d.get("caption", ""),
                  "narration": d.get("narration", "")})
    LOG.write_text(json.dumps(steps, indent=2))

HTML = """<!doctype html><html><head><meta charset=utf-8><title>Capture Studio</title>
<style>
:root{--bg:#0e1116;--card:#171c24;--line:#252c37;--cyan:#3CB6E0;--amber:#E89A30;--txt:#e6edf3;--mut:#8b949e}
*{box-sizing:border-box;font-family:ui-sans-serif,system-ui,sans-serif}
body{margin:0;background:var(--bg);color:var(--txt);display:flex;gap:18px;padding:18px}
.left{flex:0 0 auto}.right{flex:1;min-width:300px}
h1{font-size:16px;margin:0 0 2px}.sub{color:var(--mut);font-size:12px;margin-bottom:12px}
#wrap{position:relative;display:inline-block;border-radius:22px;overflow:hidden;border:1px solid var(--line);box-shadow:0 18px 50px -20px #000}
#screen{display:block;width:330px;cursor:crosshair}
#mark{position:absolute;width:34px;height:34px;border:3px solid var(--cyan);border-radius:50%;transform:translate(-50%,-50%);pointer-events:none;opacity:0;box-shadow:0 0 16px var(--cyan)}
#mark.an{border-color:var(--amber);box-shadow:0 0 16px var(--amber)}
.modes{display:flex;gap:8px;margin:12px 0}
.modes button{flex:1}
.mode-on{background:var(--cyan)!important;color:#04222e!important;border-color:var(--cyan)!important;font-weight:700}
.mode-on.an{background:var(--amber)!important;border-color:var(--amber)!important}
.row{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}
button{background:var(--card);color:var(--txt);border:1px solid var(--line);border-radius:9px;padding:8px 11px;font-size:13px;cursor:pointer}
button:hover{border-color:var(--cyan)}
input,textarea{background:var(--card);color:var(--txt);border:1px solid var(--line);border-radius:9px;padding:8px 10px;font-size:13px;width:100%;font-family:inherit}
textarea{resize:vertical;min-height:46px}
label{font-size:11px;color:var(--mut);text-transform:uppercase;letter-spacing:.06em;display:block;margin:8px 0 3px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px}
#steps{list-style:none;margin:0;padding:0;max-height:64vh;overflow:auto}
#steps li{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--line);font-size:12px}
#steps img{width:38px;border-radius:5px;border:1px solid var(--line)}
.tag{color:var(--cyan);font-weight:700}.an2{color:var(--amber)}.k{color:var(--mut);font-size:11px}
.hint{color:var(--mut);font-size:11px;margin-top:8px;line-height:1.5}
.panel{flex:0 0 300px}
</style></head><body>
<div class=left>
  <h1>🎬 Capture Studio</h1>
  <div class=sub>Set caption + narration, then click the phone where the action is.</div>
  <div id=wrap><img id=screen src="/screen"><div id=mark></div></div>
  <div class=modes>
    <button id=mTap class="mode-on" onclick="setMode('tap')">👆 Tap &amp; advance</button>
    <button id=mAn onclick="setMode('annotate')">🎯 Annotate only</button>
  </div>
  <div class=row>
    <button onclick="scrl('down')">▼ Scroll</button>
    <button onclick="scrl('up')">▲</button>
    <button onclick="back()">‹ Back</button>
    <button onclick="snap()">📸 Snap</button>
    <button onclick="refresh()">⟳</button>
  </div>
  <div class=row><input id=txt placeholder="type into focused field…" style="flex:1"><button onclick="typetext()">⌨ Type</button></div>
  <div class=hint><b>Tap</b> = highlight + press (cyan). <b>Annotate</b> = highlight only, no press (amber). Caption shows on screen; narration is spoken.</div>
</div>
<div class=panel>
  <div class=card>
    <label>Caption (on-screen)</label><input id=caption placeholder="e.g. Pass or fail, on the spot">
    <label>Narration (spoken)</label><textarea id=narration placeholder="What Daniel says for this beat…"></textarea>
    <label>Label (optional, short)</label><input id=label placeholder="e.g. Fail ✗">
    <div class=hint>Filled values attach to your <b>next click / snap</b>, then clear.</div>
  </div>
</div>
<div class=right>
  <div class=card>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <b>Storyboard (<span id=n>0</span> beats)</b><button onclick="undo()">↩ Undo</button>
    </div>
    <ul id=steps></ul>
  </div>
</div>
<script>
const img=document.getElementById('screen'),mark=document.getElementById('mark');
const DW=720,DH=1604; let mode='tap';
function setMode(m){mode=m;document.getElementById('mTap').className=m==='tap'?'mode-on':'';
  document.getElementById('mAn').className=m==='annotate'?'mode-on an':'';mark.className=m==='annotate'?'an':'';}
function bust(){img.src="/screen?t="+Date.now();}
function meta(){return {caption:caption.value,narration:narration.value,label:label.value};}
function clearMeta(){caption.value='';narration.value='';label.value='';}
img.addEventListener('click',async e=>{
  const r=img.getBoundingClientRect();
  const dx=Math.round((e.clientX-r.left)/r.width*DW), dy=Math.round((e.clientY-r.top)/r.height*DH);
  mark.style.left=(e.clientX-r.left)+'px';mark.style.top=(e.clientY-r.top)+'px';mark.style.opacity=1;
  setTimeout(()=>mark.style.opacity=0,700);
  await post(mode==='tap'?'/tap':'/annotate',{x:dx,y:dy,...meta()});clearMeta();
  setTimeout(()=>{bust();load();}, mode==='tap'?750:120);
});
async function post(p,b){return fetch(p,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b||{})}).then(r=>r.json());}
async function snap(){await post('/snap',meta());clearMeta();setTimeout(()=>{bust();load();},250);}
async function scrl(d){await post('/scroll',{dir:d});setTimeout(bust,500);}
async function back(){await post('/back',{});setTimeout(bust,500);}
async function typetext(){await post('/type',{text:txt.value});txt.value='';setTimeout(bust,400);}
async function undo(){await post('/undo',{});load();bust();}
function refresh(){bust();}
async function load(){const s=await fetch('/steps').then(r=>r.json());document.getElementById('n').textContent=s.length;
 document.getElementById('steps').innerHTML=s.map(x=>{const c=x.kind==='annotate'?'an2':'tag';
  return `<li><img src="/img/${x.file}?t=${Date.now()}"><span><span class="${c}">${x.i} · ${x.kind}</span> <b>${x.caption||x.label||''}</b><br><span class=k>${(x.narration||'').slice(0,70)}${x.x!=null?` · @${x.x},${x.y}`:''}</span></span></li>`;}).reverse().join('');}
load();setInterval(bust,4000);
</script></body></html>"""

class H(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def _send(self, code, ctype, body):
        if isinstance(body, str): body = body.encode()
        self.send_response(code); self.send_header("Content-Type", ctype)
        self.send_header("Cache-Control", "no-store"); self.send_header("Content-Length", str(len(body)))
        self.end_headers(); self.wfile.write(body)
    def do_GET(self):
        p = self.path.split("?")[0]
        if p == "/": self._send(200, "text/html", HTML)
        elif p == "/screen": self._send(200, "image/png", screencap())
        elif p == "/steps": self._send(200, "application/json", json.dumps(steps))
        elif p.startswith("/img/"):
            f = OUT / p[5:]; self._send(200, "image/png", f.read_bytes() if f.exists() else b"")
        else: self._send(404, "text/plain", "nope")
    def do_POST(self):
        n = int(self.headers.get("Content-Length", 0)); d = json.loads(self.rfile.read(n) or "{}")
        p = self.path
        if p == "/tap":
            save_step(d, int(d["x"]), int(d["y"]), "tap"); sh("shell", "input", "tap", str(int(d["x"])), str(int(d["y"])))
            self._send(200, "application/json", "{}")
        elif p == "/annotate":
            save_step(d, int(d["x"]), int(d["y"]), "annotate"); self._send(200, "application/json", "{}")
        elif p == "/snap":
            save_step(d, None, None, "snap"); self._send(200, "application/json", "{}")
        elif p == "/scroll":
            if d.get("dir") == "down": sh("shell", "input", "swipe", "360", "1100", "360", "450", "300")
            else: sh("shell", "input", "swipe", "360", "450", "360", "1100", "300")
            self._send(200, "application/json", "{}")
        elif p == "/back": sh("shell", "input", "keyevent", "KEYCODE_BACK"); self._send(200, "application/json", "{}")
        elif p == "/type": sh("shell", "input", "text", (d.get("text", "")).replace(" ", "%s")); self._send(200, "application/json", "{}")
        elif p == "/undo":
            if steps:
                last = steps.pop()
                try: (OUT / last["file"]).unlink()
                except Exception: pass
                LOG.write_text(json.dumps(steps, indent=2))
            self._send(200, "application/json", "{}")
        else: self._send(404, "text/plain", "nope")

class TS(socketserver.ThreadingMixIn, http.server.HTTPServer): daemon_threads = True
if __name__ == "__main__":
    print("Capture Studio → http://localhost:7799")
    TS(("127.0.0.1", 7799), H).serve_forever()
