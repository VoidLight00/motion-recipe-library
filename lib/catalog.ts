import data from "@/data/playable-catalog.json";
export type Recipe = {
  slug: string;
  titleKo: string;
  summaryKo: string;
  category: string;
  originalCategory: string;
  tags: string[];
  searchTerms: string[];
  tools: string[];
  promptOriginal: string | null;
  postDescription?: string | null;
  sharedPrerequisitePrompt?: string | null;
  publishedExportPrompt?: string | null;
  videoType?: string;
  mediaPlayback?: "external-only" | "official-only";
  preferredVideoUrl?: string;
  preferredPosterUrl?: string;
  preferredMediaSourceUrl?: string;
  sourcePrompts?: { text: string; sourceUrl: string; kind: "original"; verificationTier: "third-party-catalog" }[];
  sourceSkills?: { label: string; url: string; sourceUrl: string }[];
  mediaSourceUrl?: string;
  mediaRelationship?: "exact-post" | "same-author-reply-thread" | "reused-media" | "linked-source";
  mediaStatus?: string;
  mediaUnavailableReason?: string;
  referenceVideoUrl?: string;
  referenceVideoLabel?: string;
  modelLabel?: string;
  verificationTier?: "official" | "third-party-catalog";
  thirdPartyCatalog?: boolean;
  creatorPostIndependentlyFetched?: boolean;
  publishedAt?: string | null;
  promptPartial: boolean;
  promptKind: "original" | "partial" | "post";
  promptKo: string | null;
  promptRedacted?: boolean;
  redactionNote?: string;
  posterUrl: string | null;
  videoUrl: string | null;
  originalUrl: string;
  referenceUrl: string;
  author: string;
  added: string;
  guide: null | {
    principle: string;
    steps: string[];
    materials: string[];
    checks: string[];
    troubleshooting: string[];
    adaptedPrompt: string;
  };
  verification: {
    source: boolean;
    prompt: boolean;
    execution: boolean;
    reproduction: boolean;
    export: boolean;
    checkedAt: string;
    environment: unknown;
  };
  difficulty: string | null;
};
export const recipes = data as Recipe[];
export const categories = [
  { id: "all", label: "전체 작품" },
  { id: "product", label: "제품·서비스 소개" },
  { id: "explain", label: "개념 설명" },
  { id: "music", label: "음악과 비주얼" },
  { id: "three-d", label: "3D 장면" },
  { id: "interactive", label: "게임·인터랙션" },
  { id: "art", label: "아트·모션 실험" },
];
export function categoryLabel(id: string) {
  return categories.find((c) => c.id === id)?.label || id;
}
export function promptLabel(r: Recipe) {
  if (r.promptKind !== "original" && r.sourcePrompts?.some((p) => p.text.trim())) return "추가 공개 프롬프트";
  return r.promptKind === "original"
    ? "원문 프롬프트"
    : r.promptKind === "partial"
      ? "부분 프롬프트"
      : "프롬프트 미공개";
}
