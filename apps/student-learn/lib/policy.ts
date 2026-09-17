/**
 * The policy documents a registering user consents to.
 *
 * `registerSelf` writes one `consents` row per version string, and consent is
 * versioned by document because a re-worded privacy policy needs re-consent
 * (REGISTRATION-AND-ROLES.md §5). Bump these when the wording changes — never
 * edit an old row.
 */
export const TERMS_VERSION = 'terms-2026-09-16';
export const PRIVACY_VERSION = 'privacy-2026-09-16';

/**
 * Countries offered at registration. The list is short on purpose: it exists to
 * pick a data-protection regime (POPIA vs Zimbabwe's DPA), not to profile anyone.
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
