import "../styles/Stats.css";

function Stats() {
  const stats = [
    {
      value: "50%",
      label: "협업 시간 단축",
    },
    {
      value: "3배",
      label: "생산성 향상",
    },
    {
      value: "90%",
      label: "회의록 정확도",
    },
    {
      value: "100+",
      label: "팀이 사용하는 중",
    },
  ];

  return (
    <section className="stats-section">
      <h2 className="stats-title">LOCH의 기대효과</h2>
      <div className="stats-grid">
        {stats.map((item, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-value">{item.value}</div>
            <div className="stat-label">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;
