import "../styles/FeatureGrid.css";

function FeatureGrid() {
  const features = [
    {
      icon: "💻",
      title: "실시간 코드 편집",
      desc: "여러 명이 동시에 코드를 작성하고 GitHub와 연동할 수 있습니다.",
    },
    {
      icon: "📝",
      title: "회의록 자동 생성",
      desc: "음성을 텍스트로 변환하고 요약해 PDF로 저장할 수 있습니다.",
    },
    {
      icon: "🧠",
      title: "화이트보드 협업",
      desc: "아이디어를 시각적으로 공유할 수 있는 실시간 보드 제공.",
    },
    {
      icon: "🎥",
      title: "화상 회의 & 채팅",
      desc: "WebRTC 기반 고화질 회의 및 실시간 채팅 기능 제공.",
    },
  ];

  return (
    <section className="feature-section" id="features">
      <h2 className="feature-title">LOCH 주요 기능</h2>
      <div className="feature-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-card-title">{feature.title}</h3>
            <p className="feature-card-desc">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureGrid;
