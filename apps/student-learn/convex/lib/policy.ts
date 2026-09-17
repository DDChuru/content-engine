/**
 * Policy versions and consent wording — SERVER CONSTANTS.
 *
 * These used to arrive as `registerSelf({ termsVersion, privacyVersion })`
 * arguments, which meant a consent row could name any string the client chose,
 * including `""`. A consent record naming a policy version the client invented
 * is not evidence of anything: the whole point of versioning consent is that the
 * server can say "this person was shown THIS document". So the versions live
 * here, the mutation writes them, and the client's only job is to RENDER them
 * (`lib/policy.ts` re-exports these so there is exactly one source).
 *
 * Bump on re-wording. Never edit an existing `consents` row.
 */

export const TERMS_VERSION = 'terms-2026-09-16';
export const PRIVACY_VERSION = 'privacy-2026-09-16';

/** The version of the wording a guardian attests to at redemption. */
export const GUARDIAN_CONSENT_VERSION = 'guardian-consent-2026-09-17';

/**
 * What the guardian is asked to affirm, verbatim. Stored on the link and on the
 * consent row, because "they ticked a box" is worthless evidence unless the
 * record says which sentence the box was next to.
 */
export const GUARDIAN_ATTESTATION_STATEMENT =
  'I am the parent or legal guardian of this student, I am over 18, and I consent ' +
  'to their work being processed for marking. I understand this account can see ' +
  'the work they submit and the marks that come back.';

/**
 * Countries we will accept as the controlling privacy regime. Not cosmetic:
 * POPIA and the Zimbabwe DPA differ on consent age and on breach notification,
 * so an unvalidated free-text country leaves "which law applies" unanswerable.
 * Mirrors `lib/policy.ts` COUNTRIES; 'OTHER' is an explicit, recorded answer
 * rather than an absent one.
 */
export const ALLOWED_COUNTRY_CODES = [
  'ZW',
  'ZA',
  'BW',
  'ZM',
  'NA',
  'MW',
  'KE',
  'NG',
  'GB',
  'OTHER',
] as const;

export function isAllowedCountry(code: string | undefined): boolean {
  return (
    typeof code === 'string' &&
    (ALLOWED_COUNTRY_CODES as readonly string[]).includes(code)
  );
}

/**
 * §11 — suppression of the de-anonymisation notice is limited to these two
 * triggers. The plan says "unless a safeguarding or legal hold suppresses it";
 * the first implementation allowed suppression for every trigger, including
 * `payment_dispute`, which turns the notice requirement into an option.
 */
export const SUPPRESSIBLE_REVEAL_TRIGGERS = [
  'safeguarding_flag',
  'legal_request',
] as const;
