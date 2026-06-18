import React from 'react';
import { StillChapter, PlanStep, Box } from './iinm/stillchapter';
import { ChTiming } from './iinm/screencast';
import TIMING from './iinm/ch1-timing.json';
import BOXES from './iinm/ch1-boxes.json';

/**
 * IINM User Guide — Chapter 1: "Capture the first report".
 * Per-beat stills from the live /iinm/new flow, ringing the real element each step,
 * ending on the live "Section 24 - LTI" classification.
 */
const PLAN: PlanStep[] = [
  { shot: 'classify', ring: 'classify' },            // Start — pick what happened
  { shot: 'injury', ring: null },                     // Classify → injury detail revealed
  { shot: 'guide', ring: 'guide', guide: true },      // Injury detail + the e-wizer guide
  { shot: 'under14', ring: 'under14' },               // ≤13 days = lost-time injury
  { shot: 'section24', ring: 'section24', s24: true },// 14 days+ → flips to §24
  { shot: 'section24', ring: 'section24', s24: true },// Section 24 named in the form
  { shot: 'log', ring: 'log' },                        // Log report
];

export const IinmCh1: React.FC = () => (
  <StillChapter timing={TIMING as ChTiming} boxes={BOXES as Record<string, Box>} plan={PLAN} chapterNo={1} title="Capture the first report" shotDir="iinm/shots/ch1" />
);
