# 🎬 Getting Started with Your Branded Intro/Outro

## ✅ What's Been Created

Your Remotion branding package is ready! Here's what you have:

```
remotion-branding/
├── src/
│   ├── Intro.tsx          ← Animated intro template
│   ├── Outro.tsx          ← Animated outro template
│   ├── Root.tsx           ← Compositions (customize here!)
│   └── index.ts           ← Entry point
├── examples/
│   └── render-custom.sh   ← Example render scripts
├── package.json           ← Scripts & dependencies
├── README.md              ← Full documentation
└── quick-start.sh         ← Setup script
```

---

## 🚀 Try It Now (3 Steps)

### Step 1: Preview Templates

```bash
cd remotion-branding
npm start
```

This opens **Remotion Studio** in your browser where you can:
- See live preview of intro and outro
- Scrub through timeline
- Adjust parameters in real-time

**What you'll see:**
- "Content Engine" intro (3 seconds)
- "Thanks for Watching!" outro (5 seconds)
- Smooth animations, professional look

### Step 2: Customize

Edit `src/Root.tsx` to change the text and colors:

```tsx
// Line 11-19: Change the default intro
defaultProps={{
  title: 'Your Company Name',        // ← Your title
  subtitle: 'Your Tagline Here',     // ← Your subtitle
  brandColor: '#4f46e5',             // ← Your color
}}

// Line 31-43: Change the default outro
defaultProps={{
  title: 'Thanks for Watching!',     // ← Your message
  callToAction: 'Subscribe!',        // ← Your CTA
  socialHandles: {
    youtube: '@YourChannel',         // ← Your socials
    website: 'yoursite.com',
  },
  brandColor: '#4f46e5',             // ← Same color
}}
```

Save the file, and the preview updates instantly!

### Step 3: Render Videos

```bash
# Render intro
npm run render:intro

# Render outro
npm run render:outro

# Or render both at once
npm run render:all
```

**Output:**
- `out/intro.mp4` (3 seconds, 1080p)
- `out/outro.mp4` (5 seconds, 1080p)

---

## 🎨 Quick Customization Examples

### Example 1: Change Colors

```tsx
brandColor: '#0ea5e9'  // Sky blue
brandColor: '#10b981'  // Green
brandColor: '#f59e0b'  // Orange
brandColor: '#ef4444'  // Red
```

### Example 2: Add Your Logo

```tsx
defaultProps={{
  title: 'Content Engine',
  logo: '/path/to/your/logo.png',  // Add this line
}}
```

### Example 3: Custom Social Links

```tsx
socialHandles: {
  youtube: '@ContentEngine',
  twitter: '@CE_Training',
  website: 'contentengine.dev',
}
```

---

## 🎬 Use with OBS Content

### Workflow:

```
1. Render intro:     out/intro.mp4 (3s)
2. Record with OBS:  main-content.mp4 (10min)
3. Render outro:     out/outro.mp4 (5s)
4. Combine all three ↓
```

### Combine Videos:

```bash
# Install ffmpeg if needed: sudo apt install ffmpeg

ffmpeg -i out/intro.mp4 -i main-content.mp4 -i out/outro.mp4 \
  -filter_complex "[0:v][1:v][2:v]concat=n=3:v=1[outv]" \
  -map "[outv]" final-video.mp4
```

**Result:** `final-video.mp4` with professional intro and outro!

---

## 📐 Specifications

| Property | Value |
|----------|-------|
| Resolution | 1920x1080 (Full HD) |
| Frame Rate | 30 FPS |
| Intro Length | 3 seconds (90 frames) |
| Outro Length | 5 seconds (150 frames) |
| Format | MP4 (H.264) |

---

## 🎯 What's Happening

### Intro Animation Timeline:

```
0.0s  ─┐
       │ Logo scales from 0 to 1 (spring animation)
0.5s  ─┤
       │ Title slides in from left
1.0s  ─┤
       │ Subtitle fades in
1.5s  ─┤
       │ Decorative line draws across
2.0s  ─┤
       │ All elements settle
3.0s  ─┘ END
```

### Outro Animation Timeline:

```
0.0s  ─┐
       │ Fade in from black
0.5s  ─┤
       │ "Thanks" message scales in
1.0s  ─┤
       │ CTA button appears with pulse
2.0s  ─┤
       │ Social handles slide up
3.0s  ─┤
       │ Everything settles
5.0s  ─┘ END
```

---

## 💡 Pro Tips

### Tip 1: Keep Text Short
- Intro title: 1-4 words max
- Intro subtitle: 1 short sentence
- Outro CTA: 2-5 words

### Tip 2: Brand Consistency
- Use the same `brandColor` for all videos
- Keep the same logo across series
- Match colors to your brand guidelines

### Tip 3: Test Before Batch
- Always preview in Remotion Studio first
- Check readability at 1080p
- Verify animations are smooth

### Tip 4: Performance
Render faster with more CPU cores:
```bash
remotion render src/index.ts Intro out/intro.mp4 --concurrency=4
```

---

## 🚀 Advanced: Multiple Versions

Create variations for different video types:

```tsx
// In src/Root.tsx, add more compositions:

// For SOP videos
<Composition
  id="SOPIntro"
  component={Intro}
  durationInFrames={90}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    title: 'SOP Training',
    subtitle: 'Standard Operating Procedures',
    brandColor: '#0ea5e9',  // Different color for SOPs
  }}
/>

// For lessons
<Composition
  id="LessonIntro"
  component={Intro}
  durationInFrames={90}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    title: 'Today\'s Lesson',
    subtitle: 'Educational Content',
    brandColor: '#10b981',  // Green for lessons
  }}
/>
```

Then render specific versions:
```bash
remotion render src/index.ts SOPIntro out/sop-intro.mp4
remotion render src/index.ts LessonIntro out/lesson-intro.mp4
```

---

## 📚 Next Steps

**Ready to go? Here's your checklist:**

- [ ] Run `npm start` to preview
- [ ] Customize title/subtitle in `src/Root.tsx`
- [ ] Change `brandColor` to match your brand
- [ ] (Optional) Add your logo
- [ ] Render test videos with `npm run render:all`
- [ ] Combine with OBS content using ffmpeg
- [ ] Upload your first professional video! 🎉

**Need help?**
- Full docs: `README.md`
- Example renders: `examples/render-custom.sh`
- Remotion docs: https://remotion.dev/docs

---

## 🎬 You're All Set!

Your branded intro/outro templates are ready to make your videos look professional. Start by running:

```bash
npm start
```

Happy creating! 🚀
