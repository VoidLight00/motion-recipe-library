# Changelog

이 프로젝트의 주요 변경 사항을 기록합니다.
형식은 [Keep a Changelog](https://keepachangelog.com/), 버전은 [Semantic Versioning](https://semver.org/)을 따릅니다.

## [Unreleased]

### Added
- 공개 저장소 문서: LICENSE(MIT), THIRD_PARTY_NOTICES.md, 한국어·영어·일본어·중국어 README, 구조 도해, 커뮤니티 템플릿.

### Changed
- 공개 저장소에는 사이트가 실제로 읽는 `data/playable-catalog.json`만 담습니다. 수집 원본, 조사 자료, 검증 로그, 내부 파이프라인은 비공개 작업 폴더에 둡니다.

## [1.0.0] - 2026-10-07

첫 공개 배포 버전입니다. Vercel 프로덕션에 배포했고 GitHub 릴리스 태그는 아직 만들지 않았습니다.

### Added
- 사용 목적별 여섯 분류와 한글 검색을 갖춘 작품 목록. 공개 목록은 재생을 직접 확인한 559편입니다.
- 작품 카드에 마우스를 올리면 음소거 미리보기를 한 번에 하나만 재생합니다. 상세 화면은 음소거 상태로 자동 재생합니다.
- HLS(`.m3u8`) 영상은 hls.js로 재생하고, 공식 게시물 영상은 X 위젯으로 불러옵니다.
- 원문 프롬프트가 있는 작품에 적용용 요청문 작성 도구를 제공합니다. 만들 대상, 길이, 분위기, 문구, 색상, 도구를 입력하면 요청문이 만들어지고 복사와 텍스트 파일 저장을 지원합니다.
- 16편에 원리와 준비물, 실행 순서, 확인 항목, 문제 해결을 담은 실습 가이드를 작성했습니다.
- 마음에 드는 작품을 현재 브라우저에 저장하는 기능(`localStorage`).
- 제작자 소개 헤더와 연결 링크, 권리 안내 페이지(`/notices/`).
- 보안 응답 헤더(`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).

### Fixed
- 이미지가 React 하이드레이션 전에 실패하면 깨진 이미지가 그대로 남던 문제를 마운트 시 완료 상태 확인과 `onError`로 해결했습니다.
- 브라우저의 HLS 지원 응답(`canPlayType`)을 실제 재생 가능으로 해석해 상세 영상이 재생되지 않던 문제를 hls.js 우선 경로로 해결했습니다.
- 사용자가 고른 영상 길이가 가이드의 고정 시간과 충돌하던 문제를 선택한 길이에 비례해 장면 시간을 나누도록 바꿨습니다.
- 범용 모션이 제품 소개로 분류되고 `graphics`가 `graph` 규칙에 걸리던 분류 오류를 단어 경계 검사와 아트 분류 추가로 바로잡았습니다.

[Unreleased]: https://github.com/VoidLight00/motion-recipe-library/commits/main
