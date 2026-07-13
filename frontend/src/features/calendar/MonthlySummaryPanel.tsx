import type { MonthlySummary } from './monthlySummaryUtils';

type MonthlySummaryPanelProps = {
  summary: MonthlySummary;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(value);
}

function formatNullableNumber(value: number | null) {
  if (value === null) {
    return '-';
  }

  return formatNumber(value);
}

function formatProfit(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    signDisplay: 'exceptZero',
  }).format(value);
}

function MonthlySummaryPanel({ summary }: MonthlySummaryPanelProps) {
  return (
    <section className="monthly-summary-section">
      <h2>Monthly summary</h2>

      <div className="monthly-summary-grid">
        <article className="summary-card">
          <span>Sessions</span>
          <strong>{summary.sessions}</strong>
        </article>

        <article className="summary-card">
          <span>Total MTT</span>
          <strong>{formatNumber(summary.totalMttPlayed)}</strong>
        </article>

        <article className="summary-card">
          <span>Total hands</span>
          <strong>{formatNumber(summary.totalHandsPlayed)}</strong>
        </article>

        <article className="summary-card">
          <span>EV BB/100</span>
          <strong>{formatNullableNumber(summary.averageEvBb100)}</strong>
        </article>

        <article className="summary-card">
          <span>Total profit</span>
          <strong>{formatProfit(summary.totalProfit)}</strong>
        </article>

        <article className="summary-card">
          <span>ABI</span>
          <strong>{formatNullableNumber(summary.averageAbi)}</strong>
        </article>

        <article className="summary-card">
          <span>MTT hours</span>
          <strong>{formatNumber(summary.totalMttHours)}</strong>
        </article>

        <article className="summary-card">
          <span>Learning hours</span>
          <strong>{formatNumber(summary.totalLearningHours)}</strong>
        </article>

        <article className="summary-card">
          <span>Sport hours</span>
          <strong>{formatNumber(summary.totalSportHours)}</strong>
        </article>
      </div>
    </section>
  );
}

export default MonthlySummaryPanel;