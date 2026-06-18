#!/usr/bin/env python3
"""
Batch 5: Cell Structure — Narration Generation (Chatterbox TTS)

4 TikToks:
  10. Microscopes — Magnification vs Resolution
  11. Animal Cell Tour
  12. Plant Cell — What's Different?
  13. Prokaryotes vs Eukaryotes

Voice: durai (Chatterbox — FREE)
Output: WAV → converted to MP3 via ffmpeg
Cost: $0.00
"""

import os
import sys
import time
import subprocess
import requests
from pathlib import Path

CHATTERBOX_URL = "http://localhost:8765"
AUDIO_DIR = Path(__file__).parent.parent / "remotion" / "public" / "audio" / "biology"
VOICE_ID = "durai"
EXAGGERATION = 0.5

SCRIPTS = [
    {
        "id": "microscopes",
        "filename": "microscopes-narration",
        "text": """You can see a cell. But can you see what's inside it? That depends on two things.

Magnification and resolution. They're not the same — and the exam WILL test you on this.

Magnification is how many times larger the image is compared to the real object. Calculate it with this formula — magnification equals image size divided by actual size. The triangle — I A M. You need to rearrange it for any of the three.

But here's the catch — a blurry image magnified a thousand times is still blurry. That's where resolution comes in. Resolution is the minimum distance between two points that can still be distinguished as separate. The smaller the distance — the higher the resolution — the more detail you see.

Light microscopes. Maximum magnification — about fifteen hundred times. Resolution — two hundred nanometres. Good enough for cells and large organelles — nucleus, mitochondria, chloroplasts. You can see them.

Electron microscopes. Magnification — up to five hundred thousand times. Resolution — as low as one nanometre. Now you can see ribosomes, endoplasmic reticulum, the internal structure of mitochondria.

Two types. TEM — transmission electron microscope. A beam passes through a thin slice. You get a flat, detailed, two-D image of internal structures. SEM — scanning electron microscope. The beam bounces off the surface. You get a three-D image of the outside.

Magnification makes things bigger. Resolution makes things clearer. Know the difference — know the formula — that's your marks.""",
    },
    {
        "id": "animal-cell",
        "filename": "animal-cell-narration",
        "text": """Every animal cell has the same basic components. Let's tour them — one by one.

The cell surface membrane. A phospholipid bilayer that controls what enters and leaves. It's partially permeable — small molecules pass through, large ones need transport proteins.

The nucleus. The control centre. It contains chromatin — DNA bound to histone proteins. The nuclear envelope has pores that allow mRNA out. Inside the nucleus — the nucleolus. It makes ribosomal RNA.

Mitochondria. The powerhouse. Double membrane — the inner one is folded into cristae. These folds increase surface area for aerobic respiration. The matrix inside contains enzymes and its own circular DNA.

Rough endoplasmic reticulum. Covered in ribosomes. It makes proteins — especially ones destined for export from the cell. Smooth ER has no ribosomes — it makes lipids and steroids.

The Golgi apparatus. A stack of flattened membrane sacs. It modifies, packages, and sorts proteins into vesicles. Think of it as the cell's post office.

Ribosomes. Tiny — only twenty nanometres. Made of RNA and protein. They're where translation happens — mRNA becomes protein. Free ribosomes make proteins for the cytoplasm. Bound ribosomes make proteins for export.

Lysosomes. Membrane-bound sacs full of hydrolytic enzymes. They digest worn-out organelles, engulfed pathogens, and cellular debris.

Centrioles. Two bundles of microtubules at right angles. They form the spindle during cell division — pulling chromosomes apart.

That's your animal cell. Membrane, nucleus, mitochondria, ER, Golgi, ribosomes, lysosomes, centrioles. Know the structure AND the function — that's full marks.""",
    },
    {
        "id": "plant-cell",
        "filename": "plant-cell-narration",
        "text": """Plant cells have everything animal cells have — plus three extra structures. These three are what make plants plants.

First — the cell wall. Made of cellulose. It's fully permeable — lets everything through. Its job is structural support. It prevents the cell from bursting when water enters by osmosis. The pressure that builds up — turgor pressure — keeps the plant rigid.

Second — chloroplasts. Double membrane, like mitochondria. Inside — stacks of flattened membrane sacs called thylakoids. A stack of thylakoids is a granum. The thylakoid membranes contain chlorophyll — that's where light absorption happens. The fluid around them — the stroma — is where the Calvin cycle runs. And just like mitochondria — chloroplasts have their own DNA.

Third — the large central vacuole. It's huge — takes up most of the cell. Surrounded by a membrane called the tonoplast. Filled with cell sap — water, sugars, pigments, waste products. It maintains turgor pressure. In flower petals, it stores coloured pigments.

Now here's what the exam loves to test. Compare animal and plant cells. Both have — membrane, nucleus, mitochondria, ribosomes, ER, Golgi. Only plant cells have — cell wall, chloroplasts, large permanent vacuole. Only animal cells have — centrioles. Animal cells have small temporary vacuoles. Plant cells have one large permanent one.

Cell wall for support. Chloroplasts for photosynthesis. Vacuole for turgor. Three structures — three functions. That's your comparison done.""",
    },
    {
        "id": "prokaryotes-eukaryotes",
        "filename": "prokaryotes-eukaryotes-narration",
        "text": """Two types of cell exist on Earth. Prokaryotic and eukaryotic. The difference is fundamental.

Eukaryotic cells have a nucleus. The DNA is enclosed in a nuclear envelope. They have membrane-bound organelles — mitochondria, ER, Golgi. They're larger — typically ten to one hundred micrometres. Animals, plants, fungi — all eukaryotes.

Prokaryotic cells have no nucleus. The DNA is a single circular chromosome — naked, not wrapped around histones. It sits in the nucleoid region — no membrane around it. They're smaller — typically one to five micrometres. Bacteria are prokaryotes.

But prokaryotes still have structure. A cell wall — but NOT cellulose. In bacteria it's made of peptidoglycan. A cell surface membrane inside the wall. Ribosomes — but smaller. Seventy S in prokaryotes versus eighty S in eukaryotes. That size difference matters — antibiotics target seventy S ribosomes without harming our eighty S ones.

Some prokaryotes have extra features. Plasmids — small circles of extra DNA. They carry genes for antibiotic resistance. Flagella — for movement. A capsule — a slimy layer outside the cell wall for protection. Pili — short projections for attachment and DNA transfer.

Here's the exam summary. Eukaryotes — nucleus, membrane-bound organelles, larger, linear DNA with histones, eighty S ribosomes. Prokaryotes — no nucleus, no membrane-bound organelles, smaller, circular DNA without histones, seventy S ribosomes, may have plasmids.

Pro means before. Karyon means kernel — meaning nucleus. Prokaryote — before the nucleus. Eukaryote — true nucleus. That etymology tells you everything.""",
    },
]


def check_server():
    """Check if Chatterbox server is running"""
    try:
        r = requests.get(f"{CHATTERBOX_URL}/health", timeout=5)
        return r.status_code == 200
    except:
        return False


def generate_and_convert(script: dict) -> bool:
    """Generate WAV with Chatterbox, convert to MP3 with ffmpeg"""
    wav_path = AUDIO_DIR / f"{script['filename']}.wav"
    mp3_path = AUDIO_DIR / f"{script['filename']}.mp3"

    # Generate WAV
    print(f"  Generating with Chatterbox (voice: {VOICE_ID})...")
    start = time.time()

    try:
        response = requests.post(
            f"{CHATTERBOX_URL}/generate",
            data={
                "text": script["text"],
                "voice_id": VOICE_ID,
                "exaggeration": str(EXAGGERATION),
                "cfg_weight": "0.5",
            },
            timeout=600,  # 10 min timeout for CPU
        )

        if response.status_code != 200:
            print(f"  ✗ Generation failed: {response.text}")
            return False

        with open(wav_path, "wb") as f:
            f.write(response.content)

        elapsed = time.time() - start
        wav_size = wav_path.stat().st_size / 1024
        print(f"  ✓ WAV: {wav_size:.0f} KB ({elapsed:.1f}s)")

    except Exception as e:
        print(f"  ✗ Generation error: {e}")
        return False

    # Convert WAV → MP3
    print(f"  Converting to MP3...")
    try:
        subprocess.run(
            [
                "ffmpeg", "-y", "-i", str(wav_path),
                "-codec:a", "libmp3lame", "-qscale:a", "2",
                str(mp3_path),
            ],
            capture_output=True,
            check=True,
        )
        mp3_size = mp3_path.stat().st_size / 1024
        print(f"  ✓ MP3: {mp3_size:.0f} KB")

        # Remove WAV to save space
        wav_path.unlink()
        return True

    except subprocess.CalledProcessError as e:
        print(f"  ✗ ffmpeg error: {e.stderr.decode()}")
        return False


def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    print("═══ Biology Batch 5 — Cell Structure — Chatterbox Narration ═══")
    print(f"Voice: {VOICE_ID}")
    print(f"Output: {AUDIO_DIR}")
    print(f"Cost: $0.00 (Chatterbox — FREE)\n")

    if not check_server():
        print("✗ Chatterbox server not running!")
        print("  Start it: cd packages/backend/src/chatterbox && python server.py")
        sys.exit(1)

    total_start = time.time()
    success = 0

    for i, script in enumerate(SCRIPTS, 1):
        print(f"\n── [{i}/{len(SCRIPTS)}] {script['id']} ──")
        chars = len(script["text"])
        elevenlabs_cost = (chars / 1000) * 0.30
        print(f"  {chars} chars (would cost ${elevenlabs_cost:.2f} on ElevenLabs)")

        if generate_and_convert(script):
            success += 1

    total_time = time.time() - total_start
    total_chars = sum(len(s["text"]) for s in SCRIPTS)
    saved = (total_chars / 1000) * 0.30

    print(f"\n═══ Done: {success}/{len(SCRIPTS)} generated in {total_time:.0f}s ═══")
    print(f"Total characters: {total_chars}")
    print(f"ElevenLabs would cost: ${saved:.2f}")
    print(f"Chatterbox cost: $0.00")
    print(f"Saved: ${saved:.2f}")


if __name__ == "__main__":
    main()
