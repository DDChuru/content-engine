#!/usr/bin/env python3
"""Generate the eight Drawing Travel Graphs narration tracks with ElevenLabs."""

import os
import subprocess
import sys
from hashlib import sha1
from dataclasses import dataclass
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
CHATTERBOX_DIR = SCRIPT_DIR.parent / "chatterbox"
PUBLIC_AUDIO_DIR = SCRIPT_DIR.parent / "remotion/public/audio/mechanics"
VOICE_ID = "gYWKdgLtqjPO3D5uDrDP"

sys.path.insert(0, str(CHATTERBOX_DIR))
from narration_client import TTS_PROVIDER, generate_narration  # noqa: E402


@dataclass(frozen=True)
class TimedBeat:
    start: float
    hold_start: float
    parts: tuple[str, ...]


@dataclass(frozen=True)
class Scene:
    scene_id: str
    duration: float
    speed: float
    narration: str | None = None
    beats: tuple[TimedBeat, ...] = ()
    final_silence_until: float | None = None


SCENES = (
    Scene(
        "s01",
        15,
        1.0,
        "A travel graph turns a journey into shapes. Choose positive. Split the story into phases and add their durations to mark key times. Choose each phase's shape, label axes and units, then mark key values and sign changes.",
    ),
    Scene(
        "s02",
        20,
        1.0,
        "Read the verbs as drawing instructions. Steadily gives a horizontal velocity line. Uniformly slows gives a straight slope to zero. Waits sits on the axis. Returns belongs below zero, because away is positive. Add durations; the phase times are cumulative.",
    ),
    Scene(
        "s03",
        20,
        1.0,
        "Displacement-time gradient gives velocity; steeper means faster. Velocity-time height must match that gradient at the same instant. Going back, accumulate signed areas from the starting displacement. Positive area adds; negative area subtracts. Now use that bridge to build both graphs for this lift.",
    ),
    Scene(
        "s04",
        75,
        0.9,
        beats=(
            TimedBeat(0, 10, ("What speed follows the acceleration?", "Three metres per second. That is the first velocity corner's height.")),
            TimedBeat(12, 20, ("When does the cruise end?", "Six seconds. That is elapsed time from the start.")),
            TimedBeat(22, 28, ("When does the lift stop?", "Eight seconds. It is now at rest.")),
            TimedBeat(30, 37, ("What does the first triangle give?", "Three metres. This is the first rise.")),
            TimedBeat(39, 45, ("What does the rectangle add?", "Twelve metres. This is the cruise's rise.")),
            TimedBeat(47, 53, ("Where are we now?", "Fifteen metres. This is the accumulated height.")),
            TimedBeat(55, 62, ("What does braking add?", "Three metres. The lift still moves upwards.")),
            TimedBeat(64, 72, ("So... where does it finish?", "Eighteen metres. That is above its starting floor.")),
        ),
        final_silence_until=74,
    ),
    Scene(
        "s05",
        20,
        1.0,
        "Positive velocity makes displacement rise. Zero velocity makes it level. Negative velocity makes it fall. On the return, velocity is negative, but displacement remains positive until the traveller reaches the start. Keep the whole return leg; arriving back does not erase it.",
    ),
    Scene(
        "s06",
        65,
        0.9,
        beats=(
            TimedBeat(0, 13, ("Why is the velocity line straight?", "With upwards positive, constant gravity makes velocity decrease uniformly. Its gradient is constant.")),
            TimedBeat(13, 23, ("Where does direction change?", "One point five seconds. Velocity is zero at the highest point.")),
            TimedBeat(25, 37, ("How high is that?", "Eleven point zero two five metres. The positive triangular area gives the maximum rise.")),
            TimedBeat(39, 47, ("When is it caught?", "Three seconds. Equal signed areas return it to hand height.")),
            TimedBeat(49, 57, ("What velocity is that?", "Minus fourteen point seven metres per second. The ball is moving downwards.")),
            TimedBeat(59, 65, ("So... what matters?", "Show turning, negative velocity and continuous displacement.")),
        ),
    ),
    Scene(
        "s07",
        15,
        1.0,
        "A sketch needs correct shapes, signs and phase order. An accurate plot also needs calculated coordinates and consistent scales. Check both for labelled axes, units, key times and values. Show the negative region whenever motion reverses.",
    ),
    Scene(
        "s08",
        20,
        1.0,
        "Recap. Choose positive. Mark the key times. Turn each phrase into the right segment. On displacement-time, gradient gives velocity. On velocity-time, signed area gives displacement change. Label axes, units and key values. Show every stop and every sign change. Then run the examiner's shape check.",
    ),
)


def duration(path: Path) -> float:
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return float(result.stdout.strip())


def synthesize(text: str, scene_id: str, part_index: int, speed: float) -> Path:
    os.environ["ELEVENLABS_SPEED"] = str(speed)
    text_hash = sha1(text.encode("utf-8")).hexdigest()[:8]
    output_name = (
        f"drawing-travel-graphs-{scene_id}-part-{part_index:02d}-{text_hash}.mp3"
    )
    raw_path = CHATTERBOX_DIR / "output/narration" / output_name
    if raw_path.is_file():
        print(f"Reusing {raw_path}")
    else:
        raw_path = Path(
            generate_narration(
                text=text,
                voice_id=VOICE_ID,
                output_filename=output_name,
            )
        )

    # This voice leaves long dramatic gaps even in brisk prose. Keep the
    # requested provider speed, but contract only detected silence so the
    # spoken script fits its storyboard slot. Slow scenes retain wider gaps;
    # their written ellipses are inserted separately as full one-second rests.
    compact_path = raw_path.with_name(f"{raw_path.stem}-compact.mp3")
    kept_silence = 0.10 if speed == 0.9 else 0.06
    if scene_id == "s06" and part_index >= 11:
        kept_silence = 0.0
    if scene_id == "s07":
        kept_silence = 0.0
    subprocess.run(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            str(raw_path),
            "-af",
            (
                "silenceremove=stop_periods=-1:stop_duration=0.08:"
                f"stop_threshold=-42dB:stop_silence={kept_silence}"
            ),
            "-codec:a",
            "libmp3lame",
            "-b:a",
            "192k",
            str(compact_path),
        ],
        check=True,
    )
    return compact_path


def mix_scene(scene: Scene, scheduled: list[tuple[Path, float]], minimum_duration: float) -> Path:
    output = PUBLIC_AUDIO_DIR / f"drawing-travel-graphs-{scene.scene_id}.mp3"
    inputs = [
        "-f",
        "lavfi",
        "-t",
        f"{minimum_duration:.3f}",
        "-i",
        "anullsrc=channel_layout=stereo:sample_rate=44100",
    ]
    filters = ["[0:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[base]"]
    labels = ["[base]"]
    for index, (path, start) in enumerate(scheduled, 1):
        inputs.extend(["-i", str(path)])
        delay_ms = round(start * 1000)
        label = f"clip{index}"
        filters.append(
            f"[{index}:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,"
            f"adelay={delay_ms}:all=1[{label}]"
        )
        labels.append(f"[{label}]")
    filters.append(
        f"{''.join(labels)}amix=inputs={len(labels)}:duration=first:dropout_transition=0:normalize=0[out]"
    )
    subprocess.run(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            *inputs,
            "-filter_complex",
            ";".join(filters),
            "-map",
            "[out]",
            "-codec:a",
            "libmp3lame",
            "-b:a",
            "192k",
            str(output),
        ],
        check=True,
    )
    encoded_duration = duration(output)
    if encoded_duration > scene.duration:
        raise RuntimeError(
            f"{scene.scene_id} is {encoded_duration:.3f}s, beyond its {scene.duration:.3f}s scene"
        )
    print(f"Wrote {output} ({encoded_duration:.3f}s)")
    return output


def generate_scene(scene: Scene) -> Path:
    scheduled: list[tuple[Path, float]] = []
    latest_end = 0.0
    if scene.narration is not None:
        clip = synthesize(scene.narration, scene.scene_id, 1, scene.speed)
        clip_duration = duration(clip)
        if clip_duration > scene.duration - 0.2:
            raise RuntimeError(
                f"{scene.scene_id} narration is {clip_duration:.3f}s, beyond its scene slot"
            )
        scheduled.append((clip, 0))
        latest_end = clip_duration
    else:
        part_index = 0
        for beat in scene.beats:
            cursor = beat.start
            for index, text in enumerate(beat.parts):
                part_index += 1
                clip = synthesize(text, scene.scene_id, part_index, scene.speed)
                scheduled.append((clip, cursor))
                cursor += duration(clip)
                if index < len(beat.parts) - 1:
                    cursor += 1.0
            if cursor > beat.hold_start + 0.12:
                raise RuntimeError(
                    f"{scene.scene_id} beat at {beat.start:.0f}s ends at {cursor:.3f}s, "
                    f"after its hold starts at {beat.hold_start:.3f}s"
                )
            latest_end = max(latest_end, cursor)

    minimum_duration = max(latest_end, scene.final_silence_until or 0)
    return mix_scene(scene, scheduled, minimum_duration)


def main() -> None:
    if TTS_PROVIDER != "elevenlabs":
        raise RuntimeError("Run with TTS_PROVIDER=elevenlabs")
    if not os.environ.get("ELEVENLABS_API_KEY"):
        raise RuntimeError("ELEVENLABS_API_KEY is required")
    PUBLIC_AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    for scene in SCENES:
        generate_scene(scene)


if __name__ == "__main__":
    main()
