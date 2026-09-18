/**
 * Where the videos actually live.
 *
 * They are not in the repo. `public/videos/*.mp4` is 682 MB and gitignored, so a
 * deployed build shipped thirty-seven "video coming soon" placeholders — the one
 * thing the product is for, missing everywhere except this machine. The renders
 * are on Bunny Stream now, and a topic carries a `videoId` (the Bunny GUID) in
 * `public/notes/index.json`.
 *
 * The delivery is HLS, not a fixed MP4, and that is the whole point rather than a
 * detail: these students are on Zimbabwean and South African mobile data, which is
 * among the most expensive on earth and rarely steady. An adaptive ladder drops a
 * struggling connection to 240p or 360p and keeps playing; a hardcoded 720p file
 * stalls and spends the student's money doing it. The MP4 renditions below exist
 * only as a fallback for when HLS cannot start at all.
 */

/** The Bunny pull-zone host. Public by design — it is in every video URL. */
export const CDN_HOST =
  process.env.NEXT_PUBLIC_BUNNY_CDN_HOST || 'vz-c77378c6-e3c.b-cdn.net';

const base = (guid: string) => `https://${CDN_HOST}/${guid}`;

/** The adaptive master playlist: every rendition, the player picks. */
export function hlsUrl(guid: string): string {
  return `${base(guid)}/playlist.m3u8`;
}

/**
 * A single progressive rendition. Only for the fallback path, and deliberately
 * 360p rather than 720p: if we have reached this branch we already know the
 * adaptive path failed, so the cheap, always-playable one is the right guess.
 */
export function mp4Url(guid: string, height: 240 | 360 | 480 | 720 | 1080 = 360): string {
  return `${base(guid)}/play_${height}p.mp4`;
}

/** Bunny's generated poster. Free, and it stops the player being a black hole. */
export function posterUrl(guid: string): string {
  return `${base(guid)}/thumbnail.jpg`;
}
