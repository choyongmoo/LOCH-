import "../styles/CTA.css";

function CTA() {
  return (
    <section className="cta-section" id="start">
      <div className="cta-content">
        <h2 className="cta-title">지금 바로 팀의 협업을 바꿔보세요</h2>
        <p className="cta-subtitle">
          개발, 디자인, 문서 작업까지 한 화면에서 실시간으로!
          <br />
          LOCH로 진짜 협업을 시작하세요.
        </p>
        <div className="cta-buttons">
          <button className="btn-primary">무료로 시작하기</button>
          <a
            href="https://github.com/choyongmoo/LOCH-"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="btn-secondary">GitHub 저장소 보기</button>
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTA;
