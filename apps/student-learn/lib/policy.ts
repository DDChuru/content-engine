/**
 * The policy documents a registering user consents to.
 *
 * These are RE-EXPORTED from the server copy, `convex/lib/policy.ts`, and are
 * used here only to render the version a user is being shown. They are no longer
 * sent to `registerSelf`: a consent row naming a version the client chose is not
 * evidence of what anyone agreed to, so the mutation writes the constant itself.
 * Two copies of a version string is exactly how a screen and a record drift
 * apart, so there is one, and it lives on the server side.
 */
export {
  TERMS_VERSION,
  PRIVACY_VERSION,
  GUARDIAN_ATTESTATION_STATEMENT,
  GUARDIAN_CONSENT_VERSION,
} from '@/convex/lib/policy';

/**
 * Countries offered to a GUARDIAN at registration, and the labels the account page
 * renders. The list is short on purpose: it exists to pick a data-protection
 * regime (POPIA vs Zimbabwe's DPA), not to profile anyone.
 *
 * A STUDENT no longer answers from this list. Country is the first question in the
 * exam picker, because it decides which boards they are offered, and it comes from
 * the `catalogueCountries` table so a country can be added without a deploy. The
 * two lists answer two questions and are deliberately not merged: which law
 * protects you is not the same question as where you sit your papers.
 */
export const COUNTRIES = [
  { code: 'ZW', label: 'Zimbabwe' },
  { code: 'ZA', label: 'South Africa' },
  { code: 'BW', label: 'Botswana' },
  { code: 'ZM', label: 'Zambia' },
  { code: 'NA', label: 'Namibia' },
  { code: 'MW', label: 'Malawi' },
  { code: 'KE', label: 'Kenya' },
  { code: 'NG', label: 'Nigeria' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'OTHER', label: 'Somewhere else' },
] as const;

/*
 * Exam years used to live here as a bare list of the next three calendar years.
 * A year alone answered none of "which board", "which level" or "which series",
 * so it has been replaced by `lib/exam-catalogue.ts`, which asks all four.
 */
