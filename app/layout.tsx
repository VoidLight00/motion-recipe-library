import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "MOTION RECIPE — 내 아이디어가 움직이기 시작하는 곳",
    template: "%s | MOTION RECIPE",
  },
  description:
    "보고, 이해하고, 내 프로젝트에 적용하는 한국어 코드 영상 실습 라이브러리.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <a href="#main" className="skip">
          본문으로 이동
        </a>
        <section className="creator-header" aria-label="라이브러리 제작자 소개">
          <div className="creator-identity">
            <img src="/brand/voidlight.png" alt="VOIDLIGHT 로고" width="64" height="64" />
            <div><span>라이브러리 제작자</span><strong>VOIDLIGHT</strong><p>손상현 · 보고 이해한 움직임을, 나만의 작업으로.</p></div>
          </div>
          <nav className="creator-socials" aria-label="제작자 SNS">
            <a href="https://open.kakao.com/o/gugo7tCh" target="_blank" rel="noopener noreferrer">카카오톡 그룹챗 ↗</a>
            <a href="https://open.kakao.com/o/srSlAiLd" target="_blank" rel="noopener noreferrer">카카오 1:1 ↗</a>
            <a href="https://www.threads.com/@voidlight00" target="_blank" rel="noopener noreferrer">Threads ↗</a>
            <a href="https://x.com/VoidLight_Hyeon" target="_blank" rel="noopener noreferrer">X ↗</a>
          </nav>
        </section>
        <header className="masthead">
          <a href="/" className="wordmark" aria-label="모션 레시피 홈">
            MOTION<span className="slash">/</span>RECIPE
            <span className="brand-dot" />
          </a>
          <nav aria-label="주요 메뉴">
            <a href="/#library">작품 둘러보기</a>
            <a href="/#how">
              이용 안내 <span>↗</span>
            </a>
          </nav>
        </header>
        {children}
        <footer>
          <div>
            <span>한국어 코드 영상 실습 라이브러리</span>
            <a href="/notices/">권리 및 이용 안내 ↗</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
