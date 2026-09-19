'use client';

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { hlsUrl, mp4Url, posterUrl } from '@/lib/video';
import { track } from '@/lib/analytics';

interface Props {
  /** Bunny Stream GUID. */
  videoId: string;
  /** For the accessible name — the topic title, not "video". */
  title: string;
}

/**
 * The lesson player.
 *
 * Three rules it exists to keep:
 *
 * 1. ADAPTIVE. Safari and iOS play an `.m3u8` natively, so there we set `src` and
 *    the OS does the switching. Chrome and Firefox do not, so hls.js is loaded —
 *    `import()`ed, so it is a chunk only a student who actually pressed play ever
 *    downloads, never one who is reading the syllabus map.
 * 2. NOTHING IS FETCHED UNTIL ASKED. `preload="none"`, no autoplay, no `src` and
 *    no hls.js until the student presses our own play button. Until then the page
 *    has cost one poster JPEG. On metered data that is the difference between a
 *    page costing a cent and costing a meal, so the explicit button is the
 *    feature, not a limitation of it.
 * 3. IT FAILS SOFT. Anything that goes wrong drops to the progressive MP4, and if
 *    that dies too the player replaces itself with one honest line. The notes and
 *    the interactive artifact below are the rest of the lesson and must never be
 *    taken down by a codec.
 */
function Player({ videoId, title }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  // 'hls' → adaptive; 'mp4' → progressive fallback; 'dead' → we give up honestly.
  const [mode, setMode] = useState<'hls' | 'mp4' | 'dead'>('hls');
  const [started, setStarted] = useState(false);
  // One start per mount. `playing` also fires after every pause and every seek,
  // and a play-through rate computed against those is meaningless.
  const startReported = useRef(false);
  const trackStart = (transport: string) => {
    if (startReported.current) return;
    startReported.current = true;
    track('video_start', { transport });
  };

  useEffect(() => {
    const video = ref.current;
    if (!video || !started || mode !== 'hls') return;

    // iOS Safari: no MediaSource, but the OS plays HLS natively and adaptively,
    // so it needs no player at all. The MediaSource test has to come FIRST and
    // `canPlayType` second: desktop Chrome answers "maybe" to the HLS MIME type
    // and then fails with MEDIA_ERR_SRC_NOT_SUPPORTED, which is exactly the trap
    // this ordering exists to avoid.
    if (!('MediaSource' in window) && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl(videoId);
      void video.play().catch(() => {});
      return;
    }

    let cancelled = false;
    let instance: { destroy: () => void } | null = null;

    import('hls.js/light')
      .then(({ default: Hls }) => {
        if (cancelled || !ref.current) return;
        if (!Hls.isSupported()) {
          setMode('mp4');
          return;
        }
        const hls = new Hls({ enableWorker: true });
        instance = hls;
        hls.on(Hls.Events.ERROR, (_event, data) => {
          // Only a fatal error is worth acting on. hls.js recovers from ordinary
          // network hiccups by itself, and a dropped segment on a bad connection
          // is precisely the case this player exists for.
          if (!data.fatal) return;
          // Adaptive streaming gave up. On a Zimbabwean mobile connection this
          // is the common failure and it is invisible from the outside: the
          // student sees a spinner, we see nothing. `data.type` is an hls.js
          // enum ('networkError' | 'mediaError' | …), not anything about them.
          track('video_trouble', { stage: String(data.type) });
          hls.destroy();
          if (!cancelled) setMode('mp4');
        });
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          void ref.current?.play().catch(() => {});
        });
        hls.loadSource(hlsUrl(videoId));
        hls.attachMedia(ref.current);
      })
      .catch(() => {
        // The hls.js chunk itself did not download.
        track('video_trouble', { stage: 'loader' });
        return !cancelled && setMode('mp4');
      });

    return () => {
      cancelled = true;
      instance?.destroy();
    };
  }, [videoId, mode, started]);

  // The fallback path needs the element to actually carry the file.
  useEffect(() => {
    const video = ref.current;
    if (!video || mode !== 'mp4' || !started) return;
    video.src = mp4Url(videoId);
    void video.play().catch(() => {});
  }, [videoId, mode, started]);

  if (mode === 'dead') {
    return (
      <p className="rounded-xl border border-grid-line bg-paper-raised px-4 py-3 text-sm text-ink-muted">
        This video will not play on this connection right now. The notes below are
        the whole lesson in writing — carry on with those.
      </p>
    );
  }

  return (
    <div className="relative">
      <video
        ref={ref}
        className="block w-full"
        controls={started}
        playsInline
        preload="none"
        poster={posterUrl(videoId)}
        aria-label={title}
        // Only the progressive path reports through the element. While hls.js is
        // driving it, hls.js owns the errors — and it empties `src` whenever it
        // detaches, which fires a perfectly ordinary `error` here. Escalating on
        // that once cost us the player on every mount under StrictMode.
        // `playing` is the first frame actually shown — not `play`, which fires
        // on intent and would report every stalled start as a success.
        onPlaying={() => trackStart(mode)}
        onStalled={() => track('video_trouble', { stage: 'stalled' })}
        onError={() => {
          if (mode !== 'mp4') return;
          track('video_trouble', { stage: 'dead' });
          setMode('dead');
        }}
      />
      {started ? null : (
        <button
          type="button"
          // The one deliberate cost in this player: until this click the page
          // has fetched a poster and nothing else. So `video_play` is both "did
          // they want the video" and "did we spend their data", and the gap
          // between it and `video_start` is the stall Durai needs to see.
          onClick={() => {
            track('video_play');
            setStarted(true);
          }}
          aria-label={`Play: ${title}`}
          className="absolute inset-0 flex items-center justify-center bg-black/25 transition hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg">
            <Play className="ml-0.5 h-7 w-7" fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  );
}

/**
 * The exported player, with a boundary of its own.
 *
 * A render-phase throw in here would otherwise unmount the route — the failure
 * mode this app has been bitten by once already. The fallback is a sentence, and
 * the notes underneath are untouched.
 */
export function VideoPlayer(props: Props) {
  return (
    <ErrorBoundary
      label="video"
      fallback={
        <p className="rounded-xl border border-grid-line bg-paper-raised px-4 py-3 text-sm text-ink-muted">
          The player could not start. The notes below are the whole lesson in
          writing — carry on with those.
        </p>
      }
    >
      <Player {...props} />
    </ErrorBoundary>
  );
}
