import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-inner">
        <h1 className="hero-title">
          <span>실시간 협업의 모든 것,</span>
          <span className="hero-linebreak">LOCH에서 시작하세요</span>
        </h1>
        <p className="hero-subtitle">
          문서, 코드, 디자인을 한 화면에서 동시에! <br />
          개발자와 팀을 위한 통합 협업 플랫폼
        </p>
        <div className="hero-buttons">
          <a href="/signup">
            <button className="btn-primary">지금 시작하기</button>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;