#!/bin/bash
# Combine Circle Geometry videos with Durai narration
# Uses ffmpeg to sync each video with its narration

VIDEO_DIR="/home/dachu/Documents/projects/content-engine/packages/backend/src/manim/output/circle-geometry-v3/videos/circle_geometry_chalk_v3/720p30"
AUDIO_DIR="/home/dachu/Documents/projects/content-engine/packages/backend/src/chatterbox/output/narration"
OUTPUT_DIR="/home/dachu/Documents/projects/content-engine/packages/backend/src/chatterbox/output/narrated"
mkdir -p "$OUTPUT_DIR"

echo "============================================================"
echo "  COMBINING CIRCLE GEOMETRY WITH DURAI NARRATION"
echo "============================================================"
echo ""

# Mapping: video file -> audio file
declare -A VIDEO_AUDIO_MAP
VIDEO_AUDIO_MAP["CircleGeometryIntroV3.mp4"]="01_intro.wav"
VIDEO_AUDIO_MAP["CentralAngleTheoremV3.mp4"]="02_central_angle.wav"
VIDEO_AUDIO_MAP["InscribedAngleTheoremV3.mp4"]="03_inscribed_angle.wav"
VIDEO_AUDIO_MAP["CyclicQuadrilateralV3.mp4"]="04_cyclic_quadrilateral.wav"
VIDEO_AUDIO_MAP["AngleInSemicircleV3.mp4"]="05_semicircle.wav"
VIDEO_AUDIO_MAP["TangentRadiusTheoremV3.mp4"]="06_tangent_radius.wav"
VIDEO_AUDIO_MAP["TwoTangentsTheoremV3.mp4"]="07_two_tangents.wav"
VIDEO_AUDIO_MAP["AlternateSegmentTheoremV3.mp4"]="08_alternate_segment.wav"
VIDEO_AUDIO_MAP["IntersectingChordsTheoremV3.mp4"]="09_intersecting_chords.wav"
VIDEO_AUDIO_MAP["TangentSecantTheoremV3.mp4"]="10_tangent_secant.wav"
VIDEO_AUDIO_MAP["CircleTheoremsSummaryV3.mp4"]="11_summary.wav"

# Order for final concatenation
ORDER=(
    "CircleGeometryIntroV3.mp4"
    "CentralAngleTheoremV3.mp4"
    "InscribedAngleTheoremV3.mp4"
    "CyclicQuadrilateralV3.mp4"
    "AngleInSemicircleV3.mp4"
    "TangentRadiusTheoremV3.mp4"
    "TwoTangentsTheoremV3.mp4"
    "AlternateSegmentTheoremV3.mp4"
    "IntersectingChordsTheoremV3.mp4"
    "TangentSecantTheoremV3.mp4"
    "CircleTheoremsSummaryV3.mp4"
)

# Process each video
CONCAT_LIST="$OUTPUT_DIR/concat_list.txt"
> "$CONCAT_LIST"

for i in "${!ORDER[@]}"; do
    video="${ORDER[$i]}"
    audio="${VIDEO_AUDIO_MAP[$video]}"
    output_name="$(printf '%02d' $((i+1)))_$(basename "$video" .mp4)_narrated.mp4"

    echo "[$(($i+1))/11] Processing: $video"

    video_path="$VIDEO_DIR/$video"
    audio_path="$AUDIO_DIR/$audio"
    output_path="$OUTPUT_DIR/$output_name"

    # Get durations
    video_dur=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$video_path")
    audio_dur=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$audio_path")

    echo "  Video: ${video_dur}s, Audio: ${audio_dur}s"

    # Use audio duration as target, adjust video speed
    # Calculate speed factor (video_dur / audio_dur)
    speed=$(echo "scale=4; $video_dur / $audio_dur" | bc)

    if (( $(echo "$speed > 1.5" | bc -l) )); then
        # Video is much longer than audio - use video duration, pad audio with silence
        echo "  Padding audio to match video..."
        ffmpeg -y -i "$video_path" -i "$audio_path" \
            -filter_complex "[1:a]apad=whole_dur=$video_dur[a]" \
            -map 0:v -map "[a]" \
            -c:v copy -c:a aac -b:a 128k \
            "$output_path" 2>/dev/null
    elif (( $(echo "$speed < 0.7" | bc -l) )); then
        # Audio is much longer than video - slow down video to match
        echo "  Slowing video to match audio..."
        ffmpeg -y -i "$video_path" -i "$audio_path" \
            -filter_complex "[0:v]setpts=$(echo "scale=4; 1/$speed" | bc)*PTS[v]" \
            -map "[v]" -map 1:a \
            -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k \
            -shortest \
            "$output_path" 2>/dev/null
    else
        # Durations are close enough - just combine
        echo "  Combining with slight adjustment..."
        ffmpeg -y -i "$video_path" -i "$audio_path" \
            -filter_complex "[0:v]setpts=$(echo "scale=4; 1/$speed" | bc)*PTS[v]" \
            -map "[v]" -map 1:a \
            -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k \
            -shortest \
            "$output_path" 2>/dev/null
    fi

    echo "  Created: $output_name"
    echo "file '$output_path'" >> "$CONCAT_LIST"
    echo ""
done

# Concatenate all into final video
echo "============================================================"
echo "  CREATING FINAL COMBINED VIDEO"
echo "============================================================"

FINAL_OUTPUT="$OUTPUT_DIR/CircleGeometry-Complete-Narrated.mp4"
ffmpeg -y -f concat -safe 0 -i "$CONCAT_LIST" -c copy "$FINAL_OUTPUT" 2>/dev/null

# Get final stats
final_dur=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$FINAL_OUTPUT")
final_size=$(du -h "$FINAL_OUTPUT" | cut -f1)

echo ""
echo "============================================================"
echo "  COMPLETE!"
echo "============================================================"
echo "  Output: $FINAL_OUTPUT"
echo "  Duration: ${final_dur}s ($(echo "scale=1; $final_dur / 60" | bc) min)"
echo "  Size: $final_size"
echo "  Voice: Durai (YOUR voice clone)"
echo "  Cost: \$0.00 (Chatterbox - FREE)"
echo "============================================================"
