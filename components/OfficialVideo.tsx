"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Recipe } from "@/lib/catalog";

type XWidgets = {
  widgets: {
    createVideo: (
      id: string,
      element: HTMLElement,
      options: { dnt: boolean; width: number },
    ) => Promise<HTMLElement | undefined>;
  };
  ready: (callback: () => void) => void;
};
declare global {
  interface Window {
    twttr?: XWidgets;
  }
}
let scriptPromise: Promise<XWidgets> | null = null;
function loadWidgets(): Promise<XWidgets> {
  if (window.twttr?.widgets?.createVideo) return Promise.resolve(window.twttr);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<XWidgets>((resolve, reject) => {
    const timeout = window.setTimeout(
      () => reject(new Error("Official player timeout")),
      20000,
    );
    const ready = () => {
      if (window.twttr?.widgets?.createVideo) {
        clearTimeout(timeout);
        resolve(window.twttr);
      } else window.twttr?.ready(ready);
    };
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-motion-x-widget]",
    );
    const script = existing || document.createElement("script");
    script.addEventListener("load", ready, { once: true });
    script.addEventListener(
      "error",
      () => {
        clearTimeout(timeout);
        reject(new Error("Official player unavailable"));
      },
      { once: true },
    );
    if (!existing) {
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.dataset.motionXWidget = "true";
      document.head.appendChild(script);
    }
  }).catch((error) => {
    scriptPromise = null;
    throw error;
  });
  return scriptPromise!;
}
export function xPostId(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      !["x.com", "www.x.com", "twitter.com", "www.twitter.com"].includes(
        url.hostname,
      )
    )
      return null;
    return (
      url.pathname.match(
        /^\/(?:[A-Za-z0-9_]+|i\/web)\/status\/(\d+)\/?$/,
      )?.[1] || null
    );
  } catch {
    return null;
  }
}
export function isBlockedXMedia(value: string | null): boolean {
  try {
    return !!value && new URL(value).hostname === "video.twimg.com";
  } catch {
    return false;
  }
}
export function chosenVideoUrl(recipe: Recipe): string | null {
  return recipe.preferredVideoUrl || recipe.videoUrl;
}
export function nativeVideoUrl(recipe: Recipe): string | null {
  const value = chosenVideoUrl(recipe);
  if (!value || isBlockedXMedia(value)) return null;
  if (recipe.mediaPlayback === "external-only" && !recipe.preferredVideoUrl)
    return null;
  return value;
}
export function officialVideoSource(recipe: Recipe): string | null {
  if (nativeVideoUrl(recipe) || recipe.mediaPlayback === "external-only")
    return null;
  if (recipe.mediaSourceUrl && xPostId(recipe.mediaSourceUrl))
    return recipe.mediaSourceUrl;
  return isBlockedXMedia(recipe.videoUrl) && xPostId(recipe.originalUrl)
    ? recipe.originalUrl
    : null;
}
export default function OfficialVideo({
  sourceUrl,
  poster,
}: {
  sourceUrl: string;
  poster: ReactNode;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "unavailable">(
    "loading",
  );
  useEffect(() => {
    const mount = mountRef.current;
    const id = xPostId(sourceUrl);
    if (!mount || !id) {
      setState("unavailable");
      return;
    }
    let disposed = false;
    setState("loading");
    const timer = setTimeout(() => {
      if (!disposed) setState("unavailable");
    }, 25000);
    loadWidgets()
      .then((widgets) => {
        if (disposed) return;
        return widgets.widgets.createVideo(id, mount, {
          dnt: true,
          width: 550,
        });
      })
      .then((element) => {
        if (disposed) return;
        clearTimeout(timer);
        setState(element ? "ready" : "unavailable");
      })
      .catch(() => {
        if (!disposed) {
          clearTimeout(timer);
          setState("unavailable");
        }
      });
    return () => {
      disposed = true;
      clearTimeout(timer);
      mount.replaceChildren();
    };
  }, [sourceUrl]);
  return (
    <div
      className="official-video"
      data-testid="official-video"
      data-state={state}
    >
      {state !== "ready" && <div className="official-poster">{poster}</div>}
      <div
        ref={mountRef}
        className="official-video-mount"
        hidden={state === "unavailable"}
      />
      <div className="official-video-message" role="status">
        <p>
          {state === "loading"
            ? "공식 영상 플레이어를 불러오는 중입니다."
            : state === "ready"
              ? "공식 플레이어의 재생 버튼을 눌러 시청합니다."
              : "외부 플랫폼의 접근 제한 또는 연결 문제로 공식 플레이어를 불러오지 못했습니다."}
        </p>
        <a
          className="text-link"
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          공식 게시물에서 재생 ↗
        </a>
      </div>
    </div>
  );
}
