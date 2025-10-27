# Audio Narration for WebSlides - Complete Guide

## What We Built

✅ **Audio System in WebSlides** (`sets-demo.html`)
- Automatic audio playback when slides change
- `data-audio` attribute on each slide
- Stops previous audio when moving to next slide
- Example: `<section data-audio="narration-venn.mp3">`

✅ **Slide 3 Updated** - Now uses Manim video instead of D3 interactive diagram
- Embedded `sets-complete.mp4` (55 seconds, 960 KB)
- Numbers animate into drawn sets (Manim-First standard)
- Audio narration ready: `data-audio="narration-venn.mp3"`

## How Audio Works

### 1. Add `data-audio` attribute to any slide:

```html
<section class="bg-black aligncenter" data-audio="narration-intro.mp3">
  <h1>Welcome to Set Theory</h1>
  <p>Let's explore the fascinating world of sets...</p>
</section>
```

### 2. Audio plays automatically when:
- User navigates to that slide (arrow keys, swipe, click)
- First slide loads on page load
- Previous audio stops automatically

### 3. No user interaction required!
- Students just press arrow keys to advance
- Audio narration plays for each slide
- Video animations play inline
- Completely offline-capable

## Generating Audio Narration with ElevenLabs

### Cost: $0.30 per 1,000 characters

**Example narration scripts:**

#### Slide 1: Title (15 seconds)
```
Welcome to Set Theory, part of Cambridge IGCSE Mathematics.
In this lesson, we'll explore Venn diagrams and set operations.
Let's begin!
```
**Characters:** 150 → **Cost: $0.045**

#### Slide 2: Definition (20 seconds)
```
A set is a collection of distinct objects, called elements.
For example, Set A contains the numbers 1, 2, 3, 4, and 5.
Set B contains 4, 5, 6, 7, and 8.
Notice that 4 and 5 appear in both sets.
```
**Characters:** 180 → **Cost: $0.054**

#### Slide 3: Venn Diagram Animation (55 seconds - matches video!)
```
Watch as we visualize these sets using a Venn diagram.
First, we draw the universal set containing all elements.
Now, Set A appears as a blue circle, and the numbers 1 through 5 move into position.
Next, Set B draws itself as a green circle, overlapping with Set A.
The numbers 4 and 5 are highlighted in yellow, showing they belong to both sets - this is the intersection.
Numbers 6, 7, and 8 move into Set B.
Finally, the union of both sets is shown in orange, containing all elements from 1 to 8.
```
**Characters:** 490 → **Cost: $0.147**

#### Slide 4: Set Notation (30 seconds)
```
Let's learn the mathematical notation for sets.
We write Set A in curly braces: A equals 1, 2, 3, 4, 5.
The intersection symbol, a upside-down U, represents elements in both sets.
A intersect B equals 4, 5.
The union symbol, a right-side-up U, represents all elements in either set.
A union B equals 1, 2, 3, 4, 5, 6, 7, 8.
```
**Characters:** 350 → **Cost: $0.105**

### Total for 7 slides: ~$0.55

## Implementation Steps

### Step 1: Create narration scripts
```bash
# Create a narration.txt file with all slide scripts
cat > narration.txt << 'EOF'
SLIDE_1: Welcome to Set Theory...
SLIDE_2: A set is a collection...
SLIDE_3: Watch as we visualize...
...
EOF
```

### Step 2: Generate audio with ElevenLabs
```typescript
import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

async function generateNarration(text: string, outputFile: string) {
  const audio = await client.generate({
    voice: "Rachel", // Professional female voice
    text: text,
    model_id: "eleven_turbo_v2" // Fast, affordable
  });

  // Save to file
  const fs = require('fs');
  const chunks = [];
  for await (const chunk of audio) {
    chunks.push(chunk);
  }
  fs.writeFileSync(outputFile, Buffer.concat(chunks));
}

// Generate all narrations
await generateNarration(slide1Text, 'narration-intro.mp3');
await generateNarration(slide2Text, 'narration-definition.mp3');
await generateNarration(slide3Text, 'narration-venn.mp3');
// ... etc
```

### Step 3: Add files to webslides-demo folder
```
webslides-demo/
├── sets-demo.html
├── sets-complete.mp4 (Manim animation)
├── narration-intro.mp3 (ElevenLabs)
├── narration-definition.mp3
├── narration-venn.mp3
├── narration-notation.mp3
├── narration-key-concepts.mp3
├── narration-quiz.mp3
└── narration-summary.mp3
```

### Step 4: Open in browser
```bash
xdg-open sets-demo.html
# Or serve locally:
python3 -m http.server 8000
```

## Complete Student Experience

1. **Open presentation** (local HTML file or web server)
2. **Slide 1:** Audio narration plays automatically - "Welcome to Set Theory..."
3. **Press → arrow key** - Move to Slide 2
4. **Slide 2:** Previous audio stops, new audio plays - "A set is a collection..."
5. **Press → arrow key** - Move to Slide 3
6. **Slide 3:** Audio plays - "Watch as we visualize..." + Manim video plays showing numbers moving into sets
7. **Continue through all slides** with synchronized audio + visuals

## Benefits

✅ **Professional narration** - Natural-sounding AI voice (ElevenLabs)
✅ **Synchronized with visuals** - Audio matches video duration
✅ **Offline-capable** - All assets embedded in folder
✅ **Affordable** - $0.55 per topic (7 slides)
✅ **No manual recording** - Generated from text scripts
✅ **Consistent quality** - Same voice throughout
✅ **Easy updates** - Regenerate audio if content changes

## Cost Comparison

**Traditional approach:**
- Record audio yourself (free but time-consuming)
- Hire voice actor ($50-$200 per module)
- Studio recording ($100-$500)

**Our approach:**
- ElevenLabs TTS: **$0.55 per module**
- 99% cost savings
- Instant updates
- Professional quality

## Next Steps

1. **Create narration scripts** for all 7 slides
2. **Generate MP3 files** with ElevenLabs
3. **Test in browser** (audio should play automatically)
4. **Add to more topics** (algebra, geometry, etc.)
5. **Package as SCORM** for LMS deployment

**Status:** ✅ Audio system ready, narration scripts can be generated!
