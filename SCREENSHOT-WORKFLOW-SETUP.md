# Screenshot Workflow Setup Guide

## Overview
This setup allows you to capture screenshots from the Studio UI and have Claude automatically analyze them.

## Installation

1. **Install dependencies:**
   ```bash
   cd /home/dachu/Documents/projects/content-engine
   npm install
   ```

2. **Start the Studio system:**
   ```bash
   npm run studio
   ```

   This will start:
   - Bridge Agent Server (port 3001) - handles screenshots and file watching
   - HTTP Server (port 8000) - serves the Studio UI

## Usage Workflow

### 1. Capture Screenshot from Studio UI

1. Open the Studio UI: http://localhost:8000/excalidraw-studio-autonomous.html
2. Navigate to the lesson step you want to capture
3. Click the **"📸 Capture Screenshot"** button in the Studio panel
4. You'll see a confirmation with the screenshot filename and path

### 2. Analyze Screenshot with Claude

In your Claude conversation, simply type:

```
/screenshot
```

Claude will:
- Automatically find the latest screenshot
- Read and analyze it
- Provide specific feedback on what's shown
- Offer to fix any issues detected

### 3. Alternative: Process Studio Requests

If you've submitted change requests through the Studio UI:

```
/studio
```

This will process all pending change requests.

## Other Useful Commands

- `/voice-test` - Test voice narration generation
- `/export-lesson` - Export lesson as standalone package
- `/new-step` - Add a new step to the lesson
- `/preview` - Quick status check of the lesson

## File Locations

- **Screenshots:** `/home/dachu/Documents/projects/content-engine/screenshots/`
- **Latest screenshot metadata:** `screenshots/latest-screenshot.json`
- **Studio change requests:** `studio-change-requests.json`
- **Studio change responses:** `studio-change-responses.json`

## Features

✅ One-click screenshot capture from Studio UI
✅ Automatic file saving with timestamps
✅ Screenshot copied to clipboard (browser support required)
✅ Metadata tracking for latest screenshot
✅ Automatic analysis via `/screenshot` command
✅ No manual file paths needed
✅ Seamless integration with Claude Code

## Troubleshooting

**Screenshot button not working:**
- Ensure Bridge Agent Server is running (npm run studio)
- Check console for errors
- Verify port 3001 is not blocked

**Screenshot not found:**
- Check that screenshots directory exists
- Verify latest-screenshot.json was created
- Look for error messages in bridge agent console

**Dependencies missing:**
- Run `npm install` in the content-engine directory
- Check that all packages are installed correctly

## Technical Details

- **html2canvas** - Captures iframe content as image
- **multer** - Handles file uploads in Express
- **Socket.IO** - Real-time communication between UI and server
- **chokidar** - Watches for file changes
- **Express** - HTTP server for API endpoints
