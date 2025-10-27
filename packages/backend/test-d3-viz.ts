/**
 * Test D3 Data Visualization Engine
 *
 * Generate test scenes to validate the custom viz engine
 */

import { D3VizEngine, ComparisonData, NetworkData } from './src/services/d3-viz-engine.js';
import path from 'path';
import fs from 'fs/promises';

async function main() {
  console.log('🎨 Testing D3 Data Visualization Engine\n');

  const outputDir = 'output/d3-viz';
  await fs.mkdir(outputDir, { recursive: true });

  // =========================================================================
  // Scene 1: Context Window Comparison (Your handwritten note example)
  // =========================================================================

  console.log('📊 Scene 1: Context Window Comparison');

  const contextWindowData: ComparisonData = {
    type: 'comparison',
    title: 'AI Context Windows & Memory',
    groups: [
      {
        name: 'Small Models',
        items: ['nano', 'mini', 'flash'],
        metrics: {
          tokens: { min: 2000, max: 4000 },
          words: { min: 1500, max: 3000 }
        },
        visual: {
          type: 'molecule',  // Connected nodes like molecule
          style: 'sketchy'
        }
      },
      {
        name: 'Large Models',
        items: ['GPT-4.1', 'Gemini 2.5 Pro'],
        metrics: {
          tokens: 1000000,
          words: 750000
        },
        visual: {
          type: 'box',
          style: 'sketchy'
        }
      }
    ],
    relationships: [
      {
        from: 'Small Models',
        to: 'Context Window',
        label: 'Short term\nmemory',
        style: 'arrow'
      }
    ],
    annotations: [
      {
        content: 'π = 3.14159265358979...',
        type: 'highlight',
        style: 'yellow'
      },
      {
        content: '2000-4000 tokens',
        type: 'note'
      },
      {
        content: '~1500-3000 words',
        type: 'note'
      }
    ]
  };

  const engine1 = new D3VizEngine({
    width: 1920,
    height: 1080,
    style: {
      aesthetic: 'chalk',
      backgroundColor: '#000000',
      colors: {
        primary: '#ffffff',
        secondary: '#1e88e5',
        accent: '#4caf50',
        text: '#ffffff',
        highlight: '#ffeb3b'
      },
      fonts: {
        primary: 'Arial, sans-serif',
        handwriting: 'Caveat, cursive'
      },
      strokeWidth: 3,
      roughness: 1.5
    },
    animation: {
      enabled: true,
      duration: 3,
      fps: 30,
      effects: ['draw']
    }
  });

  const output1 = await engine1.visualize(contextWindowData);
  const video1Path = path.join(outputDir, 'context-window-comparison.mp4');
  await engine1.framesToVideo(output1.frames, video1Path);

  console.log(`✅ Generated: ${video1Path}`);
  console.log(`   Frames: ${output1.frames.length}`);
  console.log(`   Duration: ${output1.duration}s\n`);

  // =========================================================================
  // Scene 2: Network Graph (Concept Map)
  // =========================================================================

  console.log('📊 Scene 2: Network Graph - AI Concepts');

  const networkData: NetworkData = {
    type: 'network',
    nodes: [
      { id: 'ai', label: 'AI', size: 40 },
      { id: 'ml', label: 'Machine\nLearning', size: 35 },
      { id: 'dl', label: 'Deep\nLearning', size: 35 },
      { id: 'nlp', label: 'NLP', size: 30 },
      { id: 'cv', label: 'Computer\nVision', size: 30 },
      { id: 'rl', label: 'Reinforcement\nLearning', size: 30 },
      { id: 'llm', label: 'LLMs', size: 35 },
      { id: 'gpt', label: 'GPT', size: 25 },
      { id: 'bert', label: 'BERT', size: 25 }
    ],
    links: [
      { source: 'ai', target: 'ml' },
      { source: 'ml', target: 'dl' },
      { source: 'ml', target: 'rl' },
      { source: 'dl', target: 'nlp' },
      { source: 'dl', target: 'cv' },
      { source: 'nlp', target: 'llm' },
      { source: 'llm', target: 'gpt' },
      { source: 'llm', target: 'bert' }
    ]
  };

  const engine2 = new D3VizEngine({
    width: 1920,
    height: 1080,
    style: {
      aesthetic: 'hand-drawn',
      backgroundColor: '#000000',
      colors: {
        primary: '#ffffff',
        secondary: '#ff5722',
        accent: '#00bcd4',
        text: '#ffffff',
        highlight: '#ffc107'
      },
      fonts: {
        primary: 'Arial, sans-serif',
        handwriting: 'Caveat, cursive'
      },
      strokeWidth: 2,
      roughness: 2
    },
    animation: {
      enabled: true,
      duration: 4,
      fps: 30,
      effects: ['draw', 'fade']
    }
  });

  const output2 = await engine2.visualize(networkData);
  const video2Path = path.join(outputDir, 'ai-concept-network.mp4');
  await engine2.framesToVideo(output2.frames, video2Path);

  console.log(`✅ Generated: ${video2Path}`);
  console.log(`   Frames: ${output2.frames.length}`);
  console.log(`   Duration: ${output2.duration}s\n`);

  // =========================================================================
  // Scene 3: Token Comparison (Simple Comparison)
  // =========================================================================

  console.log('📊 Scene 3: Token Capacity Comparison');

  const tokenComparisonData: ComparisonData = {
    type: 'comparison',
    title: 'Token Capacity Across Models',
    groups: [
      {
        name: 'GPT-3.5',
        items: ['4K context', 'Fast', 'Cost effective'],
        metrics: { tokens: 4000 },
        visual: { type: 'box', style: 'sketchy' }
      },
      {
        name: 'GPT-4',
        items: ['8K-32K context', 'Advanced', 'Higher cost'],
        metrics: { tokens: 32000 },
        visual: { type: 'box', style: 'sketchy' }
      },
      {
        name: 'Claude 3',
        items: ['200K context', 'Long docs', 'Premium'],
        metrics: { tokens: 200000 },
        visual: { type: 'box', style: 'sketchy' }
      },
      {
        name: 'Gemini 2.5',
        items: ['1M context', 'Massive', 'Enterprise'],
        metrics: { tokens: 1000000 },
        visual: { type: 'box', style: 'sketchy' }
      }
    ],
    annotations: [
      {
        content: 'Context window = short-term memory',
        type: 'note'
      },
      {
        content: '1000 tokens ≈ 750 words',
        type: 'highlight'
      }
    ]
  };

  const engine3 = new D3VizEngine({
    width: 1920,
    height: 1080,
    style: {
      aesthetic: 'sketch-note',
      backgroundColor: '#1a1a1a',
      colors: {
        primary: '#eceff1',
        secondary: '#42a5f5',
        accent: '#66bb6a',
        text: '#eceff1',
        highlight: '#ffca28'
      },
      fonts: {
        primary: 'Arial, sans-serif',
        handwriting: 'Caveat, cursive'
      },
      strokeWidth: 2.5,
      roughness: 1.2
    },
    animation: {
      enabled: true,
      duration: 3.5,
      fps: 30,
      effects: ['draw']
    }
  });

  const output3 = await engine3.visualize(tokenComparisonData);
  const video3Path = path.join(outputDir, 'token-comparison.mp4');
  await engine3.framesToVideo(output3.frames, video3Path);

  console.log(`✅ Generated: ${video3Path}`);
  console.log(`   Frames: ${output3.frames.length}`);
  console.log(`   Duration: ${output3.duration}s\n`);

  // =========================================================================
  // Summary
  // =========================================================================

  console.log('🎉 Test Complete!\n');
  console.log('Generated Videos:');
  console.log(`  1. ${video1Path}`);
  console.log(`  2. ${video2Path}`);
  console.log(`  3. ${video3Path}`);
  console.log('\nReview the outputs to validate the D3 visualization engine!');
}

main().catch(console.error);
