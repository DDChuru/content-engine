# 🎨 Adding Your Visuals to Remotion

## Yes! You can absolutely add images, logos, diagrams, and any visuals to Remotion videos.

---

## 📁 Quick Setup

### Step 1: Create the public folder (if it doesn't exist)

```bash
cd remotion-branding
mkdir -p public/images
```

### Step 2: Add your images

```bash
# Copy your logo
cp /path/to/your/logo.png public/images/logo.png

# Copy background image (optional)
cp /path/to/background.jpg public/images/background.jpg

# Copy any other visuals
cp /path/to/diagram.png public/images/diagram.png
cp /path/to/icon.svg public/images/icon.svg
```

### Step 3: Use in your video

Already done! I've created `IntroWithImage` component that uses your images.

```bash
# Preview it
npm start

# Then select "IntroWithImage" from the dropdown
```

---

## 🖼️ What Images Can You Add?

### ✅ Supported Formats:
- **PNG** - Best for logos with transparency
- **JPG/JPEG** - Good for photos/backgrounds
- **SVG** - Perfect for icons and diagrams
- **WebP** - Modern format, small file size
- **GIF** - Animated graphics

### 📐 Recommended Sizes:
- **Logo:** 500x500px (PNG with transparency)
- **Background:** 1920x1080px (match video resolution)
- **Icons:** 100x100px to 200x200px
- **Diagrams:** 1200x800px or larger

---

## 🎬 How to Use Your Images

### Example 1: Simple Logo

```tsx
import { Img, staticFile } from 'remotion';

<Img
  src={staticFile('images/logo.png')}
  style={{
    width: 200,
    height: 200,
  }}
/>
```

### Example 2: Background Image

```tsx
<Img
  src={staticFile('images/background.jpg')}
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',  // Fills screen, crops if needed
    opacity: 0.3,  // Make it subtle
  }}
/>
```

### Example 3: Multiple Images

```tsx
<AbsoluteFill>
  {/* Background */}
  <Img src={staticFile('images/background.jpg')} />

  {/* Logo on top */}
  <Img
    src={staticFile('images/logo.png')}
    style={{
      position: 'absolute',
      top: 50,
      left: 50,
      width: 150,
      height: 150,
    }}
  />

  {/* Diagram in center */}
  <Img
    src={staticFile('images/diagram.png')}
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 600,
    }}
  />
</AbsoluteFill>
```

---

## 🎨 Real Examples: How to Add YOUR Visuals

### Scenario 1: "I have a company logo"

```bash
# 1. Copy your logo
cp ~/Downloads/company-logo.png public/images/logo.png

# 2. It's already configured in IntroWithImage!
# Just preview:
npm start
```

That's it! Your logo will appear in the intro.

### Scenario 2: "I have a custom background"

```bash
# 1. Copy your background
cp ~/Pictures/background.jpg public/images/background.jpg

# 2. Already configured! Just preview:
npm start
```

### Scenario 3: "I have diagrams/screenshots"

```bash
# 1. Add your visuals
cp ~/Documents/process-diagram.png public/images/process-diagram.png
cp ~/Screenshots/software-screenshot.png public/images/screenshot.png

# 2. Create a new composition using them
```

Let me create an example composition for you:

---

## 📊 Example: SOP with Diagram

Let me show you how to create a slide with your diagram:

```tsx
// In src/Root.tsx, add:

import { Img, staticFile, Sequence } from 'remotion';

<Composition
  id="SOPWithDiagram"
  component={SOPDiagram}
  durationInFrames={180}  // 6 seconds
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    title: 'Temperature Monitoring Process',
    diagramPath: 'images/process-diagram.png',
  }}
/>

// Then create the component:
export const SOPDiagram = ({ title, diagramPath }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#f0f9ff' }}>
      {/* Title at top */}
      <h1 style={{
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 60,
        color: '#1e40af',
      }}>
        {title}
      </h1>

      {/* Your diagram - zooms in */}
      <div style={{
        position: 'absolute',
        top: 200,
        left: 0,
        right: 0,
        bottom: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Img
          src={staticFile(diagramPath)}
          style={{
            maxWidth: '80%',
            maxHeight: '80%',
            objectFit: 'contain',
            transform: `scale(${interpolate(frame, [0, 30], [0.8, 1])})`,
            opacity: interpolate(frame, [0, 20], [0, 1]),
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
```

---

## 🎯 Step-by-Step: Add Your Own Visuals

### For You Right Now:

**Step 1: Send me your images**

Just tell me:
- "I have a logo at /path/to/logo.png"
- "I have a background at /path/to/background.jpg"
- "I have diagrams at /path/to/diagrams/"

And I'll copy them and set everything up!

**Step 2: Or do it yourself:**

```bash
cd remotion-branding

# Copy your files
cp /path/to/your/logo.png public/images/logo.png
cp /path/to/your/background.jpg public/images/background.jpg

# Preview
npm start

# Render
npm run render:intro
```

---

## 🌐 Using Images from URLs

You can also use images directly from the internet:

```tsx
<Img
  src="https://your-website.com/logo.png"
  style={{ width: 200, height: 200 }}
/>
```

**Note:** Local images are faster and more reliable!

---

## 📝 Common Use Cases

### Use Case 1: Company Logo in Intro

```tsx
// Already set up in IntroWithImage!
defaultProps={{
  logoPath: 'images/logo.png',  // ← Your logo here
}}
```

### Use Case 2: Process Diagram in Training Video

```tsx
<Img
  src={staticFile('images/process-flowchart.png')}
  style={{
    width: '90%',
    maxHeight: 800,
    objectFit: 'contain',
  }}
/>
```

### Use Case 3: Screenshots for Software Tutorial

```tsx
<Sequence from={0} durationInFrames={90}>
  <Img src={staticFile('images/screenshot-step1.png')} />
</Sequence>

<Sequence from={90} durationInFrames={90}>
  <Img src={staticFile('images/screenshot-step2.png')} />
</Sequence>

<Sequence from={180} durationInFrames={90}>
  <Img src={staticFile('images/screenshot-step3.png')} />
</Sequence>
```

### Use Case 4: Icons for Steps

```tsx
// Step 1 with icon
<div style={{ display: 'flex', alignItems: 'center' }}>
  <Img
    src={staticFile('images/icon-thermometer.svg')}
    style={{ width: 80, height: 80, marginRight: 20 }}
  />
  <h2>Calibrate Thermometer</h2>
</div>
```

---

## 🎨 Image Effects & Animations

### Fade In

```tsx
<Img
  src={staticFile('images/logo.png')}
  style={{
    opacity: interpolate(frame, [0, 30], [0, 1]),
  }}
/>
```

### Zoom In

```tsx
<Img
  src={staticFile('images/diagram.png')}
  style={{
    transform: `scale(${interpolate(frame, [0, 30], [0.5, 1])})`,
  }}
/>
```

### Slide In from Left

```tsx
<Img
  src={staticFile('images/logo.png')}
  style={{
    transform: `translateX(${interpolate(frame, [0, 30], [-200, 0])}px)`,
  }}
/>
```

### Rotate

```tsx
<Img
  src={staticFile('images/icon.svg')}
  style={{
    transform: `rotate(${interpolate(frame, [0, 60], [0, 360])}deg)`,
  }}
/>
```

---

## 💡 Pro Tips

### Tip 1: Optimize Images First

Before adding to Remotion:
```bash
# Resize large images
convert background.jpg -resize 1920x1080 background-optimized.jpg

# Compress PNG
pngquant logo.png --output logo-compressed.png

# Convert to WebP (smaller file size)
cwebp background.jpg -q 80 -o background.webp
```

### Tip 2: Use Transparency

PNG files with transparent backgrounds look best:
- Logo on any background
- Icons that blend in
- Overlays that don't cover everything

### Tip 3: Organize Your Images

```
public/
  └── images/
      ├── logos/
      │   ├── main-logo.png
      │   └── secondary-logo.png
      ├── backgrounds/
      │   ├── intro-bg.jpg
      │   └── outro-bg.jpg
      ├── diagrams/
      │   ├── process-flow.png
      │   └── org-chart.svg
      └── icons/
          ├── thermometer.svg
          ├── checklist.svg
          └── warning.svg
```

---

## 🚀 Quick Start Checklist

To add YOUR visuals right now:

- [ ] Create folder: `mkdir -p public/images`
- [ ] Copy your logo: `cp /path/to/logo.png public/images/logo.png`
- [ ] (Optional) Copy background: `cp /path/to/bg.jpg public/images/background.jpg`
- [ ] Preview: `npm start` and select "IntroWithImage"
- [ ] Render: `remotion render src/index.ts IntroWithImage out/intro-with-my-logo.mp4`

---

## 📸 Send Me Your Images!

**Just tell me:**

"Claude, I have these images to add:"
- Logo: `/home/user/company-logo.png`
- Background: `/home/user/office-photo.jpg`
- Diagram: `/home/user/process-diagram.png`

**And I'll:**
1. Copy them to the right location
2. Set them up in your compositions
3. Show you how to preview and render

---

## 🎬 Ready to Use Your Visuals?

Your Remotion setup is ready to accept ANY images! Just:

1. Put images in `public/images/`
2. Reference them with `staticFile('images/yourfile.png')`
3. Preview with `npm start`
4. Render with `npm run render:intro`

**Want to add your images right now?** Just tell me where they are!
