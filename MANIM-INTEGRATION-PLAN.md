# Manim Integration Plan for Educational Content

**Priority:** HIGH - Essential for mathematical content quality
**Status:** Not yet implemented - needs integration
**Target:** Circle Geometry & Differentiation lessons

---

## Why Manim is Critical for Math Education

### Problem with Static Images:
```
Gemini generates: Static diagram of circle with tangent
❌ Student sees: A flat image
❌ Can't see: How the angle changes, how tangent relates to radius
❌ Understanding: Limited to memorization
```

### Solution with Manim:
```
Manim animates: Circle forming → Radius drawing → Tangent appearing → Angle highlighted
✅ Student sees: The PROCESS of construction
✅ Can see: Geometric relationships dynamically
✅ Understanding: Deep conceptual grasp
```

---

## What Manim Does

**Manim (Mathematical Animation Engine)** - Created by 3Blue1Brown

**Perfect For:**
- Circle theorems (angles forming, chords moving)
- Differentiation (tangent lines, gradients changing)
- Geometric proofs (step-by-step construction)
- Graph transformations (curves morphing)
- Algebraic manipulation (equations rearranging)

**Not Python - Not a problem!**
- Manim runs as Python CLI
- We call it from Node.js backend
- Generate Python scripts programmatically
- Execute and get video output

---

## Architecture Integration

### Current Pipeline (Images):
```
Claude Script → Gemini Static Image → Remotion Composition → Video
                    ↓
              Static PNG/JPG
```

### Enhanced Pipeline (with Manim):
```
Claude Script → Decision: Static or Animated?
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
   Gemini Static          Manim Animation
   (backgrounds)          (mathematical concepts)
        ↓                       ↓
        └───────────┬───────────┘
                    ↓
            Remotion Composition
                    ↓
                  Video
```

### Hybrid Approach:
- **Gemini:** Backgrounds, real-world photos, general visuals
- **Manim:** Circle theorems, graphs, geometric proofs, differentiation
- **Remotion:** Combines both + adds overlays, text, transitions

---

## Implementation Strategy

### Phase 1: Manim Setup (2 hours)

#### 1.1 Install Manim (Backend Server)
```bash
# Install system dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install -y \
    python3 python3-pip \
    ffmpeg \
    libcairo2-dev \
    libpango1.0-dev \
    texlive texlive-latex-extra

# Install Manim
pip3 install manim

# Verify installation
manim --version
```

#### 1.2 Create Manim Service
```typescript
// packages/backend/src/services/manim-renderer.ts

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export interface ManimScene {
  sceneType: 'circle_theorem' | 'differentiation' | 'graph' | 'geometry';
  concept: string;
  parameters: any;
}

export class ManimRenderer {
  private pythonPath = 'python3';
  private manimPath = 'manim';
  private outputDir = 'output/manim';

  /**
   * Generate Manim animation from concept
   */
  async renderAnimation(scene: ManimScene): Promise<string> {
    // 1. Generate Python script
    const scriptPath = await this.generateScript(scene);

    // 2. Execute Manim
    const videoPath = await this.executeMaim(scriptPath, scene.concept);

    // 3. Return video path for Remotion
    return videoPath;
  }

  /**
   * Generate Python Manim script from parameters
   */
  private async generateScript(scene: ManimScene): Promise<string> {
    let pythonCode = '';

    switch (scene.sceneType) {
      case 'circle_theorem':
        pythonCode = this.generateCircleTheorem(scene);
        break;
      case 'differentiation':
        pythonCode = this.generateDifferentiation(scene);
        break;
      case 'graph':
        pythonCode = this.generateGraph(scene);
        break;
      case 'geometry':
        pythonCode = this.generateGeometry(scene);
        break;
    }

    // Save Python script
    const scriptPath = path.join(
      this.outputDir,
      `${scene.concept}_${Date.now()}.py`
    );
    await fs.mkdir(path.dirname(scriptPath), { recursive: true });
    await fs.writeFile(scriptPath, pythonCode);

    return scriptPath;
  }

  /**
   * Circle Theorem Animation
   */
  private generateCircleTheorem(scene: ManimScene): string {
    const { theorem, angle, showProof } = scene.parameters;

    return `
from manim import *

class CircleTheorem(Scene):
    def construct(self):
        # Title
        title = Text("${theorem}", font_size=48)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(0.5)

        # Draw circle
        circle = Circle(radius=2, color=BLUE)
        self.play(Create(circle))
        self.wait(0.5)

        # Draw center
        center = Dot(ORIGIN, color=RED)
        center_label = Text("O", font_size=24).next_to(center, DOWN)
        self.play(FadeIn(center, center_label))

        ${this.getTheoremAnimation(theorem, angle)}

        # Hold final frame
        self.wait(2)
`;
  }

  /**
   * Theorem-specific animations
   */
  private getTheoremAnimation(theorem: string, angle: number): string {
    switch (theorem) {
      case 'Angle at Centre':
        return `
        # Point on circumference
        point_A = circle.point_at_angle(PI/3)
        point_B = circle.point_at_angle(-PI/3)

        dot_A = Dot(point_A, color=YELLOW)
        dot_B = Dot(point_B, color=YELLOW)

        label_A = Text("A", font_size=24).next_to(dot_A, UP)
        label_B = Text("B", font_size=24).next_to(dot_B, DOWN)

        self.play(FadeIn(dot_A, dot_B, label_A, label_B))

        # Draw angle at centre
        line_OA = Line(ORIGIN, point_A, color=GREEN)
        line_OB = Line(ORIGIN, point_B, color=GREEN)

        self.play(Create(line_OA), Create(line_OB))

        # Angle at centre
        angle_centre = Angle(line_OB, line_OA, radius=0.5, color=RED)
        angle_label = MathTex("${angle}°").next_to(angle_centre, RIGHT)

        self.play(Create(angle_centre), Write(angle_label))
        self.wait(1)

        # Point C on circumference
        point_C = circle.point_at_angle(PI)
        dot_C = Dot(point_C, color=YELLOW)
        label_C = Text("C", font_size=24).next_to(dot_C, LEFT)

        self.play(FadeIn(dot_C, label_C))

        # Angle at circumference
        line_CA = Line(point_C, point_A, color=PURPLE)
        line_CB = Line(point_C, point_B, color=PURPLE)

        self.play(Create(line_CA), Create(line_CB))

        angle_circum = Angle(line_CB, line_CA, radius=0.3, color=ORANGE)
        angle_circum_label = MathTex("${angle / 2}°").next_to(angle_circum, UP)

        self.play(Create(angle_circum), Write(angle_circum_label))

        # Highlight relationship
        box_centre = SurroundingRectangle(angle_label, color=RED)
        box_circum = SurroundingRectangle(angle_circum_label, color=ORANGE)

        self.play(Create(box_centre), Create(box_circum))

        formula = MathTex(r"\\text{Centre} = 2 \\times \\text{Circumference}")
        formula.to_edge(DOWN)
        self.play(Write(formula))
        `;

      case 'Tangent-Radius Right Angle':
        return `
        # Tangent line
        tangent_point = circle.point_at_angle(PI/4)
        tangent = Line(
            tangent_point + LEFT*1.5,
            tangent_point + RIGHT*1.5,
            color=GREEN
        )

        # Radius to tangent point
        radius = Line(ORIGIN, tangent_point, color=RED)

        self.play(Create(tangent))
        self.wait(0.5)
        self.play(Create(radius))

        # Right angle marker
        right_angle = RightAngle(radius, tangent, length=0.3, color=YELLOW)
        angle_label = MathTex("90°").next_to(right_angle, UR, buff=0.1)

        self.play(Create(right_angle), Write(angle_label))
        `;

      default:
        return `# Generic circle animation
        self.wait(1)
        `;
    }
  }

  /**
   * Differentiation Animation
   */
  private generateDifferentiation(scene: ManimScene): string {
    const { function: func, xValue, showTangent } = scene.parameters;

    return `
from manim import *

class Differentiation(Scene):
    def construct(self):
        # Setup axes
        axes = Axes(
            x_range=[-3, 3, 1],
            y_range=[-2, 10, 2],
            axis_config={"color": BLUE},
        )

        labels = axes.get_axis_labels(x_label="x", y_label="y")

        self.play(Create(axes), Write(labels))

        # Plot function
        curve = axes.plot(lambda x: ${func}, color=YELLOW)
        curve_label = MathTex("y = ${func}").to_corner(UR)

        self.play(Create(curve), Write(curve_label))
        self.wait(1)

        # Point on curve
        x_val = ${xValue}
        point = Dot(axes.c2p(x_val, ${func}), color=RED)
        point_label = MathTex(f"({x_val}, {${func}})").next_to(point, UR)

        self.play(FadeIn(point), Write(point_label))

        ${showTangent ? `
        # Draw tangent line
        slope = ${this.getDerivative(func, xValue)}
        tangent = axes.plot(
            lambda x: slope * (x - x_val) + ${func},
            color=GREEN,
            x_range=[x_val - 1, x_val + 1]
        )

        tangent_label = MathTex(f"m = {slope:.2f}").next_to(tangent, DOWN)

        self.play(Create(tangent), Write(tangent_label))
        self.wait(2)
        ` : ''}
`;
  }

  /**
   * Execute Manim command
   */
  private async executeMaim(scriptPath: string, sceneName: string): Promise<string> {
    const outputPath = path.join(this.outputDir, 'videos');

    try {
      // Run manim render
      const command = `${this.manimPath} render ${scriptPath} -ql --format=mp4 -o ${sceneName}.mp4`;

      console.log(`🎬 Executing Manim: ${command}`);
      const { stdout, stderr } = await execAsync(command);

      console.log('Manim output:', stdout);
      if (stderr) console.warn('Manim warnings:', stderr);

      // Find generated video
      const videoPath = path.join(outputPath, `${sceneName}.mp4`);

      return videoPath;
    } catch (error) {
      console.error('Manim execution failed:', error);
      throw new Error(`Manim rendering failed: ${error.message}`);
    }
  }

  /**
   * Helper: Calculate derivative (simple cases)
   */
  private getDerivative(func: string, x: number): number {
    // This should use a proper symbolic math library
    // For now, numerical approximation
    const h = 0.0001;
    const f = (val: number) => eval(func.replace(/x/g, String(val)));
    return (f(x + h) - f(x)) / h;
  }
}

export default ManimRenderer;
`;
  }

  /**
   * Graph plotting
   */
  private generateGraph(scene: ManimScene): string {
    return `
from manim import *

class GraphScene(Scene):
    def construct(self):
        axes = Axes(
            x_range=[-5, 5, 1],
            y_range=[-5, 5, 1]
        )

        graph = axes.plot(lambda x: ${scene.parameters.function}, color=BLUE)

        self.play(Create(axes))
        self.play(Create(graph))
        self.wait(2)
`;
  }

  private generateGeometry(scene: ManimScene): string {
    return `# Generic geometry scene
from manim import *

class GeometryScene(Scene):
    def construct(self):
        ${scene.parameters.customCode || 'pass'}
`;
  }
}
```

---

### Phase 2: Integration with Educational Video Generator (1 hour)

```typescript
// packages/backend/src/agents/education/video-generator.ts

import { ManimRenderer } from '../../services/manim-renderer';

export class EducationalVideoGenerator {
  private manimRenderer: ManimRenderer;

  constructor(
    private gemini: GoogleGenerativeAI,
    private openai: OpenAI
  ) {
    this.manimRenderer = new ManimRenderer();
  }

  async generateModuleVideo(module: Module, script: VideoScript): Promise<VideoResult> {
    const scenes = [];

    for (const [i, concept] of module.concepts.entries()) {
      // Decide: Manim or Gemini?
      const useManim = this.shouldUseManim(concept);

      let visualPath: string;

      if (useManim) {
        // Generate Manim animation
        console.log(`🎬 Using Manim for: ${concept.name}`);

        visualPath = await this.manimRenderer.renderAnimation({
          sceneType: this.getManimSceneType(concept),
          concept: concept.name,
          parameters: this.extractManimParameters(concept)
        });
      } else {
        // Use Gemini for static/photo images
        console.log(`🖼️ Using Gemini for: ${concept.name}`);

        const image = await this.generateConceptImage(concept);
        visualPath = image.path;
      }

      // Generate narration with ElevenLabs (user's voice!)
      const audio = await this.generateNarration(script.segments[i]);

      scenes.push({
        id: i + 1,
        title: concept.name,
        visual: visualPath,
        audio: audio.path,
        duration: script.segments[i].duration
      });
    }

    // Render with Remotion
    const videoPath = await renderVideo({
      composition: 'EducationalModule',
      scenes,
      outputPath: `output/courses/${module.id}.mp4`
    });

    return { videoPath, scenes: scenes.length };
  }

  /**
   * Decide if concept should use Manim
   */
  private shouldUseManim(concept: Concept): boolean {
    const manimKeywords = [
      'circle', 'theorem', 'angle', 'tangent', 'chord',
      'differentiation', 'gradient', 'curve', 'graph',
      'proof', 'construction', 'geometric'
    ];

    return manimKeywords.some(keyword =>
      concept.name.toLowerCase().includes(keyword) ||
      concept.description.toLowerCase().includes(keyword)
    );
  }

  /**
   * Map concept to Manim scene type
   */
  private getManimSceneType(concept: Concept): string {
    if (concept.name.includes('Circle') || concept.name.includes('Theorem')) {
      return 'circle_theorem';
    }
    if (concept.name.includes('Different') || concept.name.includes('Gradient')) {
      return 'differentiation';
    }
    return 'geometry';
  }

  /**
   * Extract Manim parameters from concept
   */
  private extractManimParameters(concept: Concept): any {
    // Use Claude to extract specific parameters
    // e.g., angle values, function expressions, etc.

    return {
      theorem: concept.name,
      angle: concept.metadata?.angle || 60,
      showProof: true,
      function: concept.metadata?.function || 'x**2'
    };
  }
}
```

---

### Phase 3: Remotion Integration (1 hour)

```tsx
// packages/backend/src/remotion/EducationalScene.tsx

export const EducationalScene: React.FC<{
  visual: string;  // Could be MP4 (Manim) or PNG (Gemini)
  audio: string;
  title: string;
}> = ({ visual, audio, title }) => {
  const videoExtensions = ['.mp4', '.mov', '.webm'];
  const isVideo = videoExtensions.some(ext => visual.endsWith(ext));

  return (
    <AbsoluteFill>
      {/* Title */}
      <div style={{ position: 'absolute', top: 60, left: 80 }}>
        <h1>{title}</h1>
      </div>

      {/* Visual Content - Dynamic based on type */}
      {isVideo ? (
        // Manim animation
        <Video src={visual} style={{ width: '100%', height: '100%' }} />
      ) : (
        // Gemini image
        <Img src={visual} style={{ width: '100%', objectFit: 'contain' }} />
      )}

      {/* Narration */}
      <Audio src={audio} />
    </AbsoluteFill>
  );
};
```

---

## Cost Comparison

### Current (Gemini Only):
- 10 concepts × $0.01 per image = **$0.10**
- Quality: ⭐⭐⭐ (static images, limited understanding)

### With Manim:
- 6 Manim animations × FREE = **$0.00**
- 4 Gemini images (backgrounds) × $0.01 = **$0.04**
- **Total: $0.04** (CHEAPER!)
- Quality: ⭐⭐⭐⭐⭐ (dynamic animations, deep understanding)

### Manim Benefits:
- ✅ FREE (open source)
- ✅ Better for learning (animated)
- ✅ Mathematically precise
- ✅ Professional quality (3Blue1Brown level)
- ✅ Actually SAVES money vs all-Gemini

---

## Voice Integration (ElevenLabs)

### Current Setup (Already Built):
```typescript
// From voice-cloning worktree
const voiceCloning = new VoiceCloning(process.env.ELEVENLABS_API_KEY);

// During conversation, voice is automatically cloned
// Then used for ALL narration

const audio = await voiceCloning.generateSpeech({
  text: scene.narration,
  voiceId: session.voiceId,  // User's cloned voice!
  stability: 0.5,
  similarityBoost: 0.75
});
```

### Integrated Pipeline:
```
User talks about math concepts (voice captured)
    ↓
Voice cloned automatically (60+ seconds)
    ↓
Claude generates lesson structure
    ↓
Manim creates animations
    ↓
ElevenLabs narrates in USER'S VOICE
    ↓
Remotion combines everything
    ↓
Professional math lesson in user's own voice!
```

---

## Example: Circle Theorem Lesson

### Scene 1: Angle at Centre Theorem
```
Visual: Manim animation
  - Circle appears
  - Center marked
  - Points A, B on circumference appear
  - Angle at centre forms (120°)
  - Point C appears
  - Angle at circumference forms (60°)
  - Relationship highlighted: 120° = 2 × 60°

Audio: ElevenLabs (user's voice)
  "The angle at the centre of a circle is twice the angle
   at the circumference, when both are subtended by the
   same arc. Watch as we construct this..."

Duration: 45 seconds
```

### Scene 2: Tangent-Radius Property
```
Visual: Manim animation
  - Circle with radius
  - Tangent line appears at point
  - Right angle forms
  - Angle measure shows 90°

Audio: ElevenLabs (user's voice)
  "When a radius meets a tangent at the point of contact,
   they always form a right angle. This is a fundamental
   property we use in many proofs..."

Duration: 40 seconds
```

---

## Testing Plan

### Test 1: Basic Manim Rendering
```bash
# Create simple Python script
cat > test.py << 'EOF'
from manim import *

class Test(Scene):
    def construct(self):
        circle = Circle()
        self.play(Create(circle))
        self.wait(1)
EOF

# Render
manim render test.py -ql

# Check output
ls media/videos/test/480p15/Test.mp4
```

### Test 2: Circle Theorem Animation
```bash
curl -X POST http://localhost:3001/api/education/manim-test \
  -d '{
    "theorem": "Angle at Centre",
    "angle": 120
  }'
```

### Test 3: Full Integration
```bash
# Generate complete module with Manim + Voice
curl -X POST http://localhost:3001/api/education/module-video \
  -d '{
    "moduleId": "circle-theorems-101",
    "useManim": true,
    "voiceId": "user_abc123"  # From ElevenLabs
  }'
```

---

## Dependencies Required

```json
{
  "dependencies": {
    // Already have
    "remotion": "^4.0.364",
    "@google/generative-ai": "^0.24.1",

    // Need to add
    "@elevenlabs/elevenlabs-js": "^0.x.x"  // Voice cloning
  }
}
```

**System Dependencies:**
```bash
# Python 3.8+
python3 --version

# Manim
pip3 install manim

# FFmpeg (for video processing)
ffmpeg -version
```

---

## Next Steps

1. **Install Manim** on backend server (2 commands)
2. **Create ManimRenderer service** (copy code above)
3. **Integrate with EducationalVideoGenerator** (update decision logic)
4. **Test with one circle theorem** (verify output)
5. **Merge voice-cloning worktree** (get ElevenLabs working)
6. **Generate first lesson** (Angle at Centre + user's voice)

**Estimated Total Time:** 4-5 hours
**Result:** Professional math lessons with animations + your voice!

---

## Why This Changes Everything

**Before:**
- Static images (boring)
- Generic TTS voice (impersonal)
- Students memorize formulas
- Cost: ~$0.50/module

**After:**
- Manim animations (engaging)
- YOUR voice (personal, authoritative)
- Students understand concepts
- Cost: ~$0.30/module (CHEAPER!)

**This is the difference between:**
- ❌ "Here's a formula, memorize it"
- ✅ "Watch how this works, understand why"

---

**Ready to implement?** 🚀
