#!/usr/bin/env bash
# Deploy Spicegro video player to EnviroWize Firebase Hosting
# Final URL: https://envirowize.web.app/spicegro/
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
MP4_PATH="$BACKEND_DIR/output/spicegro/spicegro-introduction.mp4"
NCR_APP="$HOME/Documents/projects/angular/ncr_audit_app"
DEPLOY_DIR="$NCR_APP/dist/ncr-app-envirowize/browser/spicegro"

echo "=== Spicegro Web Deploy ==="

# Step 1: Render MP4 if missing
if [ ! -f "$MP4_PATH" ]; then
  echo ">> MP4 not found, rendering..."
  bash "$SCRIPT_DIR/render-spicegro.sh" --skip-images
fi

echo ">> MP4 ready: $MP4_PATH ($(du -h "$MP4_PATH" | cut -f1))"

# Step 2: Create deploy directory
mkdir -p "$DEPLOY_DIR"

# Step 3: Generate index.html
cat > "$DEPLOY_DIR/index.html" << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EnviroWize for Spicegro</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0a1628;
      color: #f0f4f8;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    h1 {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.3rem;
      color: #34d399;
    }
    .subtitle {
      font-size: 1rem;
      color: #94a3b8;
      margin-bottom: 1.5rem;
    }
    video {
      width: 100%;
      max-width: 960px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    }
    .footer {
      margin-top: 1.5rem;
      font-size: 0.85rem;
      color: #64748b;
    }
    .footer a { color: #34d399; text-decoration: none; }
  </style>
</head>
<body>
  <h1>EnviroWize for Spicegro</h1>
  <p class="subtitle">Food Safety Consulting &amp; Sanitation Services</p>
  <video controls preload="metadata">
    <source src="spicegro-introduction.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <p class="footer">
    &copy; EnviroWize Food Safety Consulting &mdash;
    <a href="https://envirowize.web.app">envirowize.web.app</a>
  </p>
</body>
</html>
HTMLEOF

echo ">> index.html generated"

# Step 4: Copy MP4
cp "$MP4_PATH" "$DEPLOY_DIR/spicegro-introduction.mp4"
echo ">> MP4 copied to deploy dir"

# Step 5: Deploy to Firebase Hosting (envirowize tenant)
echo ">> Deploying to Firebase..."
cd "$NCR_APP"
firebase deploy --only hosting:envirowize

echo ""
echo "=== Done ==="
echo "URL: https://envirowize.web.app/spicegro/"
