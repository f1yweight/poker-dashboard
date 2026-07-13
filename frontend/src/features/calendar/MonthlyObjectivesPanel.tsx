function MonthlyObjectivesPanel() {
  return (
    <section className="dashboard-panel monthly-objectives-panel">
      <h2>Monthly objectives</h2>

      <div className="objective-card">
        <span>MTT hours</span>
        <strong>0 / 80</strong>
      </div>

      <div className="objective-card">
        <span>Hands played</span>
        <strong>0 / 20k</strong>
      </div>

      <div className="objective-card">
        <span>Learning hours</span>
        <strong>0 / 15</strong>
      </div>
    </section>
  );
}

export default MonthlyObjectivesPanel;