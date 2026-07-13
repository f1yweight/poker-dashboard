import { BookOpen, Dumbbell, Trophy } from 'lucide-react';

type MonthlySummary = {
  totalMttPlayed: number;
  totalLearningHours: number;
  totalSportHours: number;
};

type MonthlyObjectivesPanelProps = {
  summary: MonthlySummary;
};

type Objective = {
  label: string;
  value: number;
  target: number;
  displayValue: string;
  icon: React.ElementType;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(value);
}

function formatInteger(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}

function getProgressPercent(value: number, target: number) {
  if (target === 0) {
    return 0;
  }

  return Math.min((value / target) * 100, 100);
}

function MonthlyObjectivesPanel({ summary }: MonthlyObjectivesPanelProps) {
  const objectives: Objective[] = [
    {
      label: 'MTT played',
      value: summary.totalMttPlayed,
      target: 1000,
      displayValue: `${formatInteger(summary.totalMttPlayed)} / 1k`,
      icon: Trophy,
    },
    {
      label: 'Learning hours',
      value: summary.totalLearningHours,
      target: 20,
      displayValue: `${formatNumber(summary.totalLearningHours)} / 20`,
      icon: BookOpen,
    },
    {
      label: 'Sport hours',
      value: summary.totalSportHours,
      target: 12,
      displayValue: `${formatNumber(summary.totalSportHours)} / 12`,
      icon: Dumbbell,
    },
  ];

  return (
    <section className="monthly-objectives-panel">
      <h2>Monthly objectives</h2>

      {objectives.map((objective) => {
        const Icon = objective.icon;
        const progressPercent = getProgressPercent(
          objective.value,
          objective.target,
        );

        return (
          <article className="objective-card" key={objective.label}>
            <div className="objective-card-header">
              <Icon size={16} strokeWidth={2.4} />
              <span>{objective.label}</span>
            </div>

            <strong>{objective.displayValue}</strong>

            <div
              className="objective-progress"
              aria-label={`${objective.label} progress`}
            >
              <div
                className="objective-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default MonthlyObjectivesPanel;