import "../styles/DemoSection.css";

function DemoSection() {
  return (
    <section className="demo-section" id="demo">
      <h2 className="demo-title">LOCH는 이렇게 작동합니다</h2>
      <p className="demo-subtitle">
        실시간 코드 편집, 화상 회의, 회의록 요약까지 한 눈에 확인해보세요.
      </p>
      <div className="demo-placeholder">
        🎬 <span className="demo-note">여기에 데모 영상 또는 스크린샷이 들어갈 자리입니다.</span>
      </div>
    </section>
  );
}

export default DemoSection;
