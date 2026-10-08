# motion_library — Failure Log

> 실패할 때마다 1행. 같은 실패 재발 방지용 게이트를 추가하고 여기 기록.

| date | id | symptom | root cause | fix | gate added |
|---|---|---|---|---|---|
| 2026-10-07 | F1 | Original prompt text triggered autoplay scanner | Whole HTML string scan included quoted source text | Parse actual video attributes with HTMLParser | build_gate.sh |
| 2026-10-07 | F2 | Customized duration conflicted with fixed guide timing | Editorial steps repeated original timing | Use selected duration and proportional scene timing | browser_gate.sh |
| 2026-10-07 | F3 | Generic motion classified as product; graphics matched graph | Broad substring rules and default category | Add art category, word boundaries and corrected regression cases | catalog_gate.sh |
| 2026-10-07 | F4 | Early poster failure stayed as broken image | Image error occurred before React hydration | Check completed image on mount, plus onError | browser_gate.sh |

| PM-20261007-01 | HLS 재생 판정과 검색 직후 호버 검증 실패 | 재생 지원 힌트와 실제 실행을 혼동하고 검색 갱신 전 카드를 선택했습니다. | docs/postmortems/PM-20261007-01-hls-playback-and-hover-test.md |
