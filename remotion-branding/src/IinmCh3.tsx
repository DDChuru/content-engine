import React from 'react';
import { StillChapter, PlanStep, Box } from './iinm/stillchapter';
import { ChTiming } from './iinm/screencast';
import TIMING from './iinm/ch3-timing.json';
import BOXES from './iinm/ch3-boxes.json';

/** IINM User Guide — Chapter 3: investigate & root cause (Site Manager). */
const PLAN: PlanStep[] = [
  { shot: 'record', ring: 'record' },                     // it routes itself
  { shot: 'investigate', ring: 'investigate', guide: true }, // investigate
  { shot: 'investigate', ring: 'investigate' },           // five whys
  { shot: 'action', ring: 'action' },                     // fix it
  { shot: 'close', ring: 'close' },                       // sign & advance
];

export const IinmCh3: React.FC = () => (
  <StillChapter timing={TIMING as ChTiming} boxes={BOXES as Record<string, Box>} plan={PLAN} chapterNo={3} title="Investigate & find the cause" shotDir="iinm/shots/ch3" />
);
