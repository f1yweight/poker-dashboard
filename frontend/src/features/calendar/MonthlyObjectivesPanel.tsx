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

import type {
  MonthlyObjectiveTargets,
  UpdateMonthlyObjectiveTargetsRequest,
} from './monthlyObjectiveTargetsApi';

type MonthlySummary = {
  totalMttPlayed: number;
  totalLearningHours: number;
  totalSportHours: number;
};

type MonthlyObjectivesPanelProps = {
  summary: MonthlySummary;
  targets: MonthlyObjectiveTargets;
  isLoading: boolean;
  errorMessage: string | null;
  onSaveTargets: (
    payload: UpdateMonthlyObjectiveTargetsRequest,
  ) => Promise<void>;
};

type MonthlyObjectiveTargetsFormData = {
  mttPlayedTarget: string;
  learningHoursTarget: string;
  sportHoursTarget: string;
};

type Objective = {
  key: keyof MonthlyObjectiveTargetsFormData;
  label: string;
  value: number;
  target: number;
  displayValue: string;
  icon: ElementType;
};

function targetsToFormData(
  targets: MonthlyObjectiveTargets,
): MonthlyObjectiveTargetsFormData {
  return {
    mttPlayedTarget: String(targets.mttPlayedTarget),
    learningHoursTarget: String(targets.learningHoursTarget),
    sportHoursTarget: String(targets.sportHoursTarget),
  };
}

function toNumberOrZero(value: string) {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
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

function getProgressPercent(value: number, target: number) {
  if (target === 0) {
    return 0;
  }

  return Math.min((value / target) * 100, 100);
}

function MonthlyObjectivesPanel({
  summary,
  targets,
  isLoading,
  errorMessage,
  onSaveTargets,
}: MonthlyObjectivesPanelProps) {
  const [draftTargets, setDraftTargets] =
    useState<MonthlyObjectiveTargetsFormData>(() => targetsToFormData(targets));
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  const objectives: Objective[] = [
    {
      key: 'mttPlayedTarget',
      label: 'MTT played',
      value: summary.totalMttPlayed,
      target: targets.mttPlayedTarget,
      displayValue: `${formatInteger(summary.totalMttPlayed)} / ${formatInteger(targets.mttPlayedTarget)}`,
      icon: Trophy,
    },
    {
      key: 'learningHoursTarget',
      label: 'Learning hours',
      value: summary.totalLearningHours,
      target: targets.learningHoursTarget,
      displayValue: `${formatNumber(summary.totalLearningHours)} / ${formatNumber(targets.learningHoursTarget)}`,
      icon: BookOpen,
    },
    {
      key: 'sportHoursTarget',
      label: 'Sport hours',
      value: summary.totalSportHours,
      target: targets.sportHoursTarget,
      displayValue: `${formatNumber(summary.totalSportHours)} / ${formatNumber(targets.sportHoursTarget)}`,
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
    setDraftTargets(targetsToFormData(targets));
    setIsActionsOpen(false);
    setIsEditModalOpen(true);
  }

  function handleDraftTargetChange(
    targetKey: keyof MonthlyObjectiveTargetsFormData,
    value: string,
  ) {
    setDraftTargets({
      ...draftTargets,
      [targetKey]: value,
    });
  }

  async function handleSubmitTargets(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSaveTargets({
      mttPlayedTarget: toNumberOrZero(draftTargets.mttPlayedTarget),
      learningHoursTarget: toNumberOrZero(draftTargets.learningHoursTarget),
      sportHoursTarget: toNumberOrZero(draftTargets.sportHoursTarget),
    });

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
            disabled={isLoading}
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

      {errorMessage && <p className="objectives-error">{errorMessage}</p>}

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
                  value={draftTargets.mttPlayedTarget}
                  onChange={(event) =>
                    handleDraftTargetChange(
                      'mttPlayedTarget',
                      event.target.value,
                    )
                  }
                />
              </label>

              <label>
                Learning hours target
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={draftTargets.learningHoursTarget}
                  onChange={(event) =>
                    handleDraftTargetChange(
                      'learningHoursTarget',
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
                  value={draftTargets.sportHoursTarget}
                  onChange={(event) =>
                    handleDraftTargetChange(
                      'sportHoursTarget',
                      event.target.value,
                    )
                  }
                />
              </label>

              {errorMessage && <p className="objectives-error">{errorMessage}</p>}

              <div className="entry-modal-footer">
                <button
                  className="entry-cancel-button"
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>

                <button
                  className="entry-save-button"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save goals'}
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