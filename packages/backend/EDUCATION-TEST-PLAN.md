# Educational Content Generation - Test Plan

## Prerequisites Check

### 1. Environment Variables
```bash
# Required
ANTHROPIC_API_KEY=sk_...
GEMINI_API_KEY=...
ELEVENLABS_API_KEY=sk_...
DEFAULT_VOICE_ID=dBiqpm68kZ0u53ND13mB

# Optional (for Firebase persistence)
EDUCATION_FIREBASE_KEY='{"type":"service_account",...}'
```

### 2. Dependencies
```bash
# Manim (Python - conda environment)
which manim  # Should be: /home/dachu/miniconda3/envs/aitools/bin/manim

# Node packages
npm install  # Already done
```

### 3. Output Directories
```bash
mkdir -p output/topics
mkdir -p output/test-validation
```

---

## Test Strategy

### Phase 1: Layer 3 Only (Quizzes) ✅
**Status:** Already validated
**Result:** 9/9 normalization tests passed, 10 questions generated

### Phase 2: Layer 2 with Visuals (Examples)
**What we're testing:**
- Gemini image generation (problem background)
- Manim animation generation (solution)
- Video rendering with Remotion
- Scene type correctness (image vs video)

**Expected output:**
```
output/topics/test-examples/
  examples/
    example-1.mp4
    example-2.mp4
    example-3.mp4
  visuals/
    Mathematics_problem_background_*.png  (Gemini)
    Solution_for_example-1_*.mp4          (Manim)
```

### Phase 3: Layer 1 with Visuals (Main Content)
**What we're testing:**
- Concept generation with agent
- Mixed visual types (Manim + Gemini + SVG)
- Video composition with multiple scenes
- NO TEXT enforcement in Gemini images

**Expected output:**
```
output/topics/c12-sets/
  main-content/
    c12-sets-lesson.mp4
  visuals/
    Set_Notation_*.png       (Gemini - NO TEXT)
    Union_*.mp4              (Manim animation)
```

### Phase 4: Complete 3-Layer Pipeline
**What we're testing:**
- All layers together
- Cost calculation
- Duration accuracy
- File organization

**Expected output:**
```
output/topics/c12-sets/
  main-content/
    c12-sets-lesson.mp4
  examples/
    example-1.mp4
    example-2.mp4
    example-3.mp4
  exercises/
    quiz.html
    questions.json
```

---

## Test 1: Layer 3 (Quizzes) - ALREADY PASSED ✅

**Command:**
```bash
npm run validate-quiz
```

**Result:**
```
✅ normalization: PASSED (9/9)
✅ generation: PASSED (10 questions)
✅ html: PASSED (11/11 checks)
✅ json: PASSED
```

**Skip this - move to Layer 2**

---

## Test 2: Layer 2 (Examples with Visuals)

### Test 2.1: Single Example Generation

**Create test script:**
```typescript
// test-example-generation.ts
import { ClaudeService } from './src/services/claude.js';
import { ExamplesGenerator } from './src/services/examples-generator.js';

async function testExampleGeneration() {
  console.log('Testing Example Generation with Visuals...\n');

  const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY!);
  const generator = new ExamplesGenerator(claudeService);

  const result = await generator.generateExamples({
    topicTitle: 'Sets',
    topicCode: 'C1.2',
    level: 'Core',
    concepts: ['Set notation', 'Union', 'Intersection'],
    targetCount: 1,  // Just 1 example for testing
    theme: 'education-dark',
    outputDir: 'output/test-examples'
  });

  console.log('\n=== RESULT ===');
  console.log('Success:', result.success);
  console.log('Examples:', result.examples.length);
  console.log('Total Duration:', result.totalDuration, 'seconds');
  console.log('Total Cost: $', result.totalCost.toFixed(2));

  if (result.success) {
    result.examples.forEach((ex, i) => {
      console.log(`\nExample ${i + 1}:`);
      console.log('  ID:', ex.id);
      console.log('  Problem:', ex.problem);
      console.log('  Video:', ex.videoPath);
      console.log('  Duration:', ex.duration, 'seconds');
      console.log('  Cost: $', ex.cost.toFixed(2));
    });
  } else {
    console.error('Error:', result.error);
  }
}

testExampleGeneration().catch(console.error);
```

**Run:**
```bash
tsx test-example-generation.ts
```

**Expected Output:**
```
Testing Example Generation with Visuals...

  [ExamplesGenerator] Generating examples for: Sets
  Target count: 1
  Level: Core

  [Example example-1] Creating video: "..."
    🖼️  Generating problem statement background...
    [GeminiImageGenerator] Generating image: Mathematics problem background
    [GeminiImageGenerator] ✓ Image saved: output/test-examples/visuals/Mathematics_problem_background_*.png

    🎬 Generating solution animation...
    🎬 Starting Manim render: Solution for example-1
    ✅ Manim render complete: media/videos/.../Solution_*.mp4

  [VideoRenderer] Starting WebSlides video render...
    Scenes: 2
    Theme: education-dark
    Output: output/test-examples/examples/example-1.mp4
  [VideoRenderer] Bundling Remotion project...
  [VideoRenderer] Bundle cached: file:///tmp/remotion-webpack-bundle-*
  [VideoRenderer] Composition: EducationalLesson
    Duration: 180 frames
    FPS: 30
  [VideoRenderer] ✓ Video rendered in 15.23s

=== RESULT ===
Success: true
Examples: 1
Total Duration: 180 seconds
Total Cost: $ 0.59

Example 1:
  ID: example-1
  Problem: Find the union of sets A = {1, 2, 3} and B = {3, 4, 5}
  Video: output/test-examples/examples/example-1.mp4
  Duration: 180 seconds
  Cost: $ 0.59
```

**Validation:**
```bash
# Check files exist
ls -lh output/test-examples/examples/example-1.mp4
ls -lh output/test-examples/visuals/*.png
ls -lh media/videos/*/Solution_*.mp4

# Play video (if VLC installed)
vlc output/test-examples/examples/example-1.mp4
```

**Success Criteria:**
- [ ] Gemini image generated (PNG file exists)
- [ ] NO TEXT in Gemini image (visual inspection)
- [ ] Manim animation generated (MP4 file exists)
- [ ] Final video rendered (MP4 file exists)
- [ ] Video plays correctly
- [ ] Cost < $1.00

---

## Test 3: Layer 1 (Main Content with Visuals)

### Test 3.1: Single Topic Generation

**Create test script:**
```typescript
// test-main-content-generation.ts
import { ClaudeService } from './src/services/claude.js';
import { TopicContentGenerator } from './src/services/topic-content-generator.js';

async function testMainContentGeneration() {
  console.log('Testing Main Content Generation with Visuals...\n');

  const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY!);
  const generator = new TopicContentGenerator(claudeService);

  const topic = {
    syllabusId: 'test',
    unitId: 'test-unit',
    topicId: 'test-sets',
    topicCode: 'C1.2',
    title: 'Sets',
    level: 'Core' as const,
    subtopics: ['Set notation', 'Union', 'Intersection']
  };

  const result = await generator.generateMainContent(topic, {
    voiceId: process.env.DEFAULT_VOICE_ID,
    theme: 'education-dark',
    includeLayers: {
      mainContent: true,
      examples: false,
      exercises: false
    }
  });

  console.log('\n=== RESULT ===');
  console.log('Success:', result.success);
  console.log('Video Path:', result.videoPath);
  console.log('Concepts:', result.concepts.length);
  console.log('Duration:', result.duration, 'seconds');
  console.log('Cost: $', result.cost.toFixed(2));

  result.concepts.forEach((concept, i) => {
    console.log(`\nConcept ${i + 1}:`);
    console.log('  Title:', concept.title);
    console.log('  Visual Type:', concept.visualType);
    console.log('  Duration:', concept.duration, 'seconds');
  });
}

testMainContentGeneration().catch(console.error);
```

**Run:**
```bash
tsx test-main-content-generation.ts
```

**Expected Output:**
```
Testing Main Content Generation with Visuals...

[Layer 1] Generating main content for: Sets
  Code: C1.2, Level: Core
  ⚠ No specialized agent found, using generic concept generation

  [Concept 1/5] Generating visual for: Set Notation
    🖼️  Generating Gemini image: Set Notation
    [GeminiImageGenerator] Prompt: Create a professional educational background image...
    🚫 CRITICAL: NO TEXT in the image
    [GeminiImageGenerator] ✓ Image saved: output/topics/test-sets/visuals/Set_Notation_*.png

  [Concept 2/5] Generating visual for: Union of Sets
    🎬 Starting Manim render: Union of Sets
    ✅ Manim render complete: media/videos/.../Union_*.mp4

  ... (3 more concepts)

  [VideoRenderer] Starting WebSlides video render...
    Scenes: 5
    Theme: education-dark
  [VideoRenderer] ✓ Video rendered in 45.67s

=== RESULT ===
Success: true
Video Path: output/topics/test-sets/main-content/test-sets-lesson.mp4
Concepts: 5
Duration: 300 seconds
Cost: $ 1.06

Concept 1:
  Title: Set Notation
  Visual Type: gemini
  Duration: 60 seconds

Concept 2:
  Title: Union of Sets
  Visual Type: manim
  Duration: 60 seconds

...
```

**Validation:**
```bash
# Check files
ls -lh output/topics/test-sets/main-content/test-sets-lesson.mp4
ls -lh output/topics/test-sets/visuals/*.png
ls -lh output/topics/test-sets/visuals/*.mp4

# Inspect Gemini images for text
for img in output/topics/test-sets/visuals/*.png; do
  echo "Checking: $img"
  # Visual inspection needed
done

# Play video
vlc output/topics/test-sets/main-content/test-sets-lesson.mp4
```

**Success Criteria:**
- [ ] Mixed visual types (Manim + Gemini)
- [ ] NO TEXT in Gemini images
- [ ] Correct scene types in video
- [ ] Video plays smoothly
- [ ] Transitions work
- [ ] Cost ~$1.06

---

## Test 4: Complete 3-Layer Pipeline

### Test 4.1: Full Topic Generation

**Create test script:**
```typescript
// test-complete-pipeline.ts
import { ClaudeService } from './src/services/claude.js';
import { TopicContentGenerator } from './src/services/topic-content-generator.js';

async function testCompletePipeline() {
  console.log('Testing Complete 3-Layer Pipeline...\n');

  const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY!);
  const generator = new TopicContentGenerator(claudeService);

  const topic = {
    syllabusId: 'cambridge-igcse-maths-0580',
    unitId: 'c1-number',
    topicId: 'c12-sets',
    topicCode: 'C1.2',
    title: 'Sets',
    level: 'Core' as const,
    subtopics: ['Set notation', 'Union', 'Intersection']
  };

  const result = await generator.generateCompleteTopic(topic, {
    voiceId: process.env.DEFAULT_VOICE_ID,
    theme: 'education-dark',
    includeLayers: {
      mainContent: true,
      examples: true,
      exercises: true
    }
  });

  console.log('\n=== COMPLETE RESULT ===');
  console.log('Success:', result.success);
  console.log('Output Dir:', result.outputDir);
  console.log('Total Cost: $', result.totalCost.toFixed(2));
  console.log('Generated At:', result.generatedAt);

  console.log('\nLayer 1 (Main Content):');
  console.log('  Video:', result.layer1.videoPath);
  console.log('  Duration:', result.layer1.duration, 'seconds');
  console.log('  Cost: $', result.layer1.cost.toFixed(2));

  console.log('\nLayer 2 (Examples):');
  console.log('  Examples:', result.layer2.examples.length);
  console.log('  Duration:', result.layer2.totalDuration, 'seconds');
  console.log('  Cost: $', result.layer2.cost.toFixed(2));

  console.log('\nLayer 3 (Exercises):');
  console.log('  Questions:', result.layer3.questions.length);
  console.log('  Quiz:', result.layer3.quizHtmlPath);
  console.log('  Cost: $', result.layer3.cost.toFixed(2));
}

testCompletePipeline().catch(console.error);
```

**Run:**
```bash
tsx test-complete-pipeline.ts
```

**Expected Output:**
```
Testing Complete 3-Layer Pipeline...

[TopicContentGenerator] Generating complete topic: Sets

[Layer 1] Generating main content...
  (... visual generation logs ...)
  ✓ Main content generated: 300s video, $1.06

[Layer 2] Generating examples...
  (... example generation logs ...)
  ✓ Created 3 example videos
  ✓ Total duration: 540s
  ✓ Total cost: $1.77

[Layer 3] Generating exercises...
  (... quiz generation logs ...)
  ✓ Generated 10 questions
  ✓ Quiz HTML created
  ✓ Questions saved

=== COMPLETE RESULT ===
Success: true
Output Dir: output/topics/c12-sets
Total Cost: $ 2.83
Generated At: 2025-10-27T...

Layer 1 (Main Content):
  Video: output/topics/c12-sets/main-content/c12-sets-lesson.mp4
  Duration: 300 seconds
  Cost: $ 1.06

Layer 2 (Examples):
  Examples: 3
  Duration: 540 seconds
  Cost: $ 1.77

Layer 3 (Exercises):
  Questions: 10
  Quiz: output/topics/c12-sets/exercises/quiz.html
  Cost: $ 0.00
```

**Validation:**
```bash
# Check complete structure
tree output/topics/c12-sets/

# Should show:
# output/topics/c12-sets/
# ├── main-content/
# │   └── c12-sets-lesson.mp4
# ├── examples/
# │   ├── example-1.mp4
# │   ├── example-2.mp4
# │   └── example-3.mp4
# ├── exercises/
# │   ├── quiz.html
# │   └── questions.json
# └── visuals/
#     ├── Set_Notation_*.png
#     ├── Union_*.mp4
#     └── ...

# Open quiz in browser
firefox output/topics/c12-sets/exercises/quiz.html

# Play videos
vlc output/topics/c12-sets/main-content/c12-sets-lesson.mp4
vlc output/topics/c12-sets/examples/example-1.mp4
```

**Success Criteria:**
- [ ] All 3 layers generated
- [ ] Total cost < $3.50
- [ ] All videos play
- [ ] Quiz works in browser
- [ ] Answer validation works
- [ ] No compilation errors
- [ ] File structure correct

---

## Troubleshooting

### Issue: Manim not found
```bash
# Check conda environment
conda activate aitools
which manim

# If not found, install
conda install -c conda-forge manim
```

### Issue: Remotion bundle fails
```bash
# Clear Remotion cache
rm -rf /tmp/remotion-webpack-bundle-*

# Restart dev server
npm run dev
```

### Issue: Gemini adds text to images
- Check prompt includes "🚫 CRITICAL: NO TEXT"
- Verify using new GeminiImageGenerator service
- Visual inspection of PNG files

### Issue: Video rendering slow
- Use quality='low' for testing
- Skip Layer 2 (examples) for faster iteration
- Test with targetCount=1 for examples

---

## Next Steps After Testing

1. **If all tests pass:**
   - Commit changes
   - Push to feature branch
   - Merge to master
   - Move to UI integration

2. **If tests fail:**
   - Fix issues
   - Re-run failed tests
   - Document learnings

3. **Performance optimization:**
   - Parallel visual generation
   - Cache Remotion bundles
   - Optimize Manim render time

---

## Test Execution Order

```bash
# 1. Layer 3 (Quick - already validated)
npm run validate-quiz

# 2. Layer 2 (Medium - ~3-5 minutes)
tsx test-example-generation.ts

# 3. Layer 1 (Medium - ~5-8 minutes)
tsx test-main-content-generation.ts

# 4. Complete Pipeline (Long - ~10-15 minutes)
tsx test-complete-pipeline.ts
```

**Total estimated time: ~20-30 minutes for complete validation**
