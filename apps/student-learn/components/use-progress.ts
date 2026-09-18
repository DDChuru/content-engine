'use client';

import { useEffect, useState } from 'react';
import { progress, subscribeToProgress, type SkillState } from '@/lib/progress';

/**
 * Skill states for a list of topic codes, kept current.
 *
 * Every page used to read `progress` once in a mount effect, which was fine while
 * the answer lived in localStorage and could not change under the page. It can
 * now: a Convex snapshot arrives a beat after sign-in, and a second device writes.
 * So this subscribes.
 *
 * Deliberately starts empty and fills on the client — the server render has no
 * student, and rendering ticks the server could not know about is a hydration
 * mismatch waiting to happen.
 */
export function useSkillStates(codes: string[]): Record<string, SkillState> {
  const key = codes.join('|');
  const [states, setStates] = useState<Record<string, SkillState>>({});

  useEffect(() => {
    const read = () => {
      const next: Record<string, SkillState> = {};
      for (const code of key ? key.split('|') : []) {
        next[code] = progress.getSkillState(code);
      }
      setStates(next);
    };
    read();
    return subscribeToProgress(read);
  }, [key]);

  return states;
}
