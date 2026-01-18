# Google Veo 3.1 - Long Video Generation Strategy

How to turn 3-second clips into 30-minute videos

---

## 🎯 The Challenge

**Veo 3.1 Specifications:**
- Maximum output: 3-8 seconds per generation
- High quality, photorealistic
- Text-to-video AI
- Expensive (~$1-2 per clip)

**Goal:**
- Generate 30-minute professional videos
- Maintain consistency across clips
- Keep costs reasonable
- Smooth transitions

---

## 💡 Solution: Three-Pronged Approach

### 1. Shot-by-Shot Generation with Continuity
### 2. Hybrid Video (Veo + Remotion + Static)
### 3. Intelligent Scene Breaking

---

## 📐 Approach 1: Shot-by-Shot with Continuity

### Concept:
Break 30-minute video into many 3-second shots, maintain visual consistency

### Implementation:

```typescript
class VeoShotByShot {
  async generateLongVideo(storyboard: Storyboard): Promise<string> {
    const allClips: VideoClip[] = [];
    let lastFrame: ImageBuffer | null = null;

    for (const scene of storyboard.scenes) {
      // Scene is 60 seconds, need 20 × 3-second clips
      const shots = this.breakSceneIntoShots(scene, 3);

      for (const shot of shots) {
        const clip = await this.generateVeoClip({
          prompt: shot.prompt,
          duration: 3,
          referenceImage: lastFrame, // CRITICAL: Maintain continuity
          style: scene.style,
          cameraMovement: shot.cameraMovement
        });

        allClips.push(clip);

        // Extract last frame for next shot
        lastFrame = await this.extractLastFrame(clip);
      }
    }

    // Stitch with smooth transitions
    return await this.stitchWithTransitions(allClips, {
      transitionType: 'crossfade',
      duration: 0.3 // 0.3s overlap
    });
  }

  breakSceneIntoShots(scene: Scene, clipDuration: number): Shot[] {
    // Use Claude to intelligently break scene
    const shotCount = Math.ceil(scene.duration / clipDuration);
    const shots: Shot[] = [];

    for (let i = 0; i < shotCount; i++) {
      const progress = i / shotCount;

      // Vary camera angles for interest
      const cameraMovement = this.getCameraMovement(i, shotCount);

      // Adjust prompt for this shot
      const shotPrompt = this.generateShotPrompt(
        scene.description,
        i,
        shotCount,
        cameraMovement
      );

      shots.push({
        prompt: shotPrompt,
        duration: clipDuration,
        cameraMovement,
        continuityContext: i > 0 // Use previous frame if not first
      });
    }

    return shots;
  }

  getCameraMovement(shotIndex: number, totalShots: number): CameraMovement {
    // Create cinematic variety
    const movements = [
      'static wide shot',
      'slow push in',
      'dolly right',
      'crane up',
      'handheld medium',
      'static close-up',
      'pull back',
      'pan left'
    ];

    // Cycle through movements
    return movements[shotIndex % movements.length];
  }

  generateShotPrompt(
    sceneDescription: string,
    shotIndex: number,
    totalShots: number,
    camera: CameraMovement
  ): string {
    const progress = shotIndex / totalShots;

    // Use Claude to generate shot-specific prompt
    return `${sceneDescription},
            shot ${shotIndex + 1} of ${totalShots},
            ${this.getFramingForProgress(progress)},
            camera: ${camera},
            lighting: ${this.getLightingForProgress(progress)},
            professional cinematography`;
  }

  getFramingForProgress(progress: number): string {
    if (progress < 0.2) return 'establishing wide shot';
    if (progress < 0.5) return 'medium shot';
    if (progress < 0.8) return 'close-up';
    return 'detail shot';
  }
}
```

### Pros:
- ✅ Maximum control over each shot
- ✅ Can create cinematic variety
- ✅ Reference image maintains consistency

### Cons:
- ❌ Expensive (600 seconds = 200 clips × $1.50 = $300)
- ❌ Time-consuming to generate
- ❌ May have slight discontinuities

---

## 🎨 Approach 2: Hybrid Video (Recommended)

### Concept:
Use Veo strategically for hero moments, Remotion for graphics, static images for rest

### Video Structure (30-minute example):

```
Timeline:
├── 00:00-00:03  ⚡ Remotion: Branded intro (3s)
├── 00:03-00:30  🎬 Veo: Opening scene (9 clips × 3s)
├── 00:30-01:30  📊 Remotion: Motion graphics explaining concept (60s)
├── 01:30-02:30  🖼️ Static images: Supporting content with Ken Burns effect (60s)
├── 02:30-05:00  🎬 Veo: Product demonstration (50 clips × 3s)
├── 05:00-06:00  📊 Remotion: Data visualization (60s)
├── 06:00-08:00  🖼️ Static images: Case studies with voiceover (120s)
├── 08:00-10:00  🎬 Veo: Customer testimonial scene (40 clips × 3s)
├── 10:00-12:00  📊 Remotion: Animated infographic (120s)
└── ...continue pattern...
└── 29:30-30:00  ⚡ Remotion: Outro with CTA (30s)
```

### Budget Breakdown:

| Type | Duration | Cost |
|------|----------|------|
| Veo AI footage | 300s (10 min) | $150 |
| Remotion graphics | 600s (10 min) | $0 (local) |
| Static images | 600s (10 min) | $0 |
| **Total** | **30 min** | **$150** |

### Implementation:

```typescript
class HybridVideoGenerator {
  async generateHybridVideo(storyboard: Storyboard): Promise<string> {
    const timeline: TimelineSegment[] = [];

    for (const scene of storyboard.scenes) {
      const segment = await this.determineSegmentType(scene);

      switch (segment.type) {
        case 'veo-ai':
          // High-value scenes: product demos, people, environments
          const veoClips = await this.generateVeoSequence(scene);
          timeline.push({ type: 'veo', clips: veoClips, duration: scene.duration });
          break;

        case 'remotion-graphics':
          // Motion graphics: data viz, text animations, diagrams
          const remotionClip = await this.renderRemotionScene(scene);
          timeline.push({ type: 'remotion', clip: remotionClip, duration: scene.duration });
          break;

        case 'static-images':
          // Lower-priority content: background info, text-heavy slides
          const imageClip = await this.createKenBurnsClip(scene);
          timeline.push({ type: 'static', clip: imageClip, duration: scene.duration });
          break;
      }
    }

    return await this.assembleTimeline(timeline);
  }

  async determineSegmentType(scene: Scene): Promise<SegmentType> {
    // Use Claude to analyze scene and determine best rendering method
    const analysis = await this.analyzeScene(scene);

    if (analysis.requiresRealism && analysis.complexity === 'high') {
      return 'veo-ai'; // Use Veo for realistic, complex scenes
    }

    if (analysis.hasData || analysis.hasText || analysis.isAbstract) {
      return 'remotion-graphics'; // Use Remotion for graphics
    }

    return 'static-images'; // Use images for simple content
  }

  async generateVeoSequence(scene: Scene): Promise<VideoClip[]> {
    // Break into 3-second clips
    const shots = this.breakIntoShots(scene, 3);
    const clips: VideoClip[] = [];
    let lastFrame = null;

    for (const shot of shots) {
      const clip = await veo.generate({
        prompt: shot.prompt,
        duration: 3,
        referenceImage: lastFrame,
        style: 'cinematic'
      });

      clips.push(clip);
      lastFrame = await this.extractLastFrame(clip);
    }

    return clips;
  }

  async renderRemotionScene(scene: Scene): Promise<VideoClip> {
    // Use Remotion for motion graphics
    return await remotion.render({
      component: this.selectRemotionComponent(scene),
      props: scene.data,
      duration: scene.duration
    });
  }

  async createKenBurnsClip(scene: Scene): Promise<VideoClip> {
    // Static image + Ken Burns effect (slow zoom/pan)
    const image = await this.generateImage(scene.description);

    return await ffmpeg.execute([
      '-loop', '1',
      '-i', image,
      '-vf', `zoompan=z='min(zoom+0.0015,1.5)':d=${scene.duration * 30}:s=1920x1080`,
      '-t', scene.duration.toString(),
      'output.mp4'
    ]);
  }
}
```

### Pros:
- ✅ Cost-effective ($150 vs $300)
- ✅ Faster to generate
- ✅ Best tool for each job
- ✅ Professional result

### Cons:
- ⚠️ Need to decide which scenes deserve Veo
- ⚠️ More complex pipeline

---

## 🧠 Approach 3: Intelligent Scene Breaking

### Concept:
Use AI to break narrative into optimal shots for Veo

### Implementation:

```typescript
class IntelligentSceneBreaker {
  async breakStoryboardIntoShots(storyboard: Storyboard): Promise<ShotList> {
    // Use Claude to analyze narrative and create shot list
    const shotList = await anthropic.messages.create({
      model: 'claude-sonnet-4',
      messages: [{
        role: 'user',
        content: `You are a professional cinematographer. Break this storyboard into individual shots.

Storyboard:
${JSON.stringify(storyboard, null, 2)}

Requirements:
- Each shot max 3 seconds
- Maintain visual continuity
- Create cinematic variety (wide, medium, close-up)
- Specify camera movement
- Describe transitions

Return as JSON array of shots.`
      }]
    });

    return JSON.parse(shotList.content);
  }

  async generateFromShotList(shotList: ShotList): Promise<string> {
    const clips: VideoClip[] = [];
    let lastFrame = null;

    for (const shot of shotList.shots) {
      const clip = await veo.generate({
        prompt: this.enrichPrompt(shot),
        duration: shot.duration,
        referenceImage: lastFrame,
        cameraMovement: shot.camera,
        style: 'professional cinematography'
      });

      clips.push(clip);
      lastFrame = await this.extractLastFrame(clip);
    }

    return await this.stitchWithTransitions(clips, shotList.transitions);
  }

  enrichPrompt(shot: Shot): string {
    // Add cinematic details to prompt
    return `${shot.description},
            ${shot.framing} shot,
            camera ${shot.camera},
            lighting: ${shot.lighting},
            color grading: ${shot.colorGrade},
            professional cinematography,
            4K quality,
            realistic`;
  }
}
```

### Example Shot List:

```json
{
  "shots": [
    {
      "duration": 3,
      "description": "Modern office building exterior at sunrise",
      "framing": "wide establishing",
      "camera": "slow push in",
      "lighting": "golden hour, soft",
      "colorGrade": "warm, professional"
    },
    {
      "duration": 3,
      "description": "Business team in conference room discussing strategy",
      "framing": "medium group",
      "camera": "dolly right",
      "lighting": "bright office lighting",
      "colorGrade": "neutral, corporate"
    },
    {
      "duration": 3,
      "description": "Close-up of hands pointing at charts on tablet",
      "framing": "close-up detail",
      "camera": "static",
      "lighting": "focused, high contrast",
      "colorGrade": "cool, tech-focused"
    }
  ],
  "transitions": [
    { "from": 0, "to": 1, "type": "crossfade", "duration": 0.5 },
    { "from": 1, "to": 2, "type": "match cut", "duration": 0.3 }
  ]
}
```

---

## 🔧 Technical Implementation

### Veo API Integration:

```typescript
interface VeoConfig {
  prompt: string;
  duration: number; // 3-8 seconds
  resolution: '720p' | '1080p' | '4K';
  fps: 24 | 30 | 60;
  style?: string;
  referenceImage?: string; // For continuity
  seed?: number; // For reproducibility
}

class VeoService {
  private apiKey: string;
  private endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/veo-3.1';

  async generate(config: VeoConfig): Promise<VideoClip> {
    const response = await fetch(`${this.endpoint}:generateVideo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: config.prompt,
        duration_seconds: config.duration,
        resolution: config.resolution,
        fps: config.fps,
        style_preset: config.style,
        reference_image_base64: config.referenceImage ?
          await this.imageToBase64(config.referenceImage) : undefined,
        seed: config.seed
      })
    });

    const data = await response.json();

    // Veo returns operation ID, need to poll for completion
    return await this.pollForCompletion(data.operationId);
  }

  async pollForCompletion(operationId: string): Promise<VideoClip> {
    while (true) {
      const status = await this.checkStatus(operationId);

      if (status.done) {
        return {
          url: status.videoUrl,
          duration: status.duration,
          resolution: status.resolution
        };
      }

      // Wait 2 seconds before checking again
      await this.sleep(2000);
    }
  }

  async extractLastFrame(videoUrl: string): Promise<string> {
    // Download video, extract last frame
    const video = await this.downloadVideo(videoUrl);
    const lastFrame = await ffmpeg.extractFrame(video, -1); // Last frame
    return await this.imageToBase64(lastFrame);
  }
}
```

### Video Stitching:

```typescript
class VideoStitcher {
  async stitchClips(clips: VideoClip[], transitions: Transition[]): Promise<string> {
    // Create FFmpeg concat file
    const concatFile = this.createConcatFile(clips);

    // Build FFmpeg command with transitions
    const command = this.buildFFmpegCommand(clips, transitions);

    // Execute
    return await ffmpeg.execute(command);
  }

  buildFFmpegCommand(clips: VideoClip[], transitions: Transition[]): string[] {
    const inputs = clips.map(c => ['-i', c.path]).flat();
    const filters = this.buildTransitionFilters(clips, transitions);

    return [
      ...inputs,
      '-filter_complex', filters,
      '-map', '[out]',
      '-c:v', 'libx264',
      '-crf', '18',
      '-preset', 'slow',
      'output.mp4'
    ];
  }

  buildTransitionFilters(clips: VideoClip[], transitions: Transition[]): string {
    // Build complex filter for smooth transitions
    let filter = '';
    let currentLabel = '[0:v]';

    for (let i = 0; i < transitions.length; i++) {
      const trans = transitions[i];
      const nextLabel = i === transitions.length - 1 ? '[out]' : `[v${i}]`;

      filter += `${currentLabel}[${trans.to}:v]xfade=transition=${trans.type}:duration=${trans.duration}:offset=${this.getOffset(clips, trans.from)}${nextLabel};`;

      currentLabel = nextLabel;
    }

    return filter;
  }
}
```

---

## 💰 Cost Optimization Strategies

### Strategy 1: Scene Prioritization

```typescript
// Assign priority to each scene
const scenePriorities = {
  'hero-moment': 'veo',      // Use Veo for critical scenes
  'supporting': 'remotion',  // Use Remotion for support
  'filler': 'static'         // Use static images for filler
};

// Budget-aware generation
async function generateWithBudget(storyboard: Storyboard, maxBudget: number) {
  const scenes = storyboard.scenes.map(s => ({
    ...s,
    priority: classifyScene(s)
  }));

  // Sort by priority
  scenes.sort((a, b) => priorityScore(b) - priorityScore(a));

  let budget = 0;
  const plan: GenerationPlan[] = [];

  for (const scene of scenes) {
    const veoCost = estimateVeoCost(scene);

    if (budget + veoCost <= maxBudget && scene.priority === 'hero-moment') {
      plan.push({ scene, method: 'veo' });
      budget += veoCost;
    } else if (scene.priority === 'supporting') {
      plan.push({ scene, method: 'remotion' });
    } else {
      plan.push({ scene, method: 'static' });
    }
  }

  return plan;
}
```

### Strategy 2: Clip Reuse

```typescript
// Reuse similar clips to save costs
class ClipLibrary {
  private cache: Map<string, VideoClip> = new Map();

  async getOrGenerate(prompt: string, config: VeoConfig): Promise<VideoClip> {
    // Check if similar clip exists
    const similar = this.findSimilarClip(prompt);

    if (similar && this.isSimilarEnough(prompt, similar.prompt)) {
      console.log('Reusing cached clip, saving $1.50');
      return similar.clip;
    }

    // Generate new clip
    const clip = await veo.generate({ prompt, ...config });

    // Cache for future use
    this.cache.set(prompt, clip);

    return clip;
  }

  findSimilarClip(prompt: string): CachedClip | null {
    // Use embeddings to find similar prompts
    const embedding = this.getEmbedding(prompt);

    for (const [cachedPrompt, clip] of this.cache.entries()) {
      const cachedEmbedding = this.getEmbedding(cachedPrompt);
      const similarity = this.cosineSimilarity(embedding, cachedEmbedding);

      if (similarity > 0.9) {
        return { prompt: cachedPrompt, clip };
      }
    }

    return null;
  }
}
```

---

## 📊 Recommended Configuration

### For 30-Minute Professional Video:

```typescript
const videoConfig = {
  totalDuration: 1800, // 30 minutes

  segments: {
    veo: {
      duration: 600,     // 10 minutes (33%)
      cost: 200 * 1.5,   // 200 clips × $1.50
      useCases: [
        'Product demonstrations',
        'Customer testimonials',
        'Hero moments',
        'Realistic environments'
      ]
    },

    remotion: {
      duration: 900,     // 15 minutes (50%)
      cost: 0,           // Free (local rendering)
      useCases: [
        'Data visualizations',
        'Animated text',
        'Motion graphics',
        'Diagrams and charts'
      ]
    },

    static: {
      duration: 300,     // 5 minutes (17%)
      cost: 0,           // Free
      useCases: [
        'Text-heavy content',
        'Screenshots',
        'Photos with voiceover',
        'Lower-priority scenes'
      ]
    }
  },

  totalCost: 300,        // $300 for Veo
  productionTime: 120,   // 2 hours (mostly Veo generation)

  optimization: {
    useClipCaching: true,
    reuseThreshold: 0.9,
    budgetLimit: 300,
    prioritizeHeroMoments: true
  }
};
```

---

## 🎬 Workflow Summary

1. **Storyboard Analysis** → Claude breaks into scenes
2. **Scene Classification** → Veo/Remotion/Static decision
3. **Shot Breakdown** → 3-second shot list for Veo scenes
4. **Parallel Generation**:
   - Veo clips (with continuity)
   - Remotion graphics
   - Static image sequences
5. **Assembly** → Stitch with smooth transitions
6. **Final Polish** → Color grading, audio mixing

---

## ✅ Next Steps

1. Set up Veo 3.1 API access
2. Test single 3-second generation
3. Test continuity (2 clips with reference image)
4. Build shot-by-shot generator
5. Build hybrid video assembler
6. Create cost optimization logic
7. Full 30-minute test

---

**Veo 3.1 unlocks Hollywood-quality AI video at scale!** 🚀
