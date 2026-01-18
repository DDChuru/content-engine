'use client';

import React, { useState, useCallback } from 'react';

interface VennElement {
  id: string;
  value: string | number;
  correctRegion: 'onlyA' | 'onlyB' | 'intersection' | 'outside';
}

interface VennRegion {
  id: 'onlyA' | 'onlyB' | 'intersection' | 'outside';
  label: string;
  elements: VennElement[];
}

interface InteractiveVennDiagramProps {
  setA: {
    label: string;
    color?: string;
  };
  setB: {
    label: string;
    color?: string;
  };
  elements: VennElement[];
  universalSetLabel?: string;
  onComplete?: (isCorrect: boolean, score: number) => void;
  showFeedback?: boolean;
}

export function InteractiveVennDiagram({
  setA,
  setB,
  elements,
  universalSetLabel = 'ξ',
  onComplete,
  showFeedback = true,
}: InteractiveVennDiagramProps) {
  const [regions, setRegions] = useState<Record<string, VennRegion>>({
    onlyA: { id: 'onlyA', label: `Only ${setA.label}`, elements: [] },
    onlyB: { id: 'onlyB', label: `Only ${setB.label}`, elements: [] },
    intersection: { id: 'intersection', label: `${setA.label} ∩ ${setB.label}`, elements: [] },
    outside: { id: 'outside', label: 'Outside both', elements: [] },
  });

  const [unplacedElements, setUnplacedElements] = useState<VennElement[]>(elements);
  const [draggedElement, setDraggedElement] = useState<VennElement | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ element: string; correct: boolean } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: elements.length });

  const colorA = setA.color || '#ef4444';
  const colorB = setB.color || '#22c55e';

  const handleDragStart = (element: VennElement) => {
    setDraggedElement(element);
    setFeedback(null);
  };

  const handleDragEnd = () => {
    setDraggedElement(null);
    setHoveredRegion(null);
  };

  const handleDrop = useCallback((regionId: string) => {
    if (!draggedElement) return;

    const isCorrect = draggedElement.correctRegion === regionId;

    // Add element to region
    setRegions(prev => ({
      ...prev,
      [regionId]: {
        ...prev[regionId],
        elements: [...prev[regionId].elements, { ...draggedElement, placed: true }],
      },
    }));

    // Remove from unplaced
    setUnplacedElements(prev => prev.filter(e => e.id !== draggedElement.id));

    // Update score
    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    }

    // Show feedback
    if (showFeedback) {
      setFeedback({ element: String(draggedElement.value), correct: isCorrect });
      setTimeout(() => setFeedback(null), 1500);
    }

    // Check if complete
    const remainingElements = unplacedElements.filter(e => e.id !== draggedElement.id);
    if (remainingElements.length === 0) {
      setIsComplete(true);
      const finalScore = isCorrect ? score.correct + 1 : score.correct;
      onComplete?.(finalScore === elements.length, finalScore);
    }

    setDraggedElement(null);
    setHoveredRegion(null);
  }, [draggedElement, unplacedElements, score, elements.length, onComplete, showFeedback]);

  const handleReset = () => {
    setRegions({
      onlyA: { id: 'onlyA', label: `Only ${setA.label}`, elements: [] },
      onlyB: { id: 'onlyB', label: `Only ${setB.label}`, elements: [] },
      intersection: { id: 'intersection', label: `${setA.label} ∩ ${setB.label}`, elements: [] },
      outside: { id: 'outside', label: 'Outside both', elements: [] },
    });
    setUnplacedElements(elements);
    setIsComplete(false);
    setScore({ correct: 0, total: elements.length });
    setFeedback(null);
  };

  // SVG dimensions
  const width = 500;
  const height = 350;
  const circleRadius = 100;
  const circleOverlap = 50;
  const centerY = 160;
  const centerAX = width / 2 - circleOverlap;
  const centerBX = width / 2 + circleOverlap;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Place each element in the correct region
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">
            Score: {score.correct}/{score.total}
          </span>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Venn Diagram SVG */}
      <div
        className="relative bg-slate-900 rounded-xl border border-slate-700 overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Universal Set Rectangle */}
          <rect
            x="20"
            y="20"
            width={width - 40}
            height={height - 60}
            fill="none"
            stroke="#475569"
            strokeWidth="2"
            rx="8"
          />
          <text x="35" y="45" fill="#94a3b8" fontSize="16" fontWeight="bold">
            {universalSetLabel}
          </text>

          {/* Outside Region (clickable) */}
          <rect
            x="20"
            y="20"
            width={width - 40}
            height={height - 60}
            fill={hoveredRegion === 'outside' ? 'rgba(100, 116, 139, 0.3)' : 'transparent'}
            className="cursor-pointer"
            onDragOver={(e) => { e.preventDefault(); setHoveredRegion('outside'); }}
            onDragLeave={() => setHoveredRegion(null)}
            onDrop={() => handleDrop('outside')}
          />

          {/* Circle A */}
          <circle
            cx={centerAX}
            cy={centerY}
            r={circleRadius}
            fill={`${colorA}20`}
            stroke={colorA}
            strokeWidth="3"
            className="cursor-pointer"
            onDragOver={(e) => { e.preventDefault(); setHoveredRegion('onlyA'); }}
            onDragLeave={() => setHoveredRegion(null)}
            onDrop={() => handleDrop('onlyA')}
            style={{
              filter: hoveredRegion === 'onlyA' ? 'brightness(1.3)' : 'none',
            }}
          />

          {/* Circle B */}
          <circle
            cx={centerBX}
            cy={centerY}
            r={circleRadius}
            fill={`${colorB}20`}
            stroke={colorB}
            strokeWidth="3"
            className="cursor-pointer"
            onDragOver={(e) => { e.preventDefault(); setHoveredRegion('onlyB'); }}
            onDragLeave={() => setHoveredRegion(null)}
            onDrop={() => handleDrop('onlyB')}
            style={{
              filter: hoveredRegion === 'onlyB' ? 'brightness(1.3)' : 'none',
            }}
          />

          {/* Intersection Region (overlay) */}
          <clipPath id="clipA">
            <circle cx={centerAX} cy={centerY} r={circleRadius} />
          </clipPath>
          <circle
            cx={centerBX}
            cy={centerY}
            r={circleRadius}
            clipPath="url(#clipA)"
            fill={hoveredRegion === 'intersection' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.2)'}
            className="cursor-pointer"
            onDragOver={(e) => { e.preventDefault(); setHoveredRegion('intersection'); }}
            onDragLeave={() => setHoveredRegion(null)}
            onDrop={() => handleDrop('intersection')}
          />

          {/* Set Labels */}
          <text x={centerAX - 60} y={centerY - 70} fill={colorA} fontSize="24" fontWeight="bold">
            {setA.label}
          </text>
          <text x={centerBX + 40} y={centerY - 70} fill={colorB} fontSize="24" fontWeight="bold">
            {setB.label}
          </text>

          {/* Placed Elements */}
          {Object.entries(regions).map(([regionId, region]) => {
            let baseX = 0, baseY = centerY;

            switch (regionId) {
              case 'onlyA':
                baseX = centerAX - 50;
                break;
              case 'onlyB':
                baseX = centerBX + 50;
                break;
              case 'intersection':
                baseX = width / 2;
                break;
              case 'outside':
                baseX = 80;
                baseY = height - 60;
                break;
            }

            return region.elements.map((el, i) => {
              const isCorrect = el.correctRegion === regionId;
              const offsetX = regionId === 'outside' ? i * 40 : (i % 3 - 1) * 30;
              const offsetY = regionId === 'outside' ? 0 : Math.floor(i / 3) * 25;

              return (
                <g key={el.id}>
                  <circle
                    cx={baseX + offsetX}
                    cy={baseY + offsetY}
                    r="16"
                    fill={isCorrect ? '#22c55e' : '#ef4444'}
                    opacity="0.9"
                  />
                  <text
                    x={baseX + offsetX}
                    y={baseY + offsetY + 5}
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {el.value}
                  </text>
                </g>
              );
            });
          })}
        </svg>

        {/* Feedback Toast */}
        {feedback && (
          <div
            className={`absolute top-4 right-4 px-4 py-2 rounded-lg text-white font-medium transition-all ${
              feedback.correct ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {feedback.correct ? '✓ Correct!' : '✗ Try again'}
          </div>
        )}
      </div>

      {/* Draggable Elements */}
      <div className="mt-6">
        <p className="text-sm text-slate-400 mb-3">
          Drag elements to the correct region:
        </p>
        <div className="flex flex-wrap gap-3 min-h-[50px] p-4 bg-slate-800 rounded-xl border border-slate-700">
          {unplacedElements.length === 0 ? (
            <span className="text-slate-500 italic">All elements placed!</span>
          ) : (
            unplacedElements.map((element) => (
              <div
                key={element.id}
                draggable
                onDragStart={() => handleDragStart(element)}
                onDragEnd={handleDragEnd}
                className={`
                  px-4 py-2 rounded-full font-bold text-white cursor-grab active:cursor-grabbing
                  bg-gradient-to-r from-indigo-500 to-purple-500
                  hover:from-indigo-400 hover:to-purple-400
                  transform hover:scale-105 transition-all
                  shadow-lg hover:shadow-indigo-500/25
                  select-none
                `}
              >
                {element.value}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Completion Message */}
      {isComplete && (
        <div className={`mt-6 p-4 rounded-xl text-center ${
          score.correct === score.total
            ? 'bg-green-500/20 border border-green-500/50'
            : 'bg-amber-500/20 border border-amber-500/50'
        }`}>
          <p className="text-lg font-semibold text-white">
            {score.correct === score.total
              ? '🎉 Perfect! All elements placed correctly!'
              : `Good effort! You got ${score.correct} out of ${score.total} correct.`}
          </p>
          <button
            onClick={handleReset}
            className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span>Correct</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span>Incorrect</span>
        </div>
      </div>
    </div>
  );
}

export default InteractiveVennDiagram;
