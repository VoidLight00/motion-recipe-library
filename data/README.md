# data/playable-catalog.json

사이트가 읽는 유일한 데이터 파일입니다. `lib/catalog.ts`가 `import data from "@/data/playable-catalog.json"`으로 불러오고, 빌드가 작품마다 `/recipes/<slug>/` 페이지를 만듭니다.
The only data file the site reads. `lib/catalog.ts` imports it, and the build creates one `/recipes/<slug>/` page per record.

권리 범위는 [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md)를 따릅니다. 요청문과 번역, 미디어 주소, 제작자 이름은 각 제작자의 것이며 MIT 라이선스로 새로 허락되지 않습니다.
Rights follow [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md). Prompts, translations, media URLs, and creator handles belong to their creators and are not relicensed under MIT.

## 집계 / Counts

2026-10-08에 파일을 읽는 스크립트로 센 값입니다. / Counted from the file with a script on 2026-10-08.

| 항목 / Item | 값 / Value |
|---|---:|
| 작품 수 / Records | 559 |
| 서로 다른 제작자 이름 / Distinct creator handles | 503 |
| 실습 가이드가 있는 작품 / Records with a practice guide | 16 |
| 원문 프롬프트가 전부 있는 작품 / Records with a full original prompt (`promptKind: original`, `verification.prompt: true`) | 357 |
| `promptKind: post`(제작 게시글) / creator post text | 192 |
| `promptKind: partial`(일부 공개) / partial prompt | 10 |
| 추가 공개 프롬프트(`sourcePrompts`)가 있는 작품 / Records with an extra public prompt | 191 |
| `verification.execution`·`reproduction`·`export`가 `true`인 작품 / Records marked executed, reproduced, or exported | 0 |
| 난이도(`difficulty`)를 채운 작품 / Records with a difficulty value | 0 |
| HLS 스트림(`.m3u8`) 영상 / HLS stream videos | 25 |

### 분류 / Categories

| `category` | 이름 / Label | 작품 수 / Records |
|---|---|---:|
| `art` | 아트·모션 실험 | 232 |
| `product` | 제품·서비스 소개 | 122 |
| `interactive` | 게임·인터랙션 | 70 |
| `explain` | 개념 설명 | 66 |
| `three-d` | 3D 장면 | 61 |
| `music` | 음악과 비주얼 | 8 |

### 출처 / Sources

`referenceUrl`의 도메인 기준입니다. / By the domain of `referenceUrl`.

| 도메인 / Domain | 작품 수 / Records |
|---|---:|
| `skillry.dev` | 475 |
| `www.prompt-motion.com` | 38 |
| `www.remotion.dev` | 25 |
| `x.com` | 15 |
| `brochbuilds.com` | 6 |

## 항목 형식 / Record shape

| 필드 / Field | 설명 / Meaning |
|---|---|
| `slug` | 페이지 주소에 쓰는 고유 값 / unique page key |
| `titleKo`, `summaryKo` | 편집한 한국어 제목과 요약 / edited Korean title and summary |
| `category`, `originalCategory` | 사용 목적 분류와 수집 당시 분류 / intent category and the category at collection |
| `tags`, `searchTerms`, `tools` | 검색과 표시에 쓰는 낱말 / words for search and display |
| `promptKind` | `original`, `partial`, `post` 중 하나 / one of `original`, `partial`, `post` |
| `promptOriginal`, `promptKo` | 수집한 원문과 한국어 번역 / collected original text and Korean translation |
| `promptRedacted`, `redactionNote` | 제작자의 로컬 파일 경로를 가린 경우 표시 / set when a creator's local file path was masked |
| `sourcePrompts`, `sourceSkills` | 추가로 확인한 공개 프롬프트와 스킬 링크 / extra public prompts and skill links |
| `posterUrl`, `videoUrl`, `preferredVideoUrl` | 원래 호스트의 미디어 주소 / media URLs on the original host |
| `originalUrl`, `referenceUrl` | 원본 게시물과 수집한 목록 주소 / the original post and the listing it was found in |
| `author`, `added` | 제작자 이름과 수집일 / creator handle and collection date |
| `guide` | `principle`, `steps`, `materials`, `checks`, `troubleshooting`, `adaptedPrompt` 또는 `null` / those fields, or `null` |
| `verification` | `source`, `prompt`, `execution`, `reproduction`, `export`, `checkedAt` |
| `difficulty` | 평가하지 않아 모두 `null` / unrated, always `null` |

`promptRedacted`가 `true`인 작품은 3개입니다. / Three records have `promptRedacted: true`.
