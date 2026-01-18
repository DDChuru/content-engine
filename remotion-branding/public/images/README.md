# 📁 Images Folder

## Add your images here!

### Folder Structure:

```
images/
├── logos/           ← Company logos
├── backgrounds/     ← Background images
├── diagrams/        ← Process diagrams, flowcharts
└── icons/           ← Icons, small graphics
```

---

## Quick Start:

### Copy your images:

```bash
# Logo
cp /path/to/your/logo.png logos/logo.png

# Background
cp /path/to/background.jpg backgrounds/background.jpg

# Diagram
cp /path/to/diagram.png diagrams/process-flow.png
```

### Use in Remotion:

```tsx
import { Img, staticFile } from 'remotion';

<Img src={staticFile('images/logos/logo.png')} />
<Img src={staticFile('images/backgrounds/background.jpg')} />
<Img src={staticFile('images/diagrams/process-flow.png')} />
```

---

## Recommended Sizes:

- **Logos:** 500x500px (PNG with transparency)
- **Backgrounds:** 1920x1080px (JPG or PNG)
- **Diagrams:** 1200x800px or larger
- **Icons:** 100x100px to 200x200px (SVG preferred)

---

## Supported Formats:

✅ PNG, JPG, WebP, SVG, GIF

---

See `ADDING-VISUALS.md` for full documentation!
