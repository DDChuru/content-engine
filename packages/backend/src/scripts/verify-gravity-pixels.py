#!/usr/bin/env python3
"""Check actual still pixels for missing Chromium paper layers, not just DOM layout."""
import argparse
import json
import math
from pathlib import Path

from PIL import Image, ImageStat

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("topic", choices=["derived-units", "types-of-forces"])
args = parser.parse_args()
root = Path(__file__).resolve().parents[2]
report = json.loads((root / f"projects/mechanics-{args.topic}/verify-gravity-stills.json").read_text())
scenes = json.loads((root / f"src/remotion/public/transcripts/mechanics/{args.topic}.json").read_text())["scenes"]
offsets = {}
offset = 0
for scene in scenes:
    offsets[scene["id"]] = offset
    offset += math.ceil(scene["duration"] * 30)
by_id = {scene["id"]: scene for scene in scenes}
bad = []
for row in report["measurements"]:
    image = Image.open(root / f"out/verify-gravity-{args.topic}/verify-{row['frame']}.png").convert("RGB")
    t = (row["frame"] - offsets[row["scene"]]) / 30
    cues = by_id[row["scene"]]["cues"]
    regions = []
    if args.topic == "derived-units":
        if row["scene"] == "s06":
            regions.append((648, 234, 1832, 898))
        elif t > cues["local-acceleration"] + 0.9:
            regions.append((705, 213, 1215, 345))
    else:
        if row["scene"] == "s03" and t > cues["mass-times-gravity"] + 0.9:
            regions.append((1465, 305, 1795, 435))
        elif row["scene"] == "s09":
            regions.append((110, 290, 720, 905))
            if t > cues["vertically"] + 0.9:
                regions.append((820, 290, 1790, 495))
            if t > cues["horizontally"] + 0.9:
                regions.append((820, 565, 1790, 810))
    failure = max(ImageStat.Stat(image).stddev) < 25
    for region in regions:
        crop = image.crop(tuple(round(value * (image.width / 1920 if index % 2 == 0 else image.height / 1080)) for index, value in enumerate(region)))
        pixels = list(crop.getdata())
        paper_fraction = sum(r > 160 and g > 155 and b > 120 for r, g, b in pixels) / len(pixels)
        failure |= paper_fraction < 0.6
    if failure:
        bad.append(row["frame"])
print(json.dumps(bad))
