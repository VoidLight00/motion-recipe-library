"use client";
import { useEffect, useRef, useState } from "react";
import { Recipe, categoryLabel, promptLabel } from "@/lib/catalog";
import { isStream, useStream } from "@/lib/use-stream";
import OfficialVideo, {
  officialVideoSource,
  nativeVideoUrl,
} from "./OfficialVideo";
import { Poster } from "./Library";
export default function RecipeDetail({ recipe: r }: { recipe: Recipe }) {
  const officialSource = officialVideoSource(r);
  const nativeUrl = nativeVideoUrl(r);
  const hasAdditionalPrompt = !!r.sourcePrompts?.some((p) => p.text.trim());
  const [mediaError, setMediaError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  useStream(videoRef, mediaError ? null : nativeUrl, () => setMediaError(true));
  useEffect(() => {
    if (videoRef.current?.error) setMediaError(true);
  }, [r.videoUrl]);
  const hasOriginal =
    r.promptKind === "original" &&
    r.verification.prompt === true &&
    !!r.promptOriginal?.trim();
  const hasPartial = r.promptKind === "partial" && !!r.promptOriginal?.trim();
  const availability = hasPartial
    ? "프롬프트 부분 공개"
    : hasAdditionalPrompt
      ? "추가 공개 프롬프트"
      : "프롬프트 미공개";
  const [tab, setTab] = useState("original");
  const [copied, setCopied] = useState("");
  const [form, setForm] = useState({
    subject: "내 서비스 소개",
    duration: "15",
    mood: "절제된 제품 광고",
    message: "반복 업무를 줄이세요",
    colors: "검정, 흰색",
    tool: "Claude Code",
  });
  const isManim = r.tools.some((tool) => /manim/i.test(tool));
  const isInteractive = r.category === "interactive";
  const executionRequest = isManim
    ? "Manim 렌더 명령을 실행하고 생성된 영상 파일을 재생해 결과를 확인해 주세요."
    : isInteractive
      ? "실행 가능한 게임 또는 인터랙션을 만들고 마우스·터치·키보드 조작과 다시 시작 기능을 확인해 주세요."
      : "브라우저에서 실행되는 결과를 먼저 확인해 주세요.";
  const executionCheck = isManim
    ? "렌더 명령이 완료되고 생성된 영상이 정상 재생되는지 확인합니다."
    : isInteractive
      ? "게임 또는 인터랙션이 실행되고 필요한 입력과 다시 시작 기능이 동작하는지 확인합니다."
      : "브라우저에서 오류 없이 실행되는지 확인합니다.";
  const exportRequest = isManim
    ? "출력 파일의 형식, 해상도, 프레임 수와 목표 길이를 확인해 주세요."
    : isInteractive
      ? "게임 실행 결과와 영상 녹화는 별도 산출물입니다. 녹화가 필요하면 도구와 출력 파일을 확인해 주세요."
      : "MP4 출력은 별도 단계입니다. 출력 도구와 해상도, 프레임 수, 파일 생성 여부를 확인하고, 지원하지 않으면 정확히 알려 주세요.";
  const adapted = hasOriginal
    ? r.guide?.adaptedPrompt || r.promptOriginal || ""
    : "";
  const personalized = adapted
    .replaceAll("[내 프로젝트]", form.subject)
    .replaceAll("[원하는 초]", `${form.duration}초`)
    .replaceAll("[한 문장]", form.message)
    .replaceAll("[브랜드 색]", form.colors)
    .replaceAll("[16:9 또는 9:16]", "16:9 (필요하면 세로형으로 조정)")
    .replaceAll(
      "[사용 가능한 파일]",
      "아래 준비할 자료 목록을 확인하고, 없는 파일은 먼저 요청해 주세요.",
    );
  const generated = hasOriginal
    ? `${personalized}\n\n[참고 작품]\n제목: ${r.titleKo}\n핵심 효과: ${r.summaryKo}\n원본: ${r.originalUrl}\n참고 구현 기술: ${r.tools.join(", ") || "미확인"}\n\n[내 프로젝트 조건]\n만들 대상: ${form.subject}\n목표 길이: ${form.duration}초\n분위기: ${form.mood}\n핵심 문구: ${form.message}\n브랜드 색상: ${form.colors}\n사용 도구: ${form.tool}\n\n[결과 요구사항]\n1. 필요한 파일과 설치 과정을 먼저 알려 주세요.\n2. 핵심 효과를 구현한 뒤 글자, 색상, 속도를 쉽게 바꿀 수 있게 해 주세요.\n3. ${executionRequest}\n4. ${exportRequest}\n5. 직접 실행하지 않은 항목은 검증 완료로 표시하지 마세요.\n\n[준비할 자료]\n${(r.guide?.materials || ["사용 권한이 있는 로고와 이미지", "표시할 문구와 브랜드 색상", "사용할 음악이 있다면 권리를 확보한 음원"]).map((x) => "- " + x).join("\n")}\n\n[실행 및 확인 순서]\n${(r.guide?.steps || ["요청문을 에이전트에 전달하고 구현 계획을 확인합니다.", "필요한 자료를 추가하고 로컬 실행 방법을 확인합니다.", executionCheck, "영상 파일이 필요하면 별도 출력 단계를 요청합니다."]).map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\n[작품별 확인 사항]\n${(r.guide?.checks || []).map((x) => "- " + x).join("\n")}\n\n[문제 해결]\n${(r.guide?.troubleshooting || ["실행 오류를 먼저 해결한 뒤 시각 효과를 조정합니다."]).map((x) => "- " + x).join("\n")}\n\n[수정 요청문]\n핵심 효과가 잘 드러나지 않습니다. 현재 결과와 요청 조건의 차이를 확인하고, 동작 타이밍과 화면 구성을 한 항목씩 수정해 주세요. 수정 후 실행 결과를 다시 확인해 주세요.`
    : "";
  async function copy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
    } catch {
      setCopied("error");
    }
    setTimeout(() => setCopied(""), 2500);
  }
  function download() {
    if (!hasOriginal) return;
    const url = URL.createObjectURL(
      new Blob([generated], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `${r.slug}-my-recipe.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <main id="main" className="detail">
      <a className="back" href="/#library">
        ← 작품 목록으로
      </a>
      <div className="detail-heading">
        <div>
          <p className="eyebrow">{categoryLabel(r.category)} / MOTION STUDY</p>
          <h1>{r.titleKo}</h1>
          <p>{r.summaryKo}</p>
        </div>
        <a
          className="text-link"
          href={r.originalUrl}
          target="_blank"
          rel="noreferrer"
        >
          원본 보기 ↗
        </a>
      </div>
      <nav className="detail-nav" aria-label="실습 단계">
        <a href="#result">01 결과 보기</a>
        <a href="#principle">02 원리 이해</a>
        <a href="#apply">03 직접 적용</a>
      </nav>
      <section id="result" className="result">
        <div
          className={`detail-media ${officialSource ? "official-media" : ""}`}
        >
          {officialSource ? (
            <OfficialVideo
              sourceUrl={officialSource}
              poster={<Poster recipe={r} eager />}
            />
          ) : nativeUrl && !mediaError ? (
            <video
              ref={videoRef}
              src={isStream(nativeUrl) ? undefined : nativeUrl}
              poster={r.preferredPosterUrl || r.posterUrl || undefined}
              controls
              playsInline
              autoPlay
              muted
              preload="auto"
              onError={() => setMediaError(true)}
              aria-label={`${r.titleKo} 원본 영상`}
            />
          ) : (
            <>
              <Poster recipe={r} eager />
            </>
          )}
        </div>
        <div className="result-caption">
          <p>
            {officialSource
              ? "외부 공식 플레이어 · 자동 재생을 보장하지 않습니다."
              : mediaError
                ? "영상을 불러오지 못했습니다. 원본 페이지에서 확인할 수 있습니다."
                : nativeUrl
                  ? "원본 영상 · 무음으로 자동 재생됩니다. 소리는 영상의 음량 버튼으로 켤 수 있습니다."
                  : r.mediaUnavailableReason ||
                    "직접 재생할 영상 주소가 없습니다. 원본 페이지에서 결과를 확인할 수 있습니다."}
          </p>
          <a
            href={
              r.preferredMediaSourceUrl || r.mediaSourceUrl || r.originalUrl
            }
            target="_blank"
            rel="noreferrer"
          >
            원본에서 보기 ↗
          </a>
        </div>
        {r.mediaRelationship === "same-author-reply-thread" && (
          <p className="fine-print">
            이 요청문은 제작자의 후속 게시물에 있습니다. 영상은 같은 제작자의
            연결된 상위 게시물입니다.
          </p>
        )}
        {r.mediaRelationship === "reused-media" && (
          <p className="fine-print">
            공개 자료에서 확인한 동일 영상의 게시물을 연결했습니다. 요청문
            게시물과 영상 게시물은 다릅니다.
          </p>
        )}
        {r.mediaRelationship === "linked-source" && (
          <p className="fine-print">
            자료에 연결된 영상 게시물입니다. 이 페이지의 요청문으로 재현한
            결과는 아닙니다.
          </p>
        )}
        {r.referenceVideoUrl && (
          <p className="fine-print">
            다른 제작자의 참고 영상이며 이 작품의 결과가 아닙니다.{" "}
            <a
              href={r.referenceVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              참고 영상 확인 ↗
            </a>
          </p>
        )}
        <div className="verification">
          <div>
            <span>자료 상태</span>
            <strong>{promptLabel(r)}</strong>
          </div>
          <div>
            <span>실행·재현</span>
            <strong>미검증</strong>
          </div>
          <div>
            <span>MP4 출력</span>
            <strong>미검증</strong>
          </div>
          <div>
            <span>자료 확인일</span>
            <strong>
              {String(r.verification?.checkedAt || r.added || "미기록").slice(
                0,
                10,
              )}
            </strong>
          </div>
        </div>
        <p className="fine-print">
          수집한 작품입니다. 이 안내로 같은 결과를 재현했거나 영상 파일 출력을
          확인했다는 뜻은 아닙니다. 브라우저 애니메이션과 MP4 영상 출력은 별도로
          확인해야 합니다.
        </p>
      </section>
      <section id="principle" className="lesson-section">
        <div className="lesson-title">
          <span className="step-number">02</span>
          <h2>
            어떤 원리로
            <br />
            움직일까요?
          </h2>
        </div>
        <div className="lesson-content">
          <p className="large-copy">
            {r.guide?.principle ||
              "공개된 자료만으로 구현 원리를 확정할 수 없습니다. 원본 결과와 요청문을 살펴보고, 구현을 시작하기 전에 사용할 기술과 효과를 에이전트에게 설명해 달라고 요청하세요."}
          </p>
          <div className="tool-line">
            <span>자료에 표시된 도구</span>
            <strong>{r.tools.length ? r.tools.join(" · ") : "미확인"}</strong>
          </div>
          {r.tools.some((t) => /canvas/i.test(t)) && (
            <p>
              Canvas는 웹페이지 안의 도화지입니다. 코드로 점과 선을 반복해서
              그리면 움직이는 화면이 됩니다.
            </p>
          )}
          {r.tools.some((t) => /three/i.test(t)) && (
            <p>
              Three.js는 웹에서 입체 장면을 만드는 도구입니다. 물체, 카메라,
              조명을 배치하고 시간에 따라 움직입니다.
            </p>
          )}
          <div className="prompt-tabs" role="group" aria-label="요청문 종류">
            {hasOriginal && r.guide?.adaptedPrompt && (
              <button
                aria-pressed={tab === "adapted"}
                className={tab === "adapted" ? "active" : ""}
                onClick={() => setTab("adapted")}
              >
                적용용 요청문
              </button>
            )}
            <button
              aria-pressed={tab === "original"}
              className={tab === "original" ? "active" : ""}
              onClick={() => setTab("original")}
            >
              {hasOriginal ? promptLabel(r) : availability}
            </button>
            {(hasOriginal || hasPartial) && (
              <button
                aria-pressed={tab === "ko"}
                className={tab === "ko" ? "active" : ""}
                onClick={() => setTab("ko")}
              >
                한국어 번역
              </button>
            )}
          </div>
          <div className="prompt-panel">
            <p className="prompt-notice">
              {tab === "adapted"
                ? "라이브러리가 작성한 적용용 요청문입니다. 제작자의 원문이 아닙니다."
                : tab === "ko"
                  ? "번역문은 원문과 별도로 제공합니다."
                  : r.promptKind === "post"
                    ? "기존 수집 자료에는 원문 프롬프트가 없습니다. 추가로 확인한 원문이 있으면 아래에 별도로 표시합니다."
                    : r.promptKind === "partial"
                      ? "공개된 요청문의 일부입니다. 전체 제작 과정이 포함되지 않을 수 있습니다."
                      : "공개 자료에서 확보한 원문 요청문입니다."}
            </p>
            {tab === "original" &&
              r.verificationTier === "third-party-catalog" &&
              (hasOriginal || hasPartial) && (
                <p className="prompt-notice">
                  공개 큐레이션 자료에서 확보한 원문이며 제작자 게시물 대조는
                  미확인입니다.
                </p>
              )}
            {tab === "original" && r.promptRedacted && (
              <p className="prompt-notice">
                {r.redactionNote ||
                  "원문에 포함된 개인 로컬 경로를 가렸습니다."}
              </p>
            )}
            <pre>
              {tab === "adapted"
                ? adapted
                : tab === "ko"
                  ? r.promptKo || "확인된 한국어 번역이 아직 없습니다."
                  : hasOriginal || hasPartial
                    ? r.promptOriginal
                    : "기존 수집 자료의 프롬프트 미공개: 추가 공개 원문은 별도 영역을 확인합니다."}
            </pre>
            <button
              className="copy"
              onClick={() =>
                copy(
                  tab === "adapted"
                    ? adapted
                    : tab === "ko"
                      ? r.promptKo || ""
                      : r.promptOriginal || "",
                  "prompt",
                )
              }
              disabled={
                (!hasOriginal && !hasPartial) || (tab === "ko" && !r.promptKo)
              }
            >
              {copied === "prompt" ? "복사했습니다" : "요청문 복사 ↗"}
            </button>
          </div>
          {r.sourcePrompts
            ?.filter((p) => p.text.trim())
            .map((entry, index) => (
              <div
                className="prompt-panel"
                data-testid="additional-source-prompt"
                key={`${entry.sourceUrl}-${index}`}
              >
                <h3>추가 공개 원문</h3>
                <p className="prompt-notice">
                  추가 공개 자료에서 확보한 요청문 원문입니다. 기존 수집 원문과
                  별도로 표시하며, 라이브러리가 새로 만든 요청문이 아닙니다.
                  제작자 게시물과의 독립 대조는 미확인입니다.
                </p>
                <pre>{entry.text}</pre>
                <button
                  className="copy"
                  onClick={() => copy(entry.text, `source-${index}`)}
                >
                  {copied === `source-${index}`
                    ? "복사했습니다"
                    : "추가 원문 복사 ↗"}
                </button>
                <p>
                  <a
                    className="text-link"
                    href={entry.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    공개 자료 확인 ↗
                  </a>
                </p>
              </div>
            ))}
          {!!r.sourceSkills?.length && (
            <div className="prompt-panel" data-testid="source-skills">
              <h3>공개 스킬</h3>
              <p className="prompt-notice">
                제작자가 공개한 작업 지침 링크입니다. 실제 제작 프롬프트
                원문과는 구분합니다.
              </p>
              {r.sourceSkills.map((skill, index) => (
                <p key={`${skill.url}-${index}`}>
                  <a
                    className="text-link"
                    href={skill.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {skill.label || "공개 스킬"} ↗
                  </a>
                </p>
              ))}
            </div>
          )}
          {r.sharedPrerequisitePrompt && (
            <div className="prompt-panel" data-testid="published-prerequisite">
              <h3>제작자가 공개한 사전 지침 원문</h3>
              <p className="prompt-notice">
                작품 제작 전에 함께 사용하도록 공개된 지침입니다. 라이브러리가
                새로 만든 요청문이 아닙니다.
              </p>
              <pre>{r.sharedPrerequisitePrompt}</pre>
              <button
                className="copy"
                onClick={() =>
                  copy(r.sharedPrerequisitePrompt!, "prerequisite")
                }
              >
                {copied === "prerequisite"
                  ? "복사했습니다"
                  : "사전 지침 원문 복사 ↗"}
              </button>
            </div>
          )}
          {r.publishedExportPrompt && (
            <div className="prompt-panel" data-testid="published-export">
              <h3>제작자가 공개한 영상 출력 요청문</h3>
              <p className="prompt-notice">
                공개 자료에 실린 출력 요청문 원문입니다. 이 라이브러리에서 출력
                성공을 검증했다는 뜻은 아닙니다.
              </p>
              <pre>{r.publishedExportPrompt}</pre>
              <button
                className="copy"
                onClick={() => copy(r.publishedExportPrompt!, "export")}
              >
                {copied === "export" ? "복사했습니다" : "영상 출력 원문 복사 ↗"}
              </button>
            </div>
          )}
        </div>
      </section>
      <section id="apply" className="lesson-section">
        <div className="lesson-title">
          <span className="step-number">03</span>
          <h2>
            이제,
            <br />내 버전으로.
          </h2>
          <p>
            {hasOriginal
              ? "소재와 조건을 바꾸면 실행에 쓸 요청문이 완성됩니다."
              : "전체 원문이 확인된 작품만 적용용 요청문을 제공합니다."}
          </p>
        </div>
        <div className="lesson-content">
          {hasOriginal ? (
            <>
              <div className="form-grid">
                {(
                  [
                    {
                      key: "subject",
                      label: "만들 대상",
                      placeholder: "내 서비스 소개",
                    },
                    {
                      key: "duration",
                      label: "영상 길이 (초)",
                      placeholder: "15",
                    },
                    {
                      key: "mood",
                      label: "분위기",
                      placeholder: "절제된 제품 광고",
                    },
                    {
                      key: "message",
                      label: "핵심 문구",
                      placeholder: "반복 업무를 줄이세요",
                    },
                    {
                      key: "colors",
                      label: "브랜드 색상",
                      placeholder: "검정, 흰색",
                    },
                    {
                      key: "tool",
                      label: "사용 도구",
                      placeholder: "Claude Code",
                    },
                  ] as const
                ).map((f) => (
                  <label key={f.key}>
                    {f.label}
                    <input
                      type={f.key === "duration" ? "number" : "text"}
                      min={1}
                      max={600}
                      value={form[f.key]}
                      placeholder={f.placeholder}
                      onChange={(e) =>
                        setForm({ ...form, [f.key]: e.target.value })
                      }
                    />
                  </label>
                ))}
              </div>
              <div className="generated">
                <div className="generated-heading">
                  <h3>내 프로젝트 요청문</h3>
                  <span>입력 내용이 바로 반영됩니다.</span>
                </div>
                <textarea
                  aria-label="완성된 요청문"
                  readOnly
                  value={generated}
                />
                <div className="button-row">
                  <button
                    className="button"
                    onClick={() => copy(generated, "generated")}
                  >
                    {copied === "generated"
                      ? "복사했습니다"
                      : "전체 요청문 복사"}{" "}
                    ↗
                  </button>
                  <button className="button secondary" onClick={download}>
                    텍스트 파일 저장 ↓
                  </button>
                </div>
                <p role="status">
                  {copied === "error"
                    ? "복사 권한이 없습니다. 요청문을 선택해 복사하거나 텍스트 파일로 저장하세요."
                    : ""}
                </p>
              </div>
            </>
          ) : (
            <div className="prompt-panel" data-testid="prompt-unavailable">
              <h3>{availability}</h3>
              <p>
                전체 원문 요청문을 확인하지 못해 적용용 요청문을 생성하지
                않습니다. 원본 페이지에서 공개 여부를 확인할 수 있습니다.
              </p>
              <a
                className="text-link"
                href={r.originalUrl}
                target="_blank"
                rel="noreferrer"
              >
                원본 확인 ↗
              </a>
            </div>
          )}
          <div className="practice-checks">
            <h3>실행할 때 확인할 것</h3>
            <ol>
              {(
                r.guide?.checks || [
                  "필요한 자료의 사용 권한과 파일 경로를 확인합니다.",
                  executionCheck,
                  "참고 작품의 핵심 효과와 내 결과를 비교합니다.",
                  "MP4 파일이 필요하면 실제 파일 생성과 재생을 확인합니다.",
                ]
              ).map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ol>
            <details>
              <summary>결과가 예상과 다를 때</summary>
              {(
                r.guide?.troubleshooting || [
                  "오류 메시지와 실행 환경을 함께 전달하고 수정을 요청합니다.",
                  "한 번에 한 가지 효과를 수정한 뒤 결과를 다시 확인합니다.",
                ]
              ).map((x, i) => (
                <p key={i}>{x}</p>
              ))}
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}
