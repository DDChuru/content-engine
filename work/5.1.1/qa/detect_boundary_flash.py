#!/usr/bin/env python3
"""Find candidate one-frame old-scene holds using only an MP4 and timeline JSON.

Requires ffmpeg, ffprobe, numpy and Pillow. No scene code is loaded or rendered.
Frame indices are zero-based; the input must be the unshifted CFR lesson master.
Candidates require human review: an intentional one-frame hold is indistinguishable
from an accidental hold from these two inputs alone. See BOUNDARY-AUDIT.md.
"""
import argparse
import json
import subprocess
from fractions import Fraction
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


def compare(a, b):
    delta = np.abs(a.astype(np.float32) - b.astype(np.float32)).mean(axis=2)
    # Local tiles retain sensitivity to a small marker/title changing in a large frame.
    tiles = delta.reshape(10, 36, 10, 64).mean(axis=(1, 3))
    return {"mae": float(delta.mean()), "changed_fraction": float((delta > 12).mean()),
            "max_tile_mae": float(tiles.max())}


def classify(prev, jump, after):
    near = prev["mae"] <= .8 and prev["changed_fraction"] <= .005
    material = jump["mae"] >= 1 or jump["changed_fraction"] >= .005 or jump["max_tile_mae"] >= 8
    abrupt = jump["mae"] >= 5 * max(prev["mae"], .05)
    candidate = near and material and abrupt
    stable = after["mae"] <= max(.8, .45 * jump["mae"])
    return candidate, stable


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("master", type=Path)
    parser.add_argument("timeline", type=Path)
    parser.add_argument("--output", type=Path, help="JSON report (otherwise stdout)")
    parser.add_argument("--sheets", type=Path, help="Optional directory of boundary contact sheets")
    args = parser.parse_args()
    timeline = json.loads(args.timeline.read_text())
    fps = Fraction(str(timeline["fps"]))
    probe = json.loads(subprocess.check_output([
        "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_streams", "-of", "json", str(args.master)]))
    video = probe["streams"][0]
    if Fraction(video["avg_frame_rate"]) != fps or Fraction(video["r_frame_rate"]) != fps:
        raise SystemExit("FPS mismatch / non-CFR input; supply the unshifted lesson master")
    if abs(float(video.get("start_time", 0))) > 1e-6:
        raise SystemExit("Video does not start at zero; timeline alignment must be established first")
    if int(video.get("nb_frames", -1)) != timeline["durationFrames"]:
        raise SystemExit("Frame count differs from timeline; do not silently audit a branded/offset master")
    scenes = timeline["scenes"]
    for previous, current in zip(scenes, scenes[1:]):
        if previous["startFrame"] + previous["frames"] != current["startFrame"]:
            raise SystemExit("Timeline scenes are not contiguous integer frame windows")
        if previous["frames"] < 2 or current["frames"] < 3:
            raise SystemExit("Need at least two preceding and three following frames")
    wanted = sorted({s["startFrame"] + d for s in scenes[1:] for d in (-2, -1, 0, 1, 2)})
    frames = {}
    if wanted:
        select = "+".join(f"eq(n\\,{f})" for f in wanted)
        command = ["ffmpeg", "-v", "error", "-threads", "2", "-i", str(args.master),
                   "-map", "0:v:0", "-an", "-sn", "-dn", "-vf",
                   f"select='{select}',scale=640:360:flags=area", "-fps_mode", "passthrough",
                   "-frames:v", str(len(wanted)), "-filter_threads", "1", "-pix_fmt", "rgb24",
                   "-f", "rawvideo", "pipe:1"]
        # Decode by source frame index, not approximate timestamp seeking.
        raw = subprocess.check_output(command)
        size = 640 * 360 * 3
        if len(raw) != size * len(wanted):
            raise SystemExit(f"Expected {len(wanted)} selected frames; received {len(raw) / size}")
        arrays = np.frombuffer(raw, dtype=np.uint8).reshape(len(wanted), 360, 640, 3)
        frames = dict(zip(wanted, arrays))
    results = []
    for previous, scene in zip(scenes, scenes[1:]):
        f = scene["startFrame"]
        metrics = {"prior_motion": compare(frames[f-2], frames[f-1]),
                   "last_to_first": compare(frames[f-1], frames[f]),
                   "first_to_second": compare(frames[f], frames[f+1]),
                   "second_to_third": compare(frames[f+1], frames[f+2])}
        candidate, stable = classify(metrics["last_to_first"], metrics["first_to_second"], metrics["second_to_third"])
        results.append({"beat": scene["id"], "previous_beat": previous["id"], "frame": f,
                        "time_seconds": float(f / fps), "candidate": candidate,
                        "settles_after_jump": stable, "metrics": metrics})
    report = {"master": str(args.master.resolve()), "timeline": str(args.timeline.resolve()),
              "master_bytes": args.master.stat().st_size, "fps": float(fps),
              "frame_count": int(video["nb_frames"]), "boundaries_tested": len(results),
              "candidate_count": sum(r["candidate"] for r in results),
              "candidate_beats": [r["beat"] for r in results if r["candidate"]],
              "method": "RGB 640x360 area downsample; last/first near-match, then material abrupt jump",
              "thresholds": {"near_mae_max": .8, "near_changed_fraction_max": .005,
                             "changed_pixel_threshold": 12, "jump_mae_min": 1,
                             "jump_changed_fraction_min": .005, "jump_tile_mae_min": 8,
                             "jump_ratio_min": 5, "noise_floor": .05,
                             "post_jump_stable_mae_max": "max(0.8, 0.45 * jump_mae)"},
              "limits": "Candidates, not proof. Deliberate one-frame holds can match; identical layouts can hide a lookup error. Subtle/animated holds can evade thresholds. Requires unshifted CFR master.",
              "boundaries": results}
    if args.sheets:
        args.sheets.mkdir(parents=True, exist_ok=True)
        for start in range(0, len(results), 6):
            page = results[start:start+6]
            sheet = Image.new("RGB", (1280, len(page)*216), "#eeeeee")
            draw = ImageDraw.Draw(sheet)
            for row, result in enumerate(page):
                f = result["frame"]
                m = result["metrics"]
                label = (f"Beat {result['beat']} at frame {f} ({result['time_seconds']:.3f}s) | "
                         f"MAE last/first {m['last_to_first']['mae']:.3f}, "
                         f"first/second {m['first_to_second']['mae']:.3f} | "
                         f"{'CANDIDATE' if result['candidate'] else 'no candidate'}")
                draw.text((5, row*216+2), label, fill="#be2020" if result["candidate"] else "#111111")
                for column, d in enumerate((-1, 0, 1, 2)):
                    img = Image.fromarray(frames[f+d]).resize((320, 180))
                    sheet.paste(img, (column*320, row*216+34))
                    draw.text((column*320+5, row*216+18), f"frame {f+d} ({['last old','first new','second new','third new'][column]})", fill="#111111")
            sheet.save(args.sheets / f"boundaries-{start//6+1:02d}.jpg", quality=94)
        for r in results:
            if r["candidate"]:
                for d in (-1, 0, 1, 2):
                    Image.fromarray(frames[r["frame"]+d]).save(args.sheets / f"beat-{r['beat']:02d}-offset-{d:+d}.png")
    output = json.dumps(report, indent=2) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(output)
        print(f"{args.master.name}: {len(results)} boundaries; candidates {report['candidate_beats']}", flush=True)
    else:
        print(output, end="")


if __name__ == "__main__":
    main()
