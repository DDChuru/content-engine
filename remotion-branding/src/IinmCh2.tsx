import React from 'react';
import { StillChapter, PlanStep, Box } from './iinm/stillchapter';
import { ChTiming } from './iinm/screencast';
import TIMING from './iinm/ch2-timing.json';
import BOXES from './iinm/ch2-boxes.json';

/** IINM User Guide — Chapter 2: dangerous occurrence (§24 with no injury). */
const PLAN: PlanStep[] = [
  { shot: 'form', ring: 'form' },                       // not just injuries
  { shot: 'property', ring: 'property' },               // property damaged, no one hurt
  { shot: 'advanced', ring: 'advanced', guide: true },  // open dangerous occurrence
  { shot: 'spillage', ring: 'spillage', s24: true },    // flag a spill → §24
  { shot: 'banner', ring: 'banner', s24: true },        // reportable, no injury
];

export const IinmCh2: React.FC = () => (
  <StillChapter timing={TIMING as ChTiming} boxes={BOXES as Record<string, Box>} plan={PLAN} chapterNo={2} title="When no one is hurt" shotDir="iinm/shots/ch2" />
);
