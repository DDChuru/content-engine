import React, { useLayoutEffect, useRef, useState } from 'react';
import { AbsoluteFill, Artifact, Composition, continueRender, delayRender, registerRoot, useCurrentFrame } from 'remotion';
import { MechanicsDerivedUnits, getMechanicsDerivedUnitsDuration } from '../remotion/compositions/MechanicsDerivedUnits';
import { MechanicsTypesOfForces, getMechanicsTypesOfForcesDuration } from '../remotion/compositions/MechanicsTypesOfForces';

const Audit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const root = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender('Measure gravity still'));
  const [measurement, setMeasurement] = useState('');
  useLayoutEffect(() => {
    let request = requestAnimationFrame(() => { request = requestAnimationFrame(() => {
      const element = root.current!;
      const visible = (el: Element) => {
        for (let node: Element | null = el; node; node = node.parentElement) {
          const css = getComputedStyle(node);
          if (css.display === 'none' || css.visibility === 'hidden' || Number(css.opacity) < 0.01) return false;
        }
        return el.getBoundingClientRect().width > 0;
      };
      const textNodes: { text: string; bounds: DOMRect }[] = [];
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.textContent?.trim() || !node.parentElement || !visible(node.parentElement)) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const bounds of Array.from(range.getClientRects())) {
          if (bounds.width > 0 && bounds.height > 0) textNodes.push({ text: node.textContent.trim(), bounds });
        }
      }
      const collisions: string[][] = [];
      textNodes.forEach((a, index) => textNodes.slice(index + 1).forEach((b) => {
        const dx = Math.min(a.bounds.right, b.bounds.right) - Math.max(a.bounds.left, b.bounds.left);
        const dy = Math.min(a.bounds.bottom, b.bounds.bottom) - Math.max(a.bounds.top, b.bounds.top);
        if (dx > 2 && dy > 2) collisions.push([a.text, b.text]);
      }));
      const bounds = element.getBoundingClientRect();
      const query = (selector: string) => Array.from(element.querySelectorAll(selector)).filter(visible);
      const obstacleCollisions: string[][] = [];
      for (const obstacle of query('[data-gravity-obstacle]')) {
        const b = obstacle.getBoundingClientRect();
        for (const a of textNodes) {
          const dx = Math.min(a.bounds.right, b.right) - Math.max(a.bounds.left, b.left);
          const dy = Math.min(a.bounds.bottom, b.bottom) - Math.max(a.bounds.top, b.top);
          if (dx > 1 && dy > 1) obstacleCollisions.push([a.text, obstacle.getAttribute('data-gravity-obstacle')!]);
        }
      }
      setMeasurement(JSON.stringify({
        frame, text: textNodes.map((node) => node.text), collisions, obstacleCollisions,
        overflow: textNodes.filter(({ bounds: b }) => b.left < bounds.left - 2 || b.right > bounds.right + 2 || b.top < bounds.top - 2 || b.bottom > bounds.bottom + 2).map((node) => node.text),
        diagrams: query('[data-gravity-diagram]').map((el) => el.getAttribute('data-gravity-diagram')),
        formulas: query('[data-gravity-formula]').map((el) => el.textContent),
        working: query('[data-gravity-working]').map((el) => el.textContent),
        rings: query('[data-figure-ring]').map((el) => {
          const ring = el.getBoundingClientRect();
          const target = el.parentElement!.getBoundingClientRect();
          return { id: el.getAttribute('data-figure-ring'), cue: Number(el.getAttribute('data-cue')), progress: Number(el.getAttribute('data-progress')),
            encloses: ring.left < target.left && ring.right > target.right && ring.top < target.top && ring.bottom > target.bottom };
        }),
      }));
      continueRender(handle);
    }); });
    return () => cancelAnimationFrame(request);
  }, [frame, handle]);
  return <AbsoluteFill ref={root}>{children}{measurement && <Artifact filename="verify-gravity-layout.json" content={measurement} />}</AbsoluteFill>;
};

const Derived = () => <Audit><MechanicsDerivedUnits audioEnabled={false} /></Audit>;
const Forces = () => <Audit><MechanicsTypesOfForces audioEnabled={false} /></Audit>;
registerRoot(() => <>
  <Composition id="MechanicsDerivedUnits" component={Derived} width={1920} height={1080} fps={30} durationInFrames={getMechanicsDerivedUnitsDuration(30)} />
  <Composition id="MechanicsTypesOfForces" component={Forces} width={1920} height={1080} fps={30} durationInFrames={getMechanicsTypesOfForcesDuration(30)} />
</>);
