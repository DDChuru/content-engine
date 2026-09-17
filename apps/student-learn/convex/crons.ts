/**
 * Scheduled work.
 *
 * Only one job so far, and it is a retry rather than the primary path: §11's
 * de-anonymisation notice is delivered immediately, scheduled from
 * `revealCandidate` itself, because "within 24 hours" is a deadline and an hourly
 * sweep that waits for the deadline to pass can only ever be late. This catches
 * a delivery that failed and grants written before the delivery path existed.
 *
 * The other jobs REGISTRATION-AND-ROLES.md §8 lists — claim expiry, auto-close,
 * credit expiry — belong to the marking loop and are not written yet.
 */

import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.hourly(
  'retry unsent de-anonymisation notices',
  { minuteUTC: 7 },
  internal.identity.sweepRevealNotifications,
  {}
);

export default crons;
