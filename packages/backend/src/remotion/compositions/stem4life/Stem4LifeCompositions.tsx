import React from 'react';
import {Composition} from 'remotion';
import {z} from 'zod';
import {IntroA, IntroB, IntroC, Stem4LifeOutro} from './Stem4LifeBookends';
import type {BookendProps, Stem4LifeBookendProps} from './Stem4LifeBookends';
import {FPS, INTRO_FRAMES, OUTRO_FRAMES} from './timing';

const schema = z.object({
  title: z.string().min(1).max(160),
  subtitle: z.string().max(100).optional(),
  accentA: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  accentB: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});
const defaultProps = {title: 'Force, mass & acceleration', subtitle: 'Cambridge A Level · Mechanics'};
const size = {width: 1920, height: 1080, fps: FPS};
const outroSchema = schema.extend({aesthetic: z.enum(['A', 'B', 'C']).optional()});

export const Stem4LifeCompositions: React.FC = () => <>
  <Composition<typeof schema, BookendProps> id="Stem4LifeIntroA" component={IntroA} durationInFrames={INTRO_FRAMES} {...size} schema={schema} defaultProps={defaultProps}/>
  <Composition<typeof schema, BookendProps> id="Stem4LifeIntroB" component={IntroB} durationInFrames={INTRO_FRAMES} {...size} schema={schema} defaultProps={defaultProps}/>
  <Composition<typeof schema, BookendProps> id="Stem4LifeIntroC" component={IntroC} durationInFrames={INTRO_FRAMES} {...size} schema={schema} defaultProps={defaultProps}/>
  <Composition<typeof outroSchema, Stem4LifeBookendProps> id="Stem4LifeOutro" component={Stem4LifeOutro} durationInFrames={OUTRO_FRAMES} {...size}
    schema={outroSchema} defaultProps={{...defaultProps, aesthetic: 'C'}}/>
</>;
