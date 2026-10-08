import type { Recipe } from "./catalog";
const groups = [
  [
    "아트",
    "예술",
    "art",
    "모션",
    "실험",
    "추상",
    "abstract",
    "서사",
    "이야기",
    "narrative",
  ],
  ["로고", "logo"],
  ["입자", "particle", "particles", "분산", "흩어"],
  ["음악", "music", "audio", "오디오", "음원", "소리"],
  ["반응", "reactive", "반응형"],
  ["우주", "space", "galaxy", "은하"],
  ["제품", "product", "상품", "서비스", "광고"],
  ["설명", "explain", "교육", "개념"],
  ["3d", "threejs", "three.js", "입체"],
  ["게임", "game", "인터랙션", "interactive"],
  ["글자", "텍스트", "타이포", "text", "typography"],
  ["유체", "fluid", "물결", "wave"],
];
export function normalizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/three\.?\s*js/g, "threejs")
    .split(/[\s,]+/)
    .map((t) => t.replace(/(으로|에서|처럼|로|을|를|이|가|은|는|와|과)$/, ""))
    .filter(
      (t) =>
        t.length > 0 &&
        !/^(영상|애니메이션|만들|만들고|싶어|싶어요|주세요|보여|찾아|줘|효과)$/.test(
          t,
        ),
    );
}
export function searchScore(recipe: Recipe, query: string): number {
  const terms = normalizeQuery(query);
  if (!terms.length) return 1;
  const title = recipe.titleKo.toLowerCase();
  const hay = [
    title,
    recipe.summaryKo,
    ...recipe.tags,
    ...recipe.searchTerms,
    ...recipe.tools,
  ]
    .join(" ")
    .toLowerCase()
    .replace(/three\.?\s*js/g, "threejs");
  let matched = 0,
    score = 0;
  for (const term of terms) {
    const group = groups.find((g) =>
      g.some((alias) => term.includes(alias) || alias === term),
    );
    const aliases = group || [term];
    if (aliases.some((alias) => hay.includes(alias))) {
      matched++;
      score += title.includes(term) ? 5 : 2;
    }
  }
  return matched === 0 ? 0 : score + matched / terms.length;
}
export function searchRecipes(recipes: Recipe[], query: string): Recipe[] {
  if (!query.trim()) return recipes;
  return recipes
    .map((r, i) => ({ r, i, score: searchScore(r, query) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((x) => x.r);
}
