#!/bin/bash
# Quick Start Script for Remotion Branding

set -e

echo "🎬 Content Engine - Remotion Branding Setup"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the remotion-branding directory"
    exit 1
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}Available commands:${NC}"
echo ""
echo "  npm start              - Preview templates in browser"
echo "  npm run render:intro   - Render intro video"
echo "  npm run render:outro   - Render outro video"
echo "  npm run render:all     - Render both intro and outro"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo ""
echo "1. Run 'npm start' to preview templates"
echo "2. Customize in src/Root.tsx (change title, colors, etc.)"
echo "3. Render videos with npm run render:all"
echo ""
echo "📖 See README.md for full documentation"
echo ""
