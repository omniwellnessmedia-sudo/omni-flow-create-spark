import { useState } from 'react';
import { Play } from 'lucide-react';

/**
 * A YouTube embed that costs nothing until somebody presses play.
 *
 * A YouTube iframe pulls roughly half a megabyte of player before a frame
 * is shown, and a page of eighteen talks would pull eighteen of them. This
 * renders the video's own poster image and a play button instead, and
 * swaps in the real player, autoplaying, only for the one that was pressed.
 *
 * The poster is YouTube's hqdefault, which exists for every video; the
 * sharper maxresdefault does not, and a missing poster on a talks page
 * would look like a broken video.
 *
 * The player is loaded from youtube-nocookie.com so nobody who only looks
 * at the page is tracked by YouTube; a cookie is set only after play.
 *
 * No em dashes in this file.
 */

const YouTubeFacade = ({ id, title, className = '' }: { id: string; title: string; className?: string }) => {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className={`aspect-video overflow-hidden rounded-[18px] bg-black ${className}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play: ${title}`}
      className={`group relative block aspect-video w-full overflow-hidden rounded-[18px] bg-black ${className}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        width={480}
        height={360}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-black shadow-[0_8px_30px_rgba(0,0,0,.35)] transition-transform duration-300 group-hover:scale-105"
      >
        <Play className="ml-1 h-6 w-6" fill="currentColor" />
      </span>
    </button>
  );
};

export default YouTubeFacade;
