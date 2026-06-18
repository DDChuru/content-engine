/**
 * Create gradient background for course videos
 */
import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Create static directory
const staticDir = join(__dirname, 'static');
mkdirSync(staticDir, { recursive: true });

// Create gradient background
const width = 1920;
const height = 1080;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Create gradient (purple to blue)
const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, '#667eea');    // Blue-purple
gradient.addColorStop(1, '#764ba2');    // Deep purple

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Save to file
const outputPath = join(staticDir, 'gradient-background.png');
const buffer = canvas.toBuffer('image/png');
writeFileSync(outputPath, buffer);

console.log(`✅ Created gradient background: ${outputPath}`);
