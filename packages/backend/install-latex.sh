#!/bin/bash

# LaTeX Installation Script for Manim MathTex Support
# Run this script to install all necessary LaTeX packages

echo "🔧 Installing LaTeX packages for Manim..."
echo "This will take a few minutes (LaTeX is ~500MB)"

sudo apt-get update

# Install LaTeX and required packages
sudo apt-get install -y \
  texlive \
  texlive-latex-extra \
  texlive-fonts-extra \
  texlive-latex-recommended \
  texlive-science \
  texlive-fonts-recommended \
  cm-super \
  dvipng

# Verify installation
echo ""
echo "✅ Verifying installation..."
if command -v latex &> /dev/null; then
    echo "✓ LaTeX installed successfully"
    latex --version | head -n 1
else
    echo "✗ LaTeX installation failed"
    exit 1
fi

echo ""
echo "🎉 LaTeX installation complete!"
echo "You can now use MathTex in Manim for proper mathematical notation."
