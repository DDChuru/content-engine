'use client';

import React, { useState } from 'react';

interface AgentMemory {
  version: number;
  spatialRules: string[];
  pedagogyRules: string[];
  successfulPatterns: number;
  failures: number;
  totalKnowledge: number;
}

interface ValidationResult {
  success: boolean;
  collisions: number;
  clarityScore: number;
  issues?: string[];
  memoryUpdated: boolean;
}

export function TrainingLab() {
  const [agentId] = useState('sets');
  const [problem, setProblem] = useState({
    operation: 'intersection',
    setA: [1, 2, 3, 4, 5],
    setB: [4, 5, 6, 7, 8],
    question: 'Find A ∩ B'
  });

  const [memory, setMemory] = useState<AgentMemory | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [newRule, setNewRule] = useState('');
  const [ruleType, setRuleType] = useState<'spatial' | 'pedagogy'>('spatial');

  // Fetch current memory
  const fetchMemory = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/sets-agent/memory`);
      const data = await res.json();
      setMemory(data.memory);
    } catch (error) {
      console.error('Failed to fetch memory:', error);
    }
  };

  // Reset agent
  const handleReset = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/api/sets-agent/reset`, {
        method: 'POST'
      });
      const data = await res.json();
      setMemory(data.memory);
      setResult(null);
    } catch (error) {
      console.error('Failed to reset:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate visualization
  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/api/sets-agent/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(problem)
      });
      const data = await res.json();
      setResult(data.result);
      await fetchMemory();
    } catch (error) {
      console.error('Failed to generate:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add rule
  const handleAddRule = async () => {
    if (!newRule.trim()) return;

    try {
      setLoading(true);
      const endpoint = ruleType === 'spatial' ? 'spatial' : 'pedagogy';
      const res = await fetch(`http://localhost:3001/api/sets-agent/teach/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rule: newRule })
      });
      const data = await res.json();
      setMemory(data.memory);
      setNewRule('');
    } catch (error) {
      console.error('Failed to add rule:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load memory on mount
  React.useEffect(() => {
    fetchMemory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🧪 AGENT TRAINING LAB</h1>
          <p className="text-gray-400">Train your AI agent to create perfect educational visualizations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Agent Configuration */}
          <div className="space-y-6">
            {/* Agent Status Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Agent: Sets Tutor</h2>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">LLM:</span>
                  <span className="text-green-400">✓ Claude Sonnet 4.5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Knowledge:</span>
                  <span className="text-green-400">✓ Set theory (PhD level)</span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-2">Tools Available:</h3>
                <div className="space-y-1 text-sm">
                  <div className="text-green-400">✓ Manim (Python animation)</div>
                  <div className="text-green-400">✓ Collision detection</div>
                  <div className="text-green-400">✓ Text positioning</div>
                </div>
              </div>

              {memory && (
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Memory/Context:</h3>
                    <span className="text-xs bg-blue-500 px-2 py-1 rounded">v{memory.version}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className={memory.spatialRules.length > 0 ? "text-green-400" : "text-red-400"}>
                      {memory.spatialRules.length > 0 ? "✓" : "❌"} Spatial rules: {memory.spatialRules.length}
                    </div>
                    <div className={memory.pedagogyRules.length > 0 ? "text-green-400" : "text-red-400"}>
                      {memory.pedagogyRules.length > 0 ? "✓" : "❌"} Pedagogy rules: {memory.pedagogyRules.length}
                    </div>
                    <div className={memory.successfulPatterns > 0 ? "text-green-400" : "text-red-400"}>
                      {memory.successfulPatterns > 0 ? "✓" : "❌"} Successful patterns: {memory.successfulPatterns}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleReset}
                disabled={loading}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 px-4 rounded transition"
              >
                Reset Agent Memory
              </button>
            </div>

            {/* Problem Input */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Test Problem</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Operation</label>
                  <select
                    value={problem.operation}
                    onChange={(e) => setProblem({...problem, operation: e.target.value as any})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  >
                    <option value="intersection">Intersection (∩)</option>
                    <option value="union">Union (∪)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Set A</label>
                  <input
                    type="text"
                    value={problem.setA.join(', ')}
                    onChange={(e) => setProblem({
                      ...problem,
                      setA: e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
                    })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    placeholder="1, 2, 3, 4, 5"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Set B</label>
                  <input
                    type="text"
                    value={problem.setB.join(', ')}
                    onChange={(e) => setProblem({
                      ...problem,
                      setB: e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
                    })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    placeholder="4, 5, 6, 7, 8"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-4 rounded font-semibold transition text-lg"
                >
                  {loading ? '🔄 Generating...' : '🎨 Generate Visualization'}
                </button>
              </div>
            </div>

            {/* Teaching Interface */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Teaching Mode</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Rule Type</label>
                  <select
                    value={ruleType}
                    onChange={(e) => setRuleType(e.target.value as any)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  >
                    <option value="spatial">Spatial (positioning, layout)</option>
                    <option value="pedagogy">Pedagogy (explanation style)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">New Rule</label>
                  <textarea
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 h-24"
                    placeholder="e.g., Never use arrows to intersection - causes collisions"
                  />
                </div>

                <button
                  onClick={handleAddRule}
                  disabled={loading || !newRule.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded transition"
                >
                  ➕ Add Rule to Memory
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="space-y-6">
            {/* Validation Results */}
            {result && (
              <div className={`rounded-lg p-6 border-2 ${
                result.success
                  ? 'bg-green-900/20 border-green-500'
                  : 'bg-red-900/20 border-red-500'
              }`}>
                <h2 className="text-2xl font-bold mb-4">
                  {result.success ? '✅ Validation Passed' : '❌ Validation Failed'}
                </h2>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Collisions:</span>
                    <span className={result.collisions === 0 ? 'text-green-400' : 'text-red-400'}>
                      {result.collisions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Clarity Score:</span>
                    <span className={result.clarityScore >= 8 ? 'text-green-400' : result.clarityScore >= 6 ? 'text-yellow-400' : 'text-red-400'}>
                      {result.clarityScore}/10
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Usability for 13-year-olds:</span>
                    <span className={result.success ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                      {result.success ? 'EXCELLENT' : 'FAIL'}
                    </span>
                  </div>
                </div>

                {result.issues && result.issues.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h3 className="font-semibold mb-2">Issues Detected:</h3>
                    <ul className="space-y-1 text-sm">
                      {result.issues.map((issue, i) => (
                        <li key={i} className="text-red-400">• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.memoryUpdated && (
                  <div className="mt-4 text-sm text-blue-400">
                    💾 Memory updated with {result.success ? 'successful' : 'failed'} pattern
                  </div>
                )}
              </div>
            )}

            {/* Memory Visualization */}
            {memory && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Agent Memory (JSON)</h2>
                <pre className="bg-gray-900 p-4 rounded text-xs overflow-auto max-h-96">
                  {JSON.stringify(memory, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
