"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Recipe, categories, categoryLabel, promptLabel } from "@/lib/catalog";
import { isStream, useStream } from "@/lib/use-stream";
import {
  officialVideoSource,
  nativeVideoUrl,
  isBlockedXMedia,
} from "./OfficialVideo";
import { searchRecipes } from "@/lib/search";
export function Poster({
  recipe,
  eager = false,
}: {
  recipe: Recipe;
  eager?: boolean;
}) {
  const posterUrl = recipe.preferredPosterUrl || recipe.posterUrl;
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const failed = failedUrl === posterUrl;
  useEffect(() => {
    const image = imageRef.current;
    if (image && image.complete && image.naturalWidth === 0) {
      setFailedUrl(posterUrl);
    }
  }, [posterUrl]);
  return posterUrl && !failed ? (
    <img
      ref={imageRef}
      src={posterUrl}
      alt={`${recipe.titleKo} 영상 미리보기`}
      loading={eager ? "eager" : "lazy"}
      onError={() => setFailedUrl(posterUrl)}
    />
  ) : (
    <div className="poster-fallback">
      <span>MOTION STUDY</span>
      <strong>{categoryLabel(recipe.category)}</strong>
      <span>미리보기 이미지를 불러올 수 없습니다.</span>
    </div>
  );
}
function HoverPreview({
  recipe,
  active,
  stop,
}: {
  recipe: Recipe;
  active: boolean;
  stop: () => void;
}) {
  const videoUrl = nativeVideoUrl(recipe);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useStream(
    videoRef,
    active && !isBlockedXMedia(videoUrl) ? videoUrl : null,
    stop,
  );
  useEffect(() => {
    setPlaying(false);
    if (!active || isBlockedXMedia(videoUrl)) return;
    const video = videoRef.current;
    if (!video) return;
    let disposed = false;
    video.muted = true;
    if (!isStream(videoUrl))
      video.play().catch(() => {
        if (!disposed) stop();
      });
    const hide = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", hide);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) stop();
    });
    observer.observe(video);
    return () => {
      disposed = true;
      video.pause();
      video.removeAttribute("src");
      video.load();
      observer.disconnect();
      document.removeEventListener("visibilitychange", hide);
    };
  }, [active, videoUrl, stop]);
  return active && videoUrl && !isBlockedXMedia(videoUrl) ? (
    <video
      ref={videoRef}
      className={`hover-preview ${playing ? "is-playing" : ""}`}
      src={isStream(videoUrl) ? undefined : videoUrl}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      onPlaying={() => setPlaying(true)}
      onError={stop}
    />
  ) : null;
}
export default function Library({ recipes }: { recipes: Recipe[] }) {
  const [preview, setPreview] = useState<string | null>(null);
  const stopPreview = useCallback(() => setPreview(null), []);
  const startPreview = (id: string, pointerType: string) => {
    if (
      pointerType === "mouse" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      setPreview(id);
  };
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [guided, setGuided] = useState(false);
  const [prompt, setPrompt] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [limit, setLimit] = useState(18);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("motion-recipes") || "[]");
      if (Array.isArray(stored))
        setSaved(stored.filter((s): s is string => typeof s === "string"));
    } catch {}
  }, []);
  const toggle = (slug: string) => {
    const next = saved.includes(slug)
      ? saved.filter((s) => s !== slug)
      : [...saved, slug];
    setSaved(next);
    try {
      localStorage.setItem("motion-recipes", JSON.stringify(next));
    } catch {}
  };
  const filtered = useMemo(
    () =>
      searchRecipes(
        recipes.filter(
          (r) =>
            (category === "all" || r.category === category) &&
            (!guided || r.guide) &&
            (!prompt ||
              (r.promptKind !== "post" && !!r.promptOriginal) ||
              !!r.sourcePrompts?.some((p) => p.text.trim())) &&
            (!savedOnly || saved.includes(r.slug)),
        ),
        q,
      ),
    [recipes, category, guided, prompt, savedOnly, saved, q],
  );
  useEffect(() => setLimit(18), [q, category, guided, prompt, savedOnly]);
  const feature = recipes.find((r) => r.guide && r.posterUrl) || recipes[0];
  const reset = () => {
    setQ("");
    setCategory("all");
    setGuided(false);
    setPrompt(false);
    setSavedOnly(false);
  };
  return (
    <main id="main">
      <section className="intro">
        <div className="intro-copy">
          <p className="eyebrow">A LIBRARY FOR YOUR NEXT CREATION</p>
          <h1>
            좋은 움직임을 발견하고,
            <br />
            <span>내 아이디어로 만듭니다.</span>
          </h1>
          <p className="intro-description">
            마음에 드는 영상 하나에서 시작합니다.
            <br />
            원리를 이해하고, 요청문을 바꿔 나만의 작업에 적용합니다.
          </p>
          <a className="text-link" href="#library">
            무엇을 만들어 볼까요? <span>↓</span>
          </a>
        </div>
        {feature && (
          <a className="feature" href={`/recipes/${feature.slug}/`}>
            <div
              className="feature-media"
              onPointerEnter={(e) => {
                if (!officialVideoSource(feature))
                  startPreview("feature", e.pointerType);
              }}
              onPointerLeave={stopPreview}
            >
              <Poster recipe={feature} eager />
              <HoverPreview
                recipe={feature}
                active={preview === "feature"}
                stop={stopPreview}
              />
              <span className="feature-index">STUDY 01</span>
              <span className="round-arrow">↗</span>
            </div>
            <div className="feature-caption">
              <span>먼저 살펴볼 작품</span>
              <strong>{feature.titleKo}</strong>
            </div>
          </a>
        )}
      </section>
      <section id="how" className="how">
        <div>
          <span>01 / LOOK</span>
          <p>만들고 싶은 영상을 찾습니다.</p>
        </div>
        <div>
          <span>02 / UNDERSTAND</span>
          <p>효과의 원리와 요청문을 읽습니다.</p>
        </div>
        <div>
          <span>03 / MAKE IT YOURS</span>
          <p>내 소재로 바꾸고 실행합니다.</p>
        </div>
        <a href="#library" onClick={() => setGuided(true)}>
          실습 가이드부터 보기 ↗
        </a>
      </section>
      <section id="library" className="library">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE COLLECTION</p>
            <h2>무엇을 만들고 싶으세요?</h2>
          </div>
          <span className="collection-count">
            {recipes.length.toLocaleString()}개의 움직이는 아이디어
          </span>
        </div>
        <div className="search-row">
          <label className="search">
            <span aria-hidden="true">⌕</span>
            <input
              aria-label="작품 검색"
              placeholder="로고가 입자로 흩어지는 영상, 우주, 제품 소개…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="검색어 지우기">
                ×
              </button>
            )}
          </label>
          <button
            className={`saved-button ${savedOnly ? "selected" : ""}`}
            onClick={() => setSavedOnly(!savedOnly)}
            aria-pressed={savedOnly}
          >
            {savedOnly ? "●" : "○"} 저장한 작품 <span>{saved.length}</span>
          </button>
        </div>
        <div
          className="categories"
          role="group"
          aria-label="만들고 싶은 영상 종류"
        >
          {categories.map((c) => (
            <button
              className={category === c.id ? "active" : ""}
              key={c.id}
              onClick={() => setCategory(c.id)}
              aria-pressed={category === c.id}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="filter-row">
          <span aria-live="polite">
            {filtered.length.toLocaleString()}개 작품
          </span>
          <div>
            <label>
              <input
                type="checkbox"
                checked={guided}
                onChange={(e) => setGuided(e.target.checked)}
              />{" "}
              실습 가이드
            </label>
            <label>
              <input
                type="checkbox"
                checked={prompt}
                onChange={(e) => setPrompt(e.target.checked)}
              />{" "}
              프롬프트 공개
            </label>
            {(q || category !== "all" || guided || prompt || savedOnly) && (
              <button className="reset" onClick={reset}>
                초기화
              </button>
            )}
          </div>
        </div>
        {filtered.length ? (
          <div className="recipe-grid">
            {filtered.slice(0, limit).map((r, i) => (
              <article className="recipe-card" key={r.slug}>
                <a
                  className="card-media"
                  href={`/recipes/${r.slug}/`}
                  onPointerEnter={(e) => {
                    if (!officialVideoSource(r))
                      startPreview(r.slug, e.pointerType);
                  }}
                  onPointerLeave={stopPreview}
                >
                  <Poster recipe={r} />
                  <HoverPreview
                    recipe={r}
                    active={preview === r.slug}
                    stop={stopPreview}
                  />
                  <span className="card-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="media-open" aria-hidden="true">
                    ↗
                  </span>
                  {officialVideoSource(r) ? (
                    <span className="official-label">공식 플레이어</span>
                  ) : !nativeVideoUrl(r) ? (
                    <span className="official-label">원본 링크</span>
                  ) : null}
                  {r.guide && <span className="guide-label">실습 가이드</span>}
                </a>
                <div className="card-body">
                  <div className="card-kicker">
                    <span>{categoryLabel(r.category)}</span>
                    <button
                      aria-label={`${r.titleKo} ${saved.includes(r.slug) ? "저장 취소" : "저장"}`}
                      aria-pressed={saved.includes(r.slug)}
                      onClick={() => toggle(r.slug)}
                    >
                      {saved.includes(r.slug) ? "●" : "＋"}
                    </button>
                  </div>
                  <a href={`/recipes/${r.slug}/`}>
                    <h3>{r.titleKo}</h3>
                  </a>
                  <p>{r.summaryKo}</p>
                  <div className="card-tags">
                    <span>
                      {r.tools.length
                        ? r.tools.slice(0, 2).join(" · ")
                        : "사용 도구 미확인"}
                    </span>
                    <span>{promptLabel(r)}</span>
                    {r.difficulty && <span>{r.difficulty}</span>}
                  </div>
                  <div className="card-verification">재현 미검증</div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>
              {savedOnly
                ? "저장한 작품이 없습니다."
                : "조건에 맞는 작품이 없습니다."}
            </h3>
            <p>
              {savedOnly
                ? "작품 카드의 + 버튼을 눌러 다시 보고 싶은 작품을 모아 두세요."
                : "검색어를 짧게 바꾸거나 필터를 해제해 보세요."}
            </p>
            <button className="button" onClick={reset}>
              전체 작품 보기
            </button>
          </div>
        )}
        {limit < filtered.length && (
          <div className="load-more">
            <button
              className="button secondary"
              onClick={() => setLimit((v) => v + 18)}
            >
              작품 더 보기{" "}
              <span>
                ({Math.min(limit, filtered.length)} / {filtered.length})
              </span>{" "}
              ↓
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
