import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type FormEvent,
} from 'react';
import {
  BookOpen,
  Check,
  Dumbbell,
  ListChecks,
  Plus,
  Settings,
  SlidersHorizontal,
  Trash2,
  Trophy,
  X,
  Target,
} from 'lucide-react';

import type {
  CreateCustomMonthlyGoalRequest,
  CustomMonthlyGoal,
  UpdateCustomMonthlyGoalRequest,
} from '../monthly-objectives/customMonthlyGoalsApi';
import type {
  MonthlyObjectiveTargets,
  UpdateMonthlyObjectiveTargetsRequest,
} from '../monthly-objectives/monthlyObjectiveTargetsApi';

type MonthlySummary = {
  totalMttPlayed: number;
  totalLearningHours: number;
  totalSportHours: number;
};

type MonthlyObjectivesPanelProps = {
  summary: MonthlySummary;
  targets: MonthlyObjectiveTargets;
  customGoals: CustomMonthlyGoal[];
  isLoading: boolean;
  errorMessage: string | null;
  onSaveTargets: (
    payload: UpdateMonthlyObjectiveTargetsRequest,
  ) => Promise<void>;
  onCreateCustomGoal: (
    payload: CreateCustomMonthlyGoalRequest,
  ) => Promise<void>;
  onUpdateCustomGoal: (
    id: number,
    payload: UpdateCustomMonthlyGoalRequest,
  ) => Promise<void>;
  onDeleteCustomGoal: (id: number) => Promise<void>;
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
  customGoals,
  isLoading,
  errorMessage,
  onSaveTargets,
  onCreateCustomGoal,
  onUpdateCustomGoal,
  onDeleteCustomGoal,
}: MonthlyObjectivesPanelProps) {
  const [draftTargets, setDraftTargets] =
    useState<MonthlyObjectiveTargetsFormData>(() => targetsToFormData(targets));
  const [customGoalTitle, setCustomGoalTitle] = useState('');
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isEditTargetsModalOpen, setIsEditTargetsModalOpen] = useState(false);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isCustomGoalsModalOpen, setIsCustomGoalsModalOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  const visibleCustomGoals = customGoals.length <= 2 ? customGoals : [];
  const shouldShowCustomGoalsSummary = customGoals.length > 2;
  const completedCustomGoalsCount = customGoals.filter(
    (goal) => goal.completed,
  ).length;

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

  const completedBuiltInGoalsCount = objectives.filter(
    (objective) => getProgressPercent(objective.value, objective.target) >= 100,
  ).length;

  const totalGoalsCount = objectives.length + customGoals.length;
  const completedGoalsCount =
    completedBuiltInGoalsCount + completedCustomGoalsCount;

  useEffect(() => {
    if (
      !isEditTargetsModalOpen &&
      !isAddGoalModalOpen &&
      !isCustomGoalsModalOpen &&
      !isActionsOpen
    ) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsEditTargetsModalOpen(false);
        setIsAddGoalModalOpen(false);
        setIsCustomGoalsModalOpen(false);
        setIsActionsOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isEditTargetsModalOpen,
    isAddGoalModalOpen,
    isCustomGoalsModalOpen,
    isActionsOpen,
  ]);

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

  function handleOpenEditTargetsModal() {
    setDraftTargets(targetsToFormData(targets));
    setIsActionsOpen(false);
    setIsEditTargetsModalOpen(true);
  }

  function handleOpenAddGoalModal() {
    setCustomGoalTitle('');
    setIsActionsOpen(false);
    setIsAddGoalModalOpen(true);
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

    setIsEditTargetsModalOpen(false);
  }

  async function handleSubmitCustomGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = customGoalTitle.trim();

    if (!trimmedTitle) {
      return;
    }

    await onCreateCustomGoal({
      title: trimmedTitle,
    });

    setCustomGoalTitle('');
    setIsAddGoalModalOpen(false);
  }

  function renderCustomGoal(goal: CustomMonthlyGoal) {
    return (
      <article
        className={[
          'custom-goal-card',
          goal.completed ? 'completed' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        key={goal.id}
      >
        <button
          className="custom-goal-check"
          type="button"
          onClick={() =>
            onUpdateCustomGoal(goal.id, {
              title: goal.title,
              completed: !goal.completed,
            })
          }
          aria-label={
            goal.completed
              ? 'Mark custom goal as incomplete'
              : 'Mark custom goal as completed'
          }
          disabled={isLoading}
        >
          {goal.completed && <Check size={14} strokeWidth={3} />}
        </button>

        <span>{goal.title}</span>

        <button
          className="custom-goal-delete"
          type="button"
          onClick={() => onDeleteCustomGoal(goal.id)}
          aria-label="Delete custom goal"
          disabled={isLoading}
        >
          <Trash2 size={14} strokeWidth={2.4} />
        </button>
      </article>
    );
  }

  return (
    <section className="monthly-objectives-panel">
      <div className="monthly-objectives-header">
        <div>
          <h2>
            <Target size={15} strokeWidth={2.4} />
            Monthly objectives
          </h2>
          <p>
            {completedGoalsCount} / {totalGoalsCount} goals complete
          </p>
        </div>

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
              <button type="button" onClick={handleOpenAddGoalModal}>
                <Plus size={15} strokeWidth={2.4} />
                Add custom goal
              </button>

              <button type="button" onClick={handleOpenEditTargetsModal}>
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
              className={[
                'objective-progress',
                progressPercent >= 100 ? 'completed' : '',
              ]
                .filter(Boolean)
                .join(' ')}
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

      {visibleCustomGoals.length > 0 && (
        <div className="custom-goals-list">
          <div className="custom-goals-list-header">
            <ListChecks size={15} strokeWidth={2.4} />
            <span>Custom goals</span>
          </div>

          {visibleCustomGoals.map(renderCustomGoal)}
        </div>
      )}

      {shouldShowCustomGoalsSummary && (
        <button
          className="custom-goals-summary-card"
          type="button"
          onClick={() => setIsCustomGoalsModalOpen(true)}
        >
          <span className="custom-goals-summary-icon">
            <ListChecks size={18} strokeWidth={2.4} />
          </span>

          <span>
            <strong>Custom goals</strong>
            <small>
              {customGoals.length} goals · {completedCustomGoalsCount} completed
            </small>
          </span>
        </button>
      )}

      {isEditTargetsModalOpen && (
        <div
          className="entry-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsEditTargetsModalOpen(false);
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
                onClick={() => setIsEditTargetsModalOpen(false)}
              >
                <X size={18} strokeWidth={2.4} />
              </button>
            </div>

            <form className="objectives-form" onSubmit={handleSubmitTargets}>
              <label>
                <span className="objectives-field-label">
                    <Trophy size={15} strokeWidth={2.4} />
                    MTT played target
                </span>
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
                <span className="objectives-field-label">
                    <BookOpen size={15} strokeWidth={2.4} />
                    Learning hours target
                </span>
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
                <span className="objectives-field-label">
                    <Dumbbell size={15} strokeWidth={2.4} />
                    Sport hours target
                </span>
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
                  onClick={() => setIsEditTargetsModalOpen(false)}
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

      {isAddGoalModalOpen && (
        <div
          className="entry-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsAddGoalModalOpen(false);
            }
          }}
        >
          <section
            className="objectives-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="objectives-modal-header">
              <div>
                <h2>Custom goal</h2>
                <p>
                  Goals <span>›</span> <strong>Add custom goal</strong>
                </p>
              </div>

              <button
                className="entry-modal-close"
                type="button"
                onClick={() => setIsAddGoalModalOpen(false)}
              >
                <X size={18} strokeWidth={2.4} />
              </button>
            </div>

            <form
              className="objectives-form"
              onSubmit={handleSubmitCustomGoal}
            >
              <label>
                <span className="objectives-field-label">
                    <ListChecks size={15} strokeWidth={2.4} />
                    Goal title
                </span>
                <input
                  type="text"
                  value={customGoalTitle}
                  onChange={(event) => setCustomGoalTitle(event.target.value)}
                  placeholder="Review RVBB spot"
                />
              </label>

              {errorMessage && <p className="objectives-error">{errorMessage}</p>}

              <div className="entry-modal-footer">
                <button
                  className="entry-cancel-button"
                  type="button"
                  onClick={() => setIsAddGoalModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>

                <button
                  className="entry-save-button"
                  type="submit"
                  disabled={isLoading || !customGoalTitle.trim()}
                >
                  {isLoading ? 'Saving...' : 'Save goal'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {isCustomGoalsModalOpen && (
        <div
          className="entry-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsCustomGoalsModalOpen(false);
            }
          }}
        >
          <section
            className="objectives-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="objectives-modal-header">
              <div>
                <h2>Custom goals</h2>
                <p>
                  Goals <span>›</span>{' '}
                  <strong>{completedCustomGoalsCount} completed</strong>
                </p>
              </div>

              <button
                className="entry-modal-close"
                type="button"
                onClick={() => setIsCustomGoalsModalOpen(false)}
              >
                <X size={18} strokeWidth={2.4} />
              </button>
            </div>

            <div className="custom-goals-modal-list">
              {customGoals.map(renderCustomGoal)}
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default MonthlyObjectivesPanel;