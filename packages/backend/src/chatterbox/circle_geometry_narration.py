#!/usr/bin/env python3
"""
Circle Geometry Narration Generator
Generates voice narration for each circle geometry theorem using Chatterbox with Durai voice.
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from narration_client import batch_narrate, check_server

# Narration scripts for each circle geometry scene
CIRCLE_GEOMETRY_SCRIPTS = [
    {
        "id": "01_intro",
        "text": "Welcome to Circle Geometry. In this lesson, we'll explore the fascinating properties of circles and the theorems that govern angles, chords, and tangents. These concepts are fundamental to Cambridge IGCSE Mathematics and appear frequently in examinations."
    },
    {
        "id": "02_central_angle",
        "text": "The Central Angle Theorem states that the central angle is twice the inscribed angle when both angles subtend the same arc. Notice how the angle at the center, formed by two radii, is exactly double the angle at the circumference. This relationship is key to solving many circle problems."
    },
    {
        "id": "03_inscribed_angle",
        "text": "The Inscribed Angle Theorem tells us that all inscribed angles subtending the same arc are equal. No matter where you place the vertex on the major arc, the angle remains constant. This is sometimes called the angle in the same segment theorem."
    },
    {
        "id": "04_cyclic_quadrilateral",
        "text": "A cyclic quadrilateral has all four vertices on the circle's circumference. The key property is that opposite angles are supplementary, meaning they add up to 180 degrees. This is extremely useful for finding unknown angles in geometric problems."
    },
    {
        "id": "05_semicircle",
        "text": "The Angle in a Semicircle Theorem states that any angle inscribed in a semicircle is a right angle, exactly 90 degrees. This is because the diameter subtends an angle of 180 degrees at the center, so the inscribed angle is half of that."
    },
    {
        "id": "06_tangent_radius",
        "text": "The Tangent-Radius Theorem states that a tangent to a circle is perpendicular to the radius at the point of contact. This 90-degree angle is fundamental and forms the basis for many tangent-related calculations."
    },
    {
        "id": "07_two_tangents",
        "text": "When two tangents are drawn from an external point to a circle, they have equal length. The line from the external point to the center bisects the angle between the tangents. This creates two congruent right triangles."
    },
    {
        "id": "08_alternate_segment",
        "text": "The Alternate Segment Theorem, also called the tangent-chord angle theorem, states that the angle between a tangent and a chord equals the inscribed angle in the alternate segment. This elegant relationship connects tangent lines to inscribed angles."
    },
    {
        "id": "09_intersecting_chords",
        "text": "When two chords intersect inside a circle, a remarkable relationship emerges. The product of the segments of one chord equals the product of the segments of the other chord. If the chords have segments a, b and c, d, then a times b equals c times d."
    },
    {
        "id": "10_tangent_secant",
        "text": "The Tangent-Secant Theorem relates a tangent and a secant from an external point. The tangent squared equals the product of the whole secant and its external segment. This power of a point relationship is powerful for solving complex problems."
    },
    {
        "id": "11_summary",
        "text": "Congratulations! You've now learned the essential circle theorems for Cambridge IGCSE Mathematics. Remember: central angles are double inscribed angles, opposite angles in cyclic quadrilaterals sum to 180 degrees, tangents are perpendicular to radii, and the power of a point connects chords, secants, and tangents. Practice these theorems and you'll master circle geometry."
    }
]

if __name__ == "__main__":
    print("=" * 60)
    print("  CIRCLE GEOMETRY NARRATION GENERATOR")
    print("  Using Durai voice clone via Chatterbox (FREE)")
    print("=" * 60)

    print("\nChecking server (will wait up to 5 min if busy)...")
    if not check_server(wait_timeout=300):
        print("\nERROR: Chatterbox server not running!")
        print("Start it with: cd packages/backend/src/chatterbox && python server.py")
        sys.exit(1)
    print("Server ready!")

    # Calculate estimated time
    total_chars = sum(len(s["text"]) for s in CIRCLE_GEOMETRY_SCRIPTS)
    print(f"\nScenes: {len(CIRCLE_GEOMETRY_SCRIPTS)}")
    print(f"Total characters: {total_chars}")
    print(f"Estimated time: ~{len(CIRCLE_GEOMETRY_SCRIPTS) * 5} minutes (CPU)")
    print(f"ElevenLabs cost (saved): ${total_chars / 1000 * 0.30:.2f}")
    print()

    # Generate all narrations with Daniel voice (professional recording)
    audio_files = batch_narrate(
        CIRCLE_GEOMETRY_SCRIPTS,
        voice_id="daniel",  # Professional mic recording
        exaggeration=0.5    # Natural teaching tone
    )

    print("\n" + "=" * 60)
    print("  GENERATED AUDIO FILES:")
    print("=" * 60)
    for f in audio_files:
        print(f"  {f}")
    print()
