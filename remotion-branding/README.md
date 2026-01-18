# Content Engine - Branded Intro/Outro Templates

Professional Remotion templates for your educational and training videos.

---

## 🎬 What's Included

### **Intro Template**
- 3-second branded introduction
- Animated logo/icon
- Title slide-in animation
- Subtitle fade-in
- Customizable colors and branding
- Professional gradient background

### **Outro Template**
- 5-second closing
- Thank you message
- Call-to-action button with pulse effect
- Social media handles
- Contact information
- Smooth animations

---

## 🚀 Quick Start

### 1. Preview Templates

```bash
cd remotion-branding
npm start
```

This opens the Remotion Studio where you can:
- See live preview of all templates
- Adjust parameters in real-time
- Scrub through timeline
- Test animations

### 2. Render Videos

**Render default intro:**
```bash
npm run render:intro
```
Output: `out/intro.mp4`

**Render default outro:**
```bash
npm run render:outro
```
Output: `out/outro.mp4`

**Render both:**
```bash
npm run render:all
```

---

## 🎨 Customization

### Method 1: Edit Default Props (Simple)

Edit `src/Root.tsx` to change the default values:

```tsx
<Composition
  id="Intro"
  component={Intro}
  durationInFrames={90}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    title: 'Your Company Name',           // ← Change this
    subtitle: 'Your Tagline',              // ← Change this
    brandColor: '#4f46e5',                 // ← Your brand color
  }}
/>
```

### Method 2: Custom Props via CLI (Advanced)

```bash
remotion render src/index.ts Intro out/custom-intro.mp4 \
  --props='{"title": "My Training", "subtitle": "SOP Guidelines", "brandColor": "#0ea5e9"}'
```

### Method 3: Create New Compositions

```tsx
// In src/Root.tsx, add a new composition:

<Composition
  id="MyCustomIntro"
  component={Intro}
  durationInFrames={90}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    title: 'Food Safety Training',
    subtitle: 'Employee Onboarding Module 1',
    brandColor: '#10b981',
  }}
/>
```

Then render it:
```bash
remotion render src/index.ts MyCustomIntro out/my-custom-intro.mp4
```

---

## 🎯 Available Props

### Intro Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | Required | Main title text |
| `subtitle` | string | "Professional Training Content" | Subtitle below title |
| `brandColor` | string | "#4f46e5" | Primary brand color (hex) |
| `logo` | string | undefined | Path to logo image file |

### Outro Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | Required | Thank you message |
| `callToAction` | string | "Subscribe for more!" | CTA button text |
| `contactInfo` | string | undefined | Contact email or info |
| `socialHandles` | object | undefined | Social media handles |
| `brandColor` | string | "#4f46e5" | Primary brand color |

### Social Handles Object

```tsx
socialHandles: {
  youtube: '@YourChannel',      // Optional
  twitter: '@YourHandle',       // Optional
  website: 'yoursite.com',      // Optional
}
```

---

## 📐 Specifications

- **Resolution:** 1920x1080 (Full HD)
- **Frame Rate:** 30 FPS
- **Intro Duration:** 3 seconds (90 frames)
- **Outro Duration:** 5 seconds (150 frames)
- **Format:** MP4 (H.264)

---

## 🎬 Usage in Video Production

### Workflow 1: Remotion Intro/Outro + OBS Main Content

```bash
# 1. Render intro
npm run render:intro

# 2. Record your main content with OBS
#    (your presentation, annotations, voiceover)

# 3. Render outro
npm run render:outro

# 4. Combine all three videos
ffmpeg -i out/intro.mp4 -i main-content.mp4 -i out/outro.mp4 \
  -filter_complex "[0:v][1:v][2:v]concat=n=3:v=1[outv]" \
  -map "[outv]" final-video.mp4
```

### Workflow 2: All Programmatic

```bash
# 1. Generate content with backend
curl POST /api/generate/sop

# 2. Render intro with custom props
remotion render src/index.ts Intro out/intro.mp4 \
  --props='{"title": "Temperature Monitoring", "subtitle": "SOP Training"}'

# 3. Use Remotion for main content too (advanced)
# 4. Render outro
# 5. Combine
```

---

## 🎨 Brand Color Examples

Replace `brandColor` with your brand:

```tsx
brandColor: '#4f46e5'  // Indigo (default)
brandColor: '#0ea5e9'  // Sky Blue
brandColor: '#10b981'  // Emerald Green
brandColor: '#f59e0b'  // Amber
brandColor: '#ef4444'  // Red
brandColor: '#8b5cf6'  // Purple
```

---

## 🖼️ Adding Your Logo

### Option 1: Use Local File

```tsx
defaultProps={{
  title: 'Content Engine',
  logo: '/path/to/your/logo.png',  // Absolute path
}}
```

### Option 2: Use URL

```tsx
defaultProps={{
  title: 'Content Engine',
  logo: 'https://yourdomain.com/logo.png',
}}
```

**Logo Requirements:**
- Format: PNG, SVG, or JPG
- Size: 300x300px recommended
- Background: Transparent (PNG) works best

---

## 🎵 Adding Background Music (Optional)

Edit `src/Intro.tsx` or `src/Outro.tsx`:

```tsx
import { Audio } from 'remotion';

export const Intro: React.FC<IntroProps> = (props) => {
  return (
    <AbsoluteFill>
      {/* Existing content */}
      ...

      {/* Add background music */}
      <Audio
        src="/path/to/music.mp3"
        volume={0.3}  // 30% volume
      />
    </AbsoluteFill>
  );
};
```

---

## 📦 Integration with Content Engine Backend

### Automated Video Generation

```typescript
// In your backend API
router.post('/generate-video-with-branding', async (req, res) => {
  const { topic, category } = req.body;

  // 1. Render custom intro
  await exec(`
    cd remotion-branding &&
    remotion render src/index.ts Intro ../out/intro.mp4 \
      --props='{"title": "${topic}", "subtitle": "${category}"}'
  `);

  // 2. Generate main content (your existing logic)
  const mainContent = await generateMainContent(topic);

  // 3. Render outro
  await exec(`
    cd remotion-branding &&
    npm run render:outro
  `);

  // 4. Combine videos
  await exec(`
    ffmpeg -i intro.mp4 -i main.mp4 -i outro.mp4 \
      -filter_complex concat=n=3:v=1 final.mp4
  `);

  res.json({ videoUrl: 'final.mp4' });
});
```

---

## 🎬 Examples

### Example 1: SOP Training Video

```bash
remotion render src/index.ts Intro out/sop-intro.mp4 \
  --props='{
    "title": "Temperature Monitoring",
    "subtitle": "Food Safety SOP",
    "brandColor": "#0ea5e9"
  }'
```

### Example 2: Employee Onboarding

```bash
remotion render src/index.ts Intro out/onboarding-intro.mp4 \
  --props='{
    "title": "Welcome to the Team!",
    "subtitle": "Onboarding Module 1: Company Culture",
    "brandColor": "#10b981"
  }'

remotion render src/index.ts Outro out/onboarding-outro.mp4 \
  --props='{
    "title": "Great Job!",
    "callToAction": "Next: Complete Module 2",
    "contactInfo": "hr@company.com"
  }'
```

### Example 3: YouTube Tutorial

```bash
remotion render src/index.ts Outro out/youtube-outro.mp4 \
  --props='{
    "title": "Thanks for Watching!",
    "callToAction": "Subscribe & Hit the Bell! 🔔",
    "socialHandles": {
      "youtube": "@ContentEngine",
      "twitter": "@CE_Dev",
      "website": "contentengine.dev"
    }
  }'
```

---

## 📝 Tips & Best Practices

### **Keep It Short**
- Intro: 2-3 seconds is ideal
- Outro: 5-7 seconds maximum
- Viewers skip long intros!

### **Consistent Branding**
- Use the same colors across all videos
- Keep the same logo/icon
- Maintain consistent fonts

### **Audio**
- Add subtle background music (low volume)
- Use sound effects sparingly
- Match music tempo to animation speed

### **Test Before Batch Rendering**
- Always preview in Remotion Studio first
- Check colors on different displays
- Verify text is readable at 1080p

---

## 🚀 Performance

### Faster Rendering

```bash
# Use more CPU cores (if available)
remotion render src/index.ts Intro out/intro.mp4 --concurrency=4

# Lower quality for faster preview
remotion render src/index.ts Intro out/intro.mp4 --quality=50

# Use GPU acceleration (if available)
remotion render src/index.ts Intro out/intro.mp4 --gl=angle
```

---

## 🎯 Next Steps

1. ✅ **Preview templates:** `npm start`
2. ✅ **Customize colors/text** in `src/Root.tsx`
3. ✅ **Add your logo** to intro
4. ✅ **Render test videos:** `npm run render:all`
5. ✅ **Combine with OBS content** using ffmpeg
6. ✅ **Automate with backend API** (optional)

---

## 📚 Resources

- **Remotion Docs:** https://remotion.dev/docs
- **Animation Examples:** https://remotion.dev/showcase
- **Community:** https://remotion.dev/discord

---

## 🎬 Ready to Go!

Your intro/outro templates are ready. Start creating professional videos!

```bash
npm start  # Preview templates
npm run render:all  # Render intro + outro
```

Questions? Check the examples above or explore the code in `src/`
