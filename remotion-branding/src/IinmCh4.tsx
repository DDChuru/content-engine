import React from 'react';
import { StillChapter, PlanStep, Box } from './iinm/stillchapter';
import { ChTiming } from './iinm/screencast';
import TIMING from './iinm/ch4-timing.json';
import BOXES from './iinm/ch4-boxes.json';

/** IINM User Guide — Chapter 4: SHEQ verify, close & generate Annexure 1. */
const PLAN: PlanStep[] = [
  { shot: 'review', ring: 'review' },                  // SHEQ reviews
  { shot: 'gate', ring: 'gate', guide: true },         // the verification gate
  { shot: 'close', ring: 'close' },                    // close it
  { shot: 'annexure1', ring: null, s24: true },        // generate Annexure 1
  { shot: 'annexure2', ring: null, s24: true },        // ready to send
];

export const IinmCh4: React.FC = () => (
  <StillChapter timing={TIMING as ChTiming} boxes={BOXES as Record<string, Box>} plan={PLAN} chapterNo={4} title="Verify, close & prove it" shotDir="iinm/shots/ch4" />
);
