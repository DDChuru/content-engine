"""
Render Script for Sets Lesson
Renders all scenes and exports for studio workflow integration
"""

import subprocess
import json
import os
from pathlib import Path

# Scene definitions with metadata
SCENES = [
    {"id": "title", "class": "IntroTitle", "file": "sets_lesson.py", "duration": 4},
    {"id": "step1", "class": "WhatIsASet", "file": "sets_lesson.py", "duration": 8},
    {"id": "step2", "class": "SetNotation", "file": "sets_lesson.py", "duration": 7},
    {"id": "step3", "class": "VennIntro", "file": "sets_lesson.py", "duration": 4},
    {"id": "step4", "class": "SetAVisualized", "file": "sets_lesson.py", "duration": 6},
    {"id": "step5", "class": "TwoSetsOverlap", "file": "sets_lesson.py", "duration": 7},
    {"id": "step6", "class": "IntersectionHighlight", "file": "sets_lesson.py", "duration": 6},
    {"id": "step7", "class": "UnionConcept", "file": "sets_lesson.py", "duration": 6},
    {"id": "step7b", "class": "UnionVennMorph", "file": "sets_lesson.py", "duration": 15},
    {"id": "step6b", "class": "IntersectionVennMorph", "file": "sets_lesson.py", "duration": 15},
    {"id": "step9", "class": "UniversalSetIntro", "file": "sets_lesson.py", "duration": 8},
    {"id": "step10", "class": "UniversalSetExample", "file": "sets_lesson.py", "duration": 7},
    {"id": "step11", "class": "PracticeQuestion1", "file": "sets_lesson_part2.py", "duration": 8},
    {"id": "step12", "class": "PracticeQuestion2", "file": "sets_lesson_part2.py", "duration": 8},
    {"id": "step13", "class": "SpotTheError", "file": "sets_lesson_part2.py", "duration": 8},
    {"id": "step13a", "class": "ErrorRevealed", "file": "sets_lesson_part2.py", "duration": 7},
    {"id": "step14", "class": "TrueFalse1", "file": "sets_lesson_part2.py", "duration": 8},
    {"id": "step15", "class": "TrueFalse2", "file": "sets_lesson_part2.py", "duration": 8},
    {"id": "step8", "class": "SummaryScene", "file": "sets_lesson.py", "duration": 10},
]


def render_scene(scene_info, quality="m", output_dir="output/manim"):
    """Render a single scene"""
    scene_id = scene_info["id"]
    scene_class = scene_info["class"]
    scene_file = scene_info["file"]

    # Quality mapping
    quality_map = {
        "low": "l",
        "medium": "m",
        "high": "h",
        "production": "p",
        "4k": "k",
        "l": "l",
        "m": "m",
        "h": "h",
        "p": "p",
        "k": "k"
    }
    quality_flag = quality_map.get(quality, "m")

    print(f"\n{'='*60}")
    print(f"Rendering: {scene_id} ({scene_class})")
    print(f"Quality: {quality_flag} ({quality})")
    print(f"{'='*60}\n")

    # Create output directory
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    # Manim render command
    cmd = [
        "manim",
        "render",
        "-q", quality_flag,
        "--format", "mp4",
        "--media_dir", output_dir,
        scene_file,
        scene_class
    ]

    try:
        result = subprocess.run(
            cmd,
            cwd=os.path.dirname(__file__),
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            print(f"✅ Successfully rendered {scene_id}")

            # Find the output file
            output_file = find_latest_video(output_dir, scene_class)

            if output_file:
                # Rename to scene ID for easier identification
                final_path = os.path.join(output_dir, f"{scene_id}.mp4")
                os.rename(output_file, final_path)
                print(f"   Saved to: {final_path}")

                return {
                    "success": True,
                    "scene_id": scene_id,
                    "path": final_path,
                    "duration": scene_info["duration"]
                }
            else:
                print(f"⚠️  Warning: Could not find output file for {scene_id}")
                return {"success": False, "scene_id": scene_id, "error": "Output file not found"}

        else:
            print(f"❌ Error rendering {scene_id}")
            print(f"Error: {result.stderr}")
            return {"success": False, "scene_id": scene_id, "error": result.stderr}

    except Exception as e:
        print(f"❌ Exception rendering {scene_id}: {str(e)}")
        return {"success": False, "scene_id": scene_id, "error": str(e)}


def find_latest_video(directory, scene_class):
    """Find the most recently created video file for a scene"""
    pattern = f"**/{scene_class}.mp4"
    matches = list(Path(directory).glob(pattern))

    if matches:
        # Return the most recently modified
        return str(max(matches, key=lambda p: p.stat().st_mtime))

    return None


def render_all_scenes(quality="m", output_dir="output/manim"):
    """Render all scenes in the lesson"""
    print("\n" + "="*60)
    print("SETS LESSON - MANIM RENDER")
    print("="*60)
    print(f"Quality: {quality}")
    print(f"Output: {output_dir}")
    print(f"Total scenes: {len(SCENES)}")
    print("="*60 + "\n")

    results = []

    for i, scene in enumerate(SCENES, 1):
        print(f"\n[{i}/{len(SCENES)}]", end=" ")
        result = render_scene(scene, quality, output_dir)
        results.append(result)

    # Summary
    print("\n" + "="*60)
    print("RENDER SUMMARY")
    print("="*60)

    successful = [r for r in results if r["success"]]
    failed = [r for r in results if not r["success"]]

    print(f"✅ Successful: {len(successful)}/{len(SCENES)}")
    print(f"❌ Failed: {len(failed)}/{len(SCENES)}")

    if failed:
        print("\nFailed scenes:")
        for r in failed:
            print(f"  - {r['scene_id']}: {r.get('error', 'Unknown error')}")

    # Export metadata
    metadata_path = os.path.join(output_dir, "lesson_metadata.json")
    metadata = {
        "title": "Introduction to Sets",
        "subtitle": "Cambridge IGCSE Mathematics",
        "total_scenes": len(SCENES),
        "total_duration": sum(s["duration"] for s in SCENES),
        "scenes": results
    }

    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)

    print(f"\n📄 Metadata saved to: {metadata_path}")
    print("="*60 + "\n")

    return results


def render_single(scene_id, quality="m"):
    """Render a single scene by ID (for quick iteration)"""
    scene = next((s for s in SCENES if s["id"] == scene_id), None)

    if not scene:
        print(f"❌ Scene not found: {scene_id}")
        print(f"Available scenes: {', '.join(s['id'] for s in SCENES)}")
        return

    return render_scene(scene, quality)


def create_preview_html(output_dir="output/manim"):
    """Create an HTML preview file to view all scenes"""
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sets Lesson - Manim Preview</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        h1 {
            color: #667eea;
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #718096;
            font-size: 1.2rem;
            margin-bottom: 40px;
        }
        .scene {
            margin-bottom: 40px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
        }
        .scene-header {
            background: #f7fafc;
            padding: 15px 20px;
            border-bottom: 2px solid #e2e8f0;
        }
        .scene-title {
            font-size: 1.3rem;
            color: #2d3748;
            font-weight: 600;
        }
        .scene-id {
            color: #718096;
            font-size: 0.9rem;
            margin-top: 4px;
        }
        video {
            width: 100%;
            display: block;
            background: #000;
        }
        .controls {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
        }
        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            margin: 5px;
        }
        button:hover { background: #5a67d8; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Introduction to Sets</h1>
        <p class="subtitle">Cambridge IGCSE Mathematics - Manim Preview</p>

"""

    # Add each scene with cache-busting timestamp
    import time
    timestamp = int(time.time())

    for scene in SCENES:
        scene_id = scene["id"]
        video_path = f"{scene_id}.mp4?v={timestamp}"

        html += f"""
        <div class="scene">
            <div class="scene-header">
                <div class="scene-title">Scene: {scene['class']}</div>
                <div class="scene-id">ID: {scene_id} | Duration: ~{scene['duration']}s</div>
            </div>
            <video controls>
                <source src="{video_path}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
"""

    html += """
    </div>

    <div class="controls">
        <button onclick="playAll()">▶ Play All</button>
        <button onclick="stopAll()">⏹ Stop All</button>
    </div>

    <script>
        function playAll() {
            document.querySelectorAll('video').forEach(v => v.play());
        }
        function stopAll() {
            document.querySelectorAll('video').forEach(v => {
                v.pause();
                v.currentTime = 0;
            });
        }
    </script>
</body>
</html>
"""

    preview_path = os.path.join(output_dir, "preview.html")
    with open(preview_path, 'w') as f:
        f.write(html)

    print(f"📄 Preview HTML created: {preview_path}")
    print(f"   Open in browser: file://{os.path.abspath(preview_path)}")


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "all":
            # Render all scenes
            quality = sys.argv[2] if len(sys.argv) > 2 else "medium_quality"
            results = render_all_scenes(quality=quality)
            create_preview_html()

        elif command == "single":
            # Render single scene
            if len(sys.argv) < 3:
                print("Usage: python render_sets_lesson.py single <scene_id> [quality]")
                print(f"Available scenes: {', '.join(s['id'] for s in SCENES)}")
                sys.exit(1)

            scene_id = sys.argv[2]
            quality = sys.argv[3] if len(sys.argv) > 3 else "medium_quality"
            render_single(scene_id, quality)

        elif command == "preview":
            # Create preview HTML only
            create_preview_html()

        else:
            print(f"Unknown command: {command}")
            print("Available commands: all, single, preview")

    else:
        print("Usage:")
        print("  python render_sets_lesson.py all [quality]")
        print("  python render_sets_lesson.py single <scene_id> [quality]")
        print("  python render_sets_lesson.py preview")
        print("\nQuality options: l/low, m/medium, h/high, p/production, k/4k")
        print(f"\nAvailable scenes: {', '.join(s['id'] for s in SCENES)}")
