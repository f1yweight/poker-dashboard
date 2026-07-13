import { BookOpen, Clock, Hand } from 'lucide-react';

type Objective = {
  label: string;
  value: number;
  target: number;
  displayValue: string;
  icon: React.ElementType;
};

const objectives: Objective[] = [
  {
    label: 'MTT hours',
    value: 0,
    target: 80,
    displayValue: '0 / 80',
    icon: Clock,
  },
  {
    label: 'Hands played',
    value: 0,
    target: 20000,
    displayValue: '0 / 20k',
    icon: Hand,
  },
  {
    label: 'Learning hours',
    value: 0,
    target: 15,
    displayValue: '0 / 15',
    icon: BookOpen,
  },
];

function getProgressPercent(value: number, target: number) {
  if (target === 0) {
    return 0;
  }

  return Math.min((value / target) * 100, 100);
}

function MonthlyObjectivesPanel() {
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