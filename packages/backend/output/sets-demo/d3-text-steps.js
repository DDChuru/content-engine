
import * as d3 from 'd3';
import { JSDOM } from 'jsdom';
import sharp from 'sharp';
import fs from 'fs/promises';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const body = d3.select(dom.window.document.body);

const svg = body.append('svg')
  .attr('width', 960)
  .attr('height', 1080)
  .attr('xmlns', 'http://www.w3.org/2000/svg')
  .style('background', '#000000');

// Title
svg.append('text')
  .attr('x', 480)
  .attr('y', 80)
  .attr('text-anchor', 'middle')
  .attr('font-family', 'Poppins, sans-serif')
  .attr('font-size', 48)
  .attr('font-weight', 'bold')
  .attr('fill', '#ffffff')
  .text('Step-by-Step Solution');

// Steps (one by one, clear boxes)
const steps = [
  { y: 150, title: 'Step 1: Set A', content: 'A = {1, 2, 3, 4, 5}', color: '#3b82f6' },
  { y: 280, title: 'Step 2: Set B', content: 'B = {4, 5, 6, 7, 8}', color: '#10b981' },
  { y: 410, title: 'Step 3: What is ∩?', content: '∩ means "AND" or "both"', color: '#ffffff' },
  { y: 540, title: 'Step 4: Find Common', content: 'Which appear in both?', color: '#fbbf24' },
  { y: 670, title: 'Step 5: Answer', content: 'A ∩ B = {4, 5}', color: '#10b981' }
];

steps.forEach((step, i) => {
  // Box background
  svg.append('rect')
    .attr('x', 80)
    .attr('y', step.y)
    .attr('width', 800)
    .attr('height', 100)
    .attr('fill', 'none')
    .attr('stroke', step.color)
    .attr('stroke-width', 3)
    .attr('rx', 10);

  // Step title
  svg.append('text')
    .attr('x', 100)
    .attr('y', step.y + 35)
    .attr('font-family', 'Poppins, sans-serif')
    .attr('font-size', 28)
    .attr('font-weight', 'bold')
    .attr('fill', step.color)
    .text(step.title);

  // Step content
  svg.append('text')
    .attr('x', 100)
    .attr('y', step.y + 70)
    .attr('font-family', 'Inter, sans-serif')
    .attr('font-size', 32)
    .attr('fill', '#ffffff')
    .text(step.content);
});

// Convert to PNG
const svgString = svg.node().outerHTML;
const buffer = await sharp(Buffer.from(svgString)).png().toBuffer();
await fs.writeFile('d3-steps.png', buffer);
console.log('D3 steps saved!');
