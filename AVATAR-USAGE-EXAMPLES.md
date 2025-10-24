# Avatar Feature - Usage Examples

**Quick examples for adding avatars to your 30 agents**

---

## Educational Videos

```typescript
// POST /api/education/generate-lesson
import { addAvatarToVideo, parseAvatarOptions } from '../utils/avatar-helper.js';

router.post('/generate-lesson', async (req, res) => {
  const avatarOptions = parseAvatarOptions(req.body, false);

  // Generate lesson
  const result = await generator.generateModuleVideo(module, voiceId);
  const videoPath = await combiner.combineScenesIntoFinalVideo(result.scenes);

  // Add avatar if enabled
  const final = await addAvatarToVideo(videoPath, {
    ...avatarOptions,
    audioFile: result.scenes[0].audio
  });

  res.json({
    videoPath: final.finalVideoPath,
    hasAvatar: final.hasAvatar,
    cost: result.cost + final.avatarCost
  });
});
```

**Request:**
```json
{
  "module": {...},
  "voiceId": "...",
  "avatar": {
    "enabled": true,
    "image": "assets/avatars/teacher.png",
    "position": "top-right",
    "scale": 0.2
  }
}
```

---

## Video Director (Conversational AI)

```typescript
// POST /api/video-director/generate
import { addAvatarToVideo, parseAvatarOptions } from '../utils/avatar-helper.js';

router.post('/generate', async (req, res) => {
  const avatarOptions = parseAvatarOptions(req.body, false);

  // Generate conversational video
  const audioPath = await whisperSTT(req.body.userInput);
  const response = await claudeAI.chat(transcript);
  const ttsPath = await openAITTS(response);
  const videoPath = await createVideoWithAudio(ttsPath);

  // Add avatar
  const final = await addAvatarToVideo(videoPath, {
    ...avatarOptions,
    audioFile: ttsPath
  });

  res.json({
    response: response,
    videoPath: final.finalVideoPath,
    hasAvatar: final.hasAvatar
  });
});
```

**Request:**
```json
{
  "userInput": "Tell me about quantum physics",
  "avatar": {
    "enabled": true,
    "image": "assets/avatars/scientist.png",
    "position": "bottom-right",
    "scale": 0.15
  }
}
```

---

## Strategy Consultant

```typescript
// POST /api/strategy/generate-presentation
import { addAvatarToVideo, parseAvatarOptions } from '../utils/avatar-helper.js';

router.post('/generate-presentation', async (req, res) => {
  const avatarOptions = parseAvatarOptions(req.body, false);

  // Generate PowerPoint presentation
  const pptVideo = await powerPointGenerator.generate(data);
  const narration = await generateNarration(data);

  // Add consultant avatar
  const final = await addAvatarToVideo(pptVideo, {
    enabled: avatarOptions.enabled,
    avatarImage: avatarOptions.avatarImage || 'assets/avatars/consultant.png',
    audioFile: narration,
    position: 'bottom-right',  // Bottom right for presentations
    scale: 0.15                 // Smaller for business presentations
  });

  res.json({
    presentationPath: final.finalVideoPath,
    hasAvatar: final.hasAvatar,
    cost: pptCost + final.avatarCost
  });
});
```

**Request:**
```json
{
  "companyId": "...",
  "period": "Q4 2024",
  "avatar": {
    "enabled": true,
    "image": "assets/avatars/business-consultant.png"
  }
}
```

---

## Social Media Poster

```typescript
// POST /api/social/generate-video
import { addAvatarToVideo } from '../utils/avatar-helper.js';

router.post('/generate-video', async (req, res) => {
  const { platform, content } = req.body;

  // Generate social media video
  const videoPath = await generateShortFormVideo(content);
  const audioPath = await generateVoiceover(content);

  // Add avatar based on platform
  const avatarConfig = {
    'tiktok': { position: 'top-right', scale: 0.25 },
    'youtube': { position: 'top-right', scale: 0.2 },
    'twitter': { position: 'bottom-right', scale: 0.15 }
  };

  const final = await addAvatarToVideo(videoPath, {
    enabled: req.body.useAvatar || false,
    avatarImage: req.body.avatarImage,
    audioFile: audioPath,
    ...avatarConfig[platform]
  });

  res.json({
    videoPath: final.finalVideoPath,
    platform: platform,
    hasAvatar: final.hasAvatar
  });
});
```

---

## Fraud Detection Agent (Reports)

```typescript
// POST /api/fraud/generate-report-video
import { addAvatarToVideo } from '../utils/avatar-helper.js';

router.post('/generate-report-video', async (req, res) => {
  const { analysisResults } = req.body;

  // Generate fraud analysis video
  const reportVideo = await generateAnalysisVisuals(analysisResults);
  const narration = await generateReportNarration(analysisResults);

  // Add investigator avatar
  const final = await addAvatarToVideo(reportVideo, {
    enabled: req.body.includePresenter || false,
    avatarImage: 'assets/avatars/investigator.png',
    audioFile: narration,
    position: 'top-left',
    scale: 0.18
  });

  res.json({
    reportPath: final.finalVideoPath,
    hasAvatar: final.hasAvatar
  });
});
```

---

## Documentation Generator

```typescript
// POST /api/docs/generate-tutorial-video
import { addAvatarToVideo } from '../utils/avatar-helper.js';

router.post('/generate-tutorial-video', async (req, res) => {
  const { procedureSteps } = req.body;

  // Generate step-by-step video
  const tutorialVideo = await generateProcedureVideo(procedureSteps);
  const audioPath = await generateInstructions(procedureSteps);

  // Add instructor avatar
  const final = await addAvatarToVideo(tutorialVideo, {
    enabled: true,  // Always on for tutorials
    avatarImage: 'assets/avatars/instructor.png',
    audioFile: audioPath,
    position: 'bottom-left',
    scale: 0.2,
    addBorder: true
  });

  res.json({
    tutorialPath: final.finalVideoPath,
    steps: procedureSteps.length
  });
});
```

---

## Generic Template

```typescript
// For any new agent
import { addAvatarToVideo, parseAvatarOptions, isAvatarAvailable } from '../utils/avatar-helper.js';

router.post('/your-agent-endpoint', async (req, res) => {
  try {
    // 1. Parse avatar options
    const avatarOptions = parseAvatarOptions(req.body, false);

    // 2. Generate your content (your existing code)
    const videoPath = await yourGenerator.generate(req.body);
    const audioPath = await yourAudioGenerator.generate(req.body);

    // 3. Add avatar if enabled
    const final = await addAvatarToVideo(videoPath, {
      ...avatarOptions,
      audioFile: audioPath
    });

    // 4. Return result
    res.json({
      success: true,
      videoPath: final.finalVideoPath,
      hasAvatar: final.hasAvatar,
      cost: {
        generation: yourCost,
        avatar: final.avatarCost,
        total: yourCost + final.avatarCost
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

---

## Avatar Library Structure

Create reusable avatars for different use cases:

```
assets/avatars/
├── teacher.png              # Educational videos
├── professor-male.png       # Advanced topics
├── professor-female.png     # Diversity
├── scientist.png            # Science topics
├── consultant.png           # Business strategy
├── investigator.png         # Fraud detection
├── instructor.png           # Tutorials
├── host-casual.png          # Social media
├── host-professional.png    # Corporate videos
└── expert-male.png          # Expert interviews
```

---

## Configuration Presets

```typescript
// Common avatar configurations for different use cases

const AVATAR_PRESETS = {
  // Educational
  education: {
    position: 'top-right',
    scale: 0.2,
    addBorder: true
  },

  // Business presentations
  business: {
    position: 'bottom-right',
    scale: 0.15,
    addBorder: true
  },

  // Social media
  social: {
    position: 'top-right',
    scale: 0.25,
    addBorder: false
  },

  // Tutorial/documentation
  tutorial: {
    position: 'bottom-left',
    scale: 0.2,
    addBorder: true
  },

  // Full presenter
  presenter: {
    position: 'top-right',
    scale: 0.3,
    addBorder: true
  }
};

// Usage
const final = await addAvatarToVideo(videoPath, {
  enabled: true,
  avatarImage: 'assets/avatars/teacher.png',
  audioFile: audioPath,
  ...AVATAR_PRESETS.education
});
```

---

## Cost Management

```typescript
// Check cost before generating
import { estimateAvatarCost, isAvatarAvailable } from '../utils/avatar-helper.js';

router.post('/estimate-cost', async (req, res) => {
  const { duration, includeAvatar } = req.body;

  const cost = {
    video: duration * 0.01,  // Your video cost
    avatar: includeAvatar ? estimateAvatarCost(duration, 'a2e') : 0
  };

  res.json({
    estimatedCost: cost.video + cost.avatar,
    breakdown: cost,
    avatarAvailable: isAvatarAvailable('a2e')
  });
});
```

---

## Feature Flags

```typescript
// Control avatar feature per user/plan
router.post('/generate', async (req, res) => {
  const user = await getUser(req.userId);

  // Check if user's plan includes avatars
  const canUseAvatar = user.plan.includes('premium');

  const avatarOptions = parseAvatarOptions(req.body, false);

  if (avatarOptions.enabled && !canUseAvatar) {
    return res.status(403).json({
      error: 'Avatar feature requires premium plan'
    });
  }

  // Generate with avatar if allowed
  const final = await addAvatarToVideo(videoPath, {
    ...avatarOptions,
    enabled: avatarOptions.enabled && canUseAvatar
  });

  res.json({ videoPath: final.finalVideoPath });
});
```

---

## Multi-Avatar Support (Future)

```typescript
// Support different avatars for different scenes
async function generateWithMultipleAvatars(scenes: Scene[]) {
  const finalScenes = [];

  for (const scene of scenes) {
    const sceneVideo = scene.videoPath;

    // Add scene-specific avatar
    const result = await addAvatarToVideo(sceneVideo, {
      enabled: scene.avatarEnabled || false,
      avatarImage: scene.avatarImage || 'default-avatar.png',
      audioFile: scene.audioPath,
      position: scene.avatarPosition || 'top-right',
      scale: scene.avatarScale || 0.2
    });

    finalScenes.push(result.finalVideoPath);
  }

  // Combine all scenes
  return await combineScenes(finalScenes);
}
```

---

## Performance Optimization

```typescript
// Cache avatar videos for reuse
const avatarCache = new Map<string, string>();

async function generateWithCachedAvatar(videoPath: string, options: AvatarOptions) {
  const cacheKey = `${options.avatarImage}_${options.audioFile}`;

  let avatarVideoPath;
  if (avatarCache.has(cacheKey)) {
    console.log('[Cache] Reusing cached avatar video');
    avatarVideoPath = avatarCache.get(cacheKey)!;
  } else {
    console.log('[Cache] Generating new avatar video');
    const result = await addAvatarToVideo(videoPath, options);
    avatarVideoPath = result.avatarVideoPath;
    if (avatarVideoPath) {
      avatarCache.set(cacheKey, avatarVideoPath);
    }
  }

  // Use cached avatar for compositing
  // ...
}
```

---

## Summary

**Integration steps for any agent:**

1. Import helper: `import { addAvatarToVideo } from '../utils/avatar-helper.js'`
2. Parse options: `const avatarOptions = parseAvatarOptions(req.body, false)`
3. Generate video: `const videoPath = await yourGenerator.generate()`
4. Add avatar: `const final = await addAvatarToVideo(videoPath, avatarOptions)`
5. Return result: `res.json({ videoPath: final.finalVideoPath })`

**That's it! 5 lines of code to add avatar support to any agent.**
