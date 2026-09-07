#!/usr/bin/env python3
"""Encode only with --generate; always independently decode with ZXing-C++."""
import argparse
import hashlib
import importlib.metadata
import json
from pathlib import Path

import qrcode
import zxingcpp
from PIL import Image

PAYLOAD = "kx75czmzd6hc5d7t4wct58tjm188ea8p"
ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "public/cln-tutorial/v4-polish/bakery-demo-premix-training-qr.png"

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--generate", action="store_true")
parser.add_argument("--image", type=Path, default=TARGET)
args = parser.parse_args()
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=12, border=4)
qr.add_data(PAYLOAD, optimize=0)
qr.make(fit=True)
if args.generate:
    assert args.image == TARGET and not TARGET.exists(), "Never replace an existing QR asset"
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    qr.make_image(fill_color="black", back_color="white").convert("RGB").save(TARGET, optimize=False)
with Image.open(args.image) as image:
    decoded = zxingcpp.read_barcodes(image)
    assert len(decoded) == 1 and decoded[0].text == PAYLOAD, "QR must independently decode to the exact zone ID"
    assert decoded[0].format == zxingcpp.BarcodeFormat.QRCode
    size = list(image.size)
data = args.image.read_bytes()
print(json.dumps({"result": "pass", "payload": PAYLOAD, "decoded": decoded[0].text,
                  "file": str(args.image), "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest(),
                  "size": size, "encoder": "python-qrcode", "encoderVersion": importlib.metadata.version("qrcode"),
                  "pillowVersion": importlib.metadata.version("Pillow"), "qrVersion": qr.version,
                  "errorCorrection": "M", "quietZoneModules": 4, "boxSize": 12,
                  "decoder": "ZXing-C++", "decoderVersion": importlib.metadata.version("zxing-cpp")}, indent=2))
