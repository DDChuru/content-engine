# Excalidraw-Style Demo

Programmatically controlled hand-drawn diagrams with voice narration for educational content.

## 🎨 What This Demo Shows

Unlike the previous whiteboard demo, this one creates **actual diagrams** programmatically:

- ✏️ Hand-drawn Venn diagrams
- 📊 Set notation and mathematical symbols
- 🎯 Step-by-step diagram building
- 🗣️ Synchronized voice narration
- 📸 PNG export capability

## ✨ Key Features

### Excalidraw-Style Rendering

This demo creates an **Excalidraw-like aesthetic** without needing the full React component:

1. **Rough/Sketchy Lines** - Randomized paths for hand-drawn feel
2. **Organic Shapes** - Circles and rectangles with natural variation
3. **Hand-written Text** - Comic Sans font for casual, approachable look
4. **Arrows & Annotations** - Professional diagram elements

### Perfect for Math Education

- **Venn Diagrams** - Visual set relationships
- **Set Notation** - Mathematical symbols and braces
- **Color Coding** - Different colors for different sets
- **Progressive Reveal** - Build diagrams step by step

## 🚀 Usage

### Access the Demo

Open in your browser:
```
http://localhost:8000/excalidraw-demo.html
```

### Controls

1. **Play Demo** - Start the animated lesson (7 steps)
2. **Reset** - Clear and start over
3. **Export PNG** - Download current diagram as image

### What You'll See

**7-Step Progression:**
1. Title introduction
2. Definition of a Set
3. Set notation (curly braces)
4. Venn diagram - Set A
5. Venn diagram - Set B (overlapping)
6. Intersection explanation
7. Union explanation
8. Universal set concept

## 🎯 How It Works

### Programmatic Drawing

Unlike the first demo which animated HTML/CSS, this one **draws on canvas**:

```javascript
// Create a rough circle (hand-drawn style)
drawRoughCircle(x, y, radius, color, fillColor, opacity);

// Draw text with hand-written feel
drawText(text, x, y, size, color, align, bold);

// Draw arrows for annotations
drawArrow(x1, y1, x2, y2, color);
```

### Scene-Based Architecture

Elements are defined once, then revealed step-by-step:

```javascript
// Define element
renderer.addElement('step3-vennA', (r) => {
  r.drawRoughCircle(400, 400, 120, '#667eea');
  r.drawText('A', 350, 350, 32, '#667eea');
});

// Show when needed
renderer.showElement('step3-vennA');
```

### Voice Synchronization

Same as the whiteboard demo:
- ElevenLabs API with your voice ID
- Automatic fallback to Web Speech API
- Step progresses when narration completes

## 🎨 Visual Advantages Over First Demo

| Feature | Whiteboard Demo | Excalidraw Demo |
|---------|----------------|-----------------|
| Text content | ✅ Excellent | ✅ Good |
| Diagrams | ⚠️ Limited | ✅ **Excellent** |
| Math symbols | ✅ Good | ✅ **Great** |
| Hand-drawn feel | ⚠️ Via Rough.js | ✅ **Native** |
| Venn diagrams | ❌ Manual SVG | ✅ **Programmatic** |
| Arrows/Annotations | ⚠️ Manual | ✅ **Built-in** |
| Export quality | ✅ Screenshot | ✅ **PNG export** |

## 💡 When to Use Each Demo

### Use Whiteboard Demo for:
- Text-heavy content
- Step-by-step explanations
- List-based lessons
- Simple visual accents

### Use Excalidraw Demo for:
- **Diagram-heavy content** ⭐
- **Mathematical visualizations** ⭐
- **Venn diagrams** ⭐
- **Geometric shapes** ⭐
- **Annotated illustrations** ⭐

## 🔧 Customization

### Change Diagram Content

Edit the `setupScene()` function:

```javascript
function setupScene() {
  // Add your own elements
  renderer.addElement('myElement', (r) => {
    r.drawRoughCircle(x, y, radius, color);
    r.drawText('My Text', x, y, size);
  });
}
```

### Modify Step Sequence

Update the `lessonSteps` array:

```javascript
const lessonSteps = [
  {
    id: 'step1',
    elements: ['title', 'step1'],  // Which elements to show
    title: 'Step Title',
    description: 'Step description',
    narration: 'What to say'
  },
  // ... more steps
];
```

### Drawing Methods Available

```javascript
// Basic shapes
drawRoughLine(x1, y1, x2, y2, color, width);
drawRoughCircle(x, y, radius, color, fillColor, opacity);
drawRoughRect(x, y, width, height, color, fillColor);

// Text and annotations
drawText(text, x, y, size, color, align, bold);
drawArrow(x1, y1, x2, y2, color);

// Scene management
addElement(id, drawFunc);
showElement(id);
clear();
reset();
```

## 📹 Video Export

### Built-in PNG Export

Click "Export PNG" to download the current frame as an image.

### For Video Creation

**Option 1: Frame-by-Frame**
```javascript
// Export each step as PNG
lessonSteps.forEach((step, index) => {
  showStep(step);
  exportPNG(`frame-${index}.png`);
});

// Combine with ffmpeg
ffmpeg -framerate 1 -i frame-%d.png output.mp4
```

**Option 2: Screen Recording**
Use Puppeteer to record the entire animation:

```javascript
const page = await browser.newPage();
await page.goto('http://localhost:8000/excalidraw-demo.html');
await page.click('#playBtn');

// Record video while animation plays
```

**Option 3: Canvas Stream**
Add MediaRecorder to capture canvas directly:

```javascript
const stream = canvas.captureStream(60); // 60fps
const recorder = new MediaRecorder(stream);
// Record and download
```

## 🎓 Perfect for Your 11 Labs

This approach is **ideal** for mathematical content because:

### Cambridge IGCSE Math Topics Perfect for This:

✅ **Set Theory** - Venn diagrams, unions, intersections
✅ **Geometry** - Angles, triangles, circles
✅ **Algebra** - Function graphs, coordinate systems
✅ **Statistics** - Charts, distributions, probability trees
✅ **Number Theory** - Prime factorization trees, factor diagrams

### Example Lab Structure:

```
Lab: Introduction to Sets (15 min)
├── Intro (Whiteboard) - 2 min
├── Definition diagrams (Excalidraw) - 3 min
├── Venn diagram examples (Excalidraw) - 5 min
├── Practice problems (Manim) - 4 min
└── Summary (Whiteboard) - 1 min
```

## 🆚 Comparison Table

| Aspect | Whiteboard | Excalidraw | Manim |
|--------|-----------|------------|-------|
| Setup complexity | Easy | Easy | Medium |
| Text content | ✅ Best | ✅ Good | ⚠️ OK |
| Diagrams | ⚠️ Limited | ✅ **Best** | ✅ Great |
| Math animations | ❌ | ⚠️ Static | ✅ **Best** |
| Hand-drawn feel | ✅ Good | ✅ **Best** | ❌ |
| Professional look | ✅ Good | ✅ Good | ✅ **Best** |
| Export quality | ✅ Good | ✅ Great | ✅ **Best** |
| Code complexity | Low | Low | High |

## 🔮 Advanced Features You Could Add

### Interactive Elements
```javascript
// Make diagrams clickable
canvas.addEventListener('click', (e) => {
  // Show tooltips, zoom, etc.
});
```

### Animation Tweening
```javascript
// Animate circle growing
animateCircleGrowth(startRadius, endRadius, duration);
```

### Multiple Scenes
```javascript
// Switch between different diagram scenes
loadScene('venn-diagrams');
loadScene('factor-trees');
loadScene('coordinate-plane');
```

### Real-time Collaboration
```javascript
// Students can add their own annotations
enableDrawingMode();
```

## 🚀 Production Workflow

### For Course Creation:

1. **Define lesson structure** (your 11 labs)
2. **Create diagram scenes** (programmatically)
3. **Generate narration** (batch ElevenLabs API)
4. **Record animations** (Puppeteer)
5. **Combine with Manim** (ffmpeg)
6. **Deploy videos** (to your platform)

### Automation Script:

```bash
# Generate all diagrams for a lab
npm run generate-diagrams -- --lab="sets-introduction"

# Create narration audio
npm run generate-audio -- --lab="sets-introduction"

# Record video
npm run record-video -- --lab="sets-introduction"

# Combine with Manim
npm run combine-videos -- --lab="sets-introduction"
```

## 📊 Performance

- Canvas rendering: 60fps capable
- Memory efficient: Single canvas element
- Export time: < 1 second per frame
- Voice generation: ~2 seconds per clip

## 🎯 Next Steps

Want to create:
- [ ] More math diagram types (graphs, trees, etc.)
- [ ] Interactive problem-solving mode
- [ ] Student annotation tools
- [ ] Automated video pipeline
- [ ] Multi-scene transitions
- [ ] LaTeX equation rendering

---

**Built with:**
- HTML5 Canvas - Native drawing
- Custom rough drawing algorithms
- ElevenLabs Voice API
- Pure JavaScript (no frameworks!)

**No API keys needed** for the drawing features - 100% free! 🎉
