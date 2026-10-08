"use client";
import { useEffect, useRef, type RefObject } from "react";
export const isStream = (url: string | null) => !!url && /\.m3u8(?:\?|$)/i.test(url);
export function useStream(ref: RefObject<HTMLVideoElement | null>, url: string | null, fail: () => void) {
  const failRef = useRef(fail);
  failRef.current = fail;
  useEffect(() => {
    const video = ref.current;
    if (!video || !url || !isStream(url)) return;
    let disposed = false;
    let destroy: (() => void) | undefined;
    const play = () => { if (!disposed) { video.muted = true; void video.play().catch(() => {}); } };
    import("hls.js").then(({ default: Hls }) => {
      if (disposed) return;
      if (!Hls.isSupported()) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) { video.src = url; play(); }
        else failRef.current();
        return;
      }
      const hls = new Hls({ capLevelToPlayerSize: true, maxBufferLength: 15 });
      destroy = () => hls.destroy();
      hls.on(Hls.Events.MANIFEST_PARSED, play);
      hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal && !disposed) failRef.current(); });
      hls.loadSource(url);
      hls.attachMedia(video);
    }).catch(() => { if (!disposed) failRef.current(); });
    return () => { disposed = true; destroy?.(); video.pause(); video.removeAttribute("src"); video.load(); };
  }, [ref, url]);
}
