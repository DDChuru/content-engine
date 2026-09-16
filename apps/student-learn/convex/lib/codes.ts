/**
 * Candidate / teacher / guardian-link code generation (PLAN §4).
 *
 * The rule that matters: NOTHING in a code may be derived from the student.
 * Not a hash of the user id, not a counter, not a date, not a timestamp mixed
 * into the entropy. A code carries zero bits about its owner — its ONLY meaning
 * is the row it points at, and that row is server-side.
 *
 * Alphabet: Crockford base32 minus I, L, O, U.
 *   Crockford already excludes I, L, O, U from its encoding alphabet
 *   (0123456789ABCDEFGHJKMNPQRSTVWXYZ) — I/L/O are confusable with 1/1/0, and U
 *   is dropped to avoid accidental obscenities. That is exactly the set the plan
 *   asks for, so the alphabet below IS Crockford's, verbatim, 32 symbols.
 *
 * Entropy: `crypto.getRandomValues` (available in the Convex V8 runtime). Rejection
 * sampling on the byte, so the distribution over 32 symbols is uniform — `% 32` on
 * a 0-255 byte happens to be unbiased for 32, but the rejection loop is kept so the
 * function stays correct if the alphabet is ever changed.
 *
 * Collision maths for `C-XXXX-XXXX`: 32^8 = 1.1e12. At 100k submissions the
 * birthday probability of ANY collision is ~4e-3, and the per-insert retry loop
 * plus a uniqueness check against `by_candidate_code` makes it a non-event.
 * `T-XXXX` is only 32^4 = 1.05e6, which is fine for a few hundred teachers with
 * the same retry loop, and is short because a student has to read it aloud.
 */

/** Crockford base32. No I, L, O, U. */
export const CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

if (CODE_ALPHABET.length !== 32) {
  throw new Error('Code alphabet must be exactly 32 symbols.');
}

/** Uniform random symbols from the alphabet, CSPRNG, rejection-sampled. */
export function randomSymbols(count: number): string {
  const limit = Math.floor(256 / CODE_ALPHABET.length) * CODE_ALPHABET.length;
  let out = '';
  const buf = new Uint8Array(count * 2);
  while (out.length < count) {
    crypto.getRandomValues(buf);
    for (let i = 0; i < buf.length && out.length < count; i++) {
      if (buf[i] < limit) out += CODE_ALPHABET[buf[i] % CODE_ALPHABET.length];
    }
  }
  return out;
}

/** `C-XXXX-XXXX` — per submission, never reused. */
export function makeCandidateCode(): string {
  const s = randomSymbols(8);
  return `C-${s.slice(0, 4)}-${s.slice(4)}`;
}

/** `T-XXXX` — stable per teacher, so quality flags mean something (§4). */
export function makeTeacherCode(): string {
  return `T-${randomSymbols(4)}`;
}

/** `G-XXXX-XXXX` — a guardian-link invite the student reads out. Single use. */
export function makeGuardianLinkCode(): string {
  const s = randomSymbols(8);
  return `G-${s.slice(0, 4)}-${s.slice(4)}`;
}

/**
 * Normalise a human-typed code: Crockford's confusion mapping (I/L→1, O→0),
 * uppercase, strip everything else, then re-hyphenate. Lets a student type
 * "c l4k 9o2r" and still redeem. Applied ONLY on lookup, never on generation.
 */
export function normaliseCode(input: string): string {
  const cleaned = input
    .toUpperCase()
    .replace(/[IL]/g, '1')
    .replace(/O/g, '0')
    .replace(/[^0-9A-Z]/g, '');
  if (!cleaned) return '';
  const prefix = cleaned[0];
  const body = cleaned.slice(1);
  if (prefix === 'T') return `T-${body.slice(0, 4)}`;
  return `${prefix}-${body.slice(0, 4)}-${body.slice(4, 8)}`;
}
