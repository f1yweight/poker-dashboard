import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type FormEvent,
} from 'react';
import {
  BookOpen,
  Dumbbell,
  Plus,
  Settings,
  SlidersHorizontal,
  Trophy,
  X,
} from 'lucide-react';

type MonthlySummary = {
  totalMttPlayed: number;
  totalLearningHours: number;
  totalSportHours: number;
};

type MonthlyObjectivesPanelProps = {
  summary: MonthlySummary;
};

type MonthlyObjectiveTargets = {
  mttPlayed: number;
  learningHours: number;
  sportHours: number;
};

type Objective = {
  key: keyof MonthlyObjectiveTargets;
  label: string;
  value: number;
  target: number;
  displayValue: string;
  icon: ElementType;
};

const defaultTargets: MonthlyObjectiveTargets = {
  mttPlayed: 1000,
  learningHours: 20,
  sportHours: 12,
};

const targetStorageKey = 'poker-dashboard-monthly-objective-targets';

function loadTargets(): MonthlyObjectiveTargets {
  const storedTargets = localStorage.getItem(targetStorageKey);

  if (!storedTargets) {
    return defaultTargets;
  }

  try {
    return {
      ...defaultTargets,
      ...JSON.parse(storedTargets),
    };
  } catch {
    return defaultTargets;
  }
}

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

function toTargetValue(value: string) {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
}

function getProgressPercent(value: number, target: number) {
  if (target === 0) {
    return 0;
  }

  return Math.min((value / target) * 100, 100);
}

function MonthlyObjectivesPanel({ summary }: MonthlyObjectivesPanelProps) {
  const [targets, setTargets] = useState<MonthlyObjectiveTargets>(loadTargets);
  const [draftTargets, setDraftTargets] =
    useState<MonthlyObjectiveTargets>(targets);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  const objectives: Objective[] = [
    {
      key: 'mttPlayed',
      label: 'MTT played',
      value: summary.totalMttPlayed,
      target: targets.mttPlayed,
      displayValue: `${formatInteger(summary.totalMttPlayed)} / ${formatInteger(targets.mttPlayed)}`,
      icon: Trophy,
    },
    {
      key: 'learningHours',
      label: 'Learning hours',
      value: summary.totalLearningHours,
      target: targets.learningHours,
      displayValue: `${formatNumber(summary.totalLearningHours)} / ${formatNumber(targets.learningHours)}`,
      icon: BookOpen,
    },
    {
      key: 'sportHours',
      label: 'Sport hours',
      value: summary.totalSportHours,
      target: targets.sportHours,
      displayValue: `${formatNumber(summary.totalSportHours)} / ${formatNumber(targets.sportHours)}`,
      icon: Dumbbell,
    },
  ];

  useEffect(() => {
    if (!isEditModalOpen && !isActionsOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsEditModalOpen(false);
        setIsActionsOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditModalOpen, isActionsOpen]);

  useEffect(() => {
    if (!isActionsOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(event.target as Node)
      ) {
        setIsActionsOpen(false);
      }
    }

    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isActionsOpen]);

  function handleOpenEditModal() {
    setDraftTargets(targets);
    setIsActionsOpen(false);
    setIsEditModalOpen(true);
  }

  function handleDraftTargetChange(
    targetKey: keyof MonthlyObjectiveTargets,
    value: string,
  ) {
    setDraftTargets({
      ...draftTargets,
      [targetKey]: toTargetValue(value),
    });
  }

  function handleSubmitTargets(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setTargets(draftTargets);
    localStorage.setItem(targetStorageKey, JSON.stringify(draftTargets));
    setIsEditModalOpen(false);
  }

  return (
    <section className="monthly-objectives-panel">
      <div className="monthly-objectives-header">
        <h2>Monthly objectives</h2>

        <div className="objectives-actions" ref={actionsRef}>
          <button
            className="objectives-settings-button"
            type="button"
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            aria-label="Open monthly objectives actions"
          >
            <Settings size={16} strokeWidth={2.4} />
          </button>

          {isActionsOpen && (
            <div className="objectives-dropdown">
              <button type="button" disabled>
                <Plus size={15} strokeWidth={2.4} />
                Add custom goal
              </button>

              <button type="button" onClick={handleOpenEditModal}>
                <SlidersHorizontal size={15} strokeWidth={2.4} />
                Edit goals
              </button>
            </div>
          )}
        </div>
      </div>

      {objectives.map((objective) => {
        const Icon = objective.icon;
        const progressPercent = getProgressPercent(
          objective.value,
          objective.target,
        );

        return (
          <article className="objective-card" key={objective.key}>
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

      {isEditModalOpen && (
        <div
          className="entry-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsEditModalOpen(false);
            }
          }}
        >
          <section
            className="objectives-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="objectives-modal-header">
              <div>
                <h2>Monthly objectives</h2>
                <p>
                  Goals <span>›</span> <strong>Edit targets</strong>
                </p>
              </div>

              <button
                className="entry-modal-close"
                type="button"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X size={18} strokeWidth={2.4} />
              </button>
            </div>

            <form className="objectives-form" onSubmit={handleSubmitTargets}>
              <label>
                MTT played target
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={draftTargets.mttPlayed}
                  onChange={(event) =>
                    handleDraftTargetChange('mttPlayed', event.target.value)
                  }
                />
              </label>

              <label>
                Learning hours target
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={draftTargets.learningHours}
                  onChange={(event) =>
                    handleDraftTargetChange(
                      'learningHours',
                      event.target.value,
                    )
                  }
                />
              </label>

              <label>
                Sport hours target
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={draftTargets.sportHours}
                  onChange={(event) =>
                    handleDraftTargetChange('sportHours', event.target.value)
                  }
                />
              </label>

              <div className="entry-modal-footer">
                <button
                  className="entry-cancel-button"
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>

                <button className="entry-save-button" type="submit">
                  Save goals
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}

export default MonthlyObjectivesPanel;