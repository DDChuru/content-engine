import React from 'react';
import { StillChapter, PlanStep, Box } from './iinm/stillchapter';
import { ChTiming } from './iinm/screencast';
import TIMING from './iinm/ch5-timing.json';
import BOXES from './iinm/ch5-boxes.json';

/** IINM User Guide — Chapter 5: oversight + meet your in-app e-wizer guide. */
const PLAN: PlanStep[] = [
  { shot: 'register', ring: null },                       // the whole picture
  { shot: 'register', ring: 'tiles' },                    // at a glance
  { shot: 'guide', ring: 'guidepanel', guide: true },     // meet your guide
  { shot: 'register', ring: null },                       // the e-wizer way
];

export const IinmCh5: React.FC = () => (
  <StillChapter timing={TIMING as ChTiming} boxes={BOXES as Record<string, Box>} plan={PLAN} chapterNo={5} title="Oversight, and your guide" shotDir="iinm/shots/ch5" />
);
