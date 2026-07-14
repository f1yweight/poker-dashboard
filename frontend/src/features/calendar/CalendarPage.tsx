import { useEffect, useState } from 'react';

import AppHeader from '../../components/AppHeader';
import {
  formatDateForApi,
  getMonthEndDate,
  getMonthStartDate,
} from '../../shared/date/dateUtils';
import {
  getDailyEntriesByDateRange,
  saveDailyEntry,
  type DailyEntryResponse,
} from '../daily-entry/dailyEntryApi';
import DailyEntryForm from '../daily-entry/DailyEntryForm';
import type { DailyEntryPayload } from '../daily-entry/dailyEntryTypes';
import MonthCalendar from './MonthCalendar';
import MonthNavigation from './MonthNavigation';
import MonthlySummaryPanel from './MonthlySummaryPanel';
import { calculateMonthlySummary } from './monthlySummaryUtils';
import MonthlyObjectivesPanel from './MonthlyObjectivesPanel';
import ProfitTrajectoryPanel from './ProfitTrajectoryPanel';
import {
  getMonthlyObjectiveTargets,
  updateMonthlyObjectiveTargets,
  type MonthlyObjectiveTargets,
  type UpdateMonthlyObjectiveTargetsRequest,
} from '../monthly-objectives/monthlyObjectiveTargetsApi';
import {
  createCustomMonthlyGoal,
  deleteCustomMonthlyGoal,
  getCustomMonthlyGoals,
  updateCustomMonthlyGoal,
  type CustomMonthlyGoal,
  type CreateCustomMonthlyGoalRequest,
  type UpdateCustomMonthlyGoalRequest,
} from '../monthly-objectives/customMonthlyGoalsApi';

type CalendarPageProps = {
  onLogout: () => void;
};

function dailyEntryResponseToPayload(
  response: DailyEntryResponse,
): DailyEntryPayload {
  return {
    entryDate: response.entryDate,
    mttHours: response.mttHours,
    mttPlayed: response.mttPlayed,
    handsPlayed: response.handsPlayed,
    evBb100: response.evBb100,
    profit: response.profit,
    abi: response.abi,
    learningHours: response.learningHours,
    sportHours: response.sportHours,
    comment: response.comment ?? '',
  };
}

const defaultObjectiveTargets: MonthlyObjectiveTargets = {
  id: 0,
  targetMonth: '',
  mttPlayedTarget: 400,
  learningHoursTarget: 10,
  sportHoursTarget: 5,
};

function CalendarPage({ onLogout }: CalendarPageProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1));
  const [selectedDay, setSelectedDay] = useState(9);

  const [entriesByDate, setEntriesByDate] = useState<
    Record<string, DailyEntryPayload>
  >({});

  const [lastSavedEntryDate, setLastSavedEntryDate] = useState<string | null>(
    null,
  );

  const [isSavingEntry, setIsSavingEntry] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  const [isLoadingEntry, setIsLoadingEntry] = useState(false);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);

  const selectedDate = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    selectedDay,
  );

  const selectedEntryDate = formatDateForApi(selectedDate);
  const selectedMonthDate = formatDateForApi(getMonthStartDate(currentMonth));
  const selectedEntry = entriesByDate[selectedEntryDate];
  const isSelectedEntrySaved = lastSavedEntryDate === selectedEntryDate;
  const summary = calculateMonthlySummary(entriesByDate);

  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  const [objectiveTargets, setObjectiveTargets] =
    useState<MonthlyObjectiveTargets>(defaultObjectiveTargets);

  const [isLoadingObjectiveTargets, setIsLoadingObjectiveTargets] =
    useState(false);

  const [objectiveTargetsErrorMessage, setObjectiveTargetsErrorMessage] =
    useState<string | null>(null);

  const [customGoals, setCustomGoals] = useState<CustomMonthlyGoal[]>([]);
  const [isLoadingCustomGoals, setIsLoadingCustomGoals] = useState(false);
  const [customGoalsErrorMessage, setCustomGoalsErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadMonthEntries() {
      setIsLoadingEntry(true);
      setLoadErrorMessage(null);

      const startDate = formatDateForApi(getMonthStartDate(currentMonth));
      const endDate = formatDateForApi(getMonthEndDate(currentMonth));

      try {
        const responses = await getDailyEntriesByDateRange(startDate, endDate);

        const nextEntries = responses.reduce<Record<string, DailyEntryPayload>>(
          (entries, response) => {
            const payload = dailyEntryResponseToPayload(response);
            entries[payload.entryDate] = payload;
            return entries;
          },
          {},
        );

        setEntriesByDate(nextEntries);
      } catch {
        setLoadErrorMessage('Could not load month. Please try again.');
      } finally {
        setIsLoadingEntry(false);
      }
    }

    void loadMonthEntries();
  }, [currentMonth]);

  useEffect(() => {
    async function loadObjectiveTargets() {
      setIsLoadingObjectiveTargets(true);
      setObjectiveTargetsErrorMessage(null);

      try {
        const targets = await getMonthlyObjectiveTargets(selectedMonthDate);
        setObjectiveTargets(targets);
      } catch {
        setObjectiveTargets(defaultObjectiveTargets);
        setObjectiveTargetsErrorMessage(
          'Could not load monthly objectives. Please try again.',
        );
      } finally {
        setIsLoadingObjectiveTargets(false);
      }
    }

    void loadObjectiveTargets();
  }, [selectedMonthDate]);

  useEffect(() => {
    async function loadCustomGoals() {
      setIsLoadingCustomGoals(true);
      setCustomGoalsErrorMessage(null);

      try {
        const goals = await getCustomMonthlyGoals(selectedMonthDate);
        setCustomGoals(goals);
      } catch {
        setCustomGoals([]);
        setCustomGoalsErrorMessage(
          'Could not load custom goals. Please try again.',
        );
      } finally {
        setIsLoadingCustomGoals(false);
      }
    }

    void loadCustomGoals();
  }, [selectedMonthDate]);

  function handlePreviousMonth() {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
    setSelectedDay(1);
  }

  function handleNextMonth() {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
    setSelectedDay(1);
  }

  async function handleSaveEntry(payload: DailyEntryPayload) {
    setIsSavingEntry(true);
    setSaveErrorMessage(null);

    try {
      await saveDailyEntry(payload);

      setEntriesByDate({
        ...entriesByDate,
        [payload.entryDate]: payload,
      });

      setLastSavedEntryDate(payload.entryDate);
    } catch {
      setSaveErrorMessage('Could not save day. Please try again.');
    } finally {
      setIsSavingEntry(false);
    }
  }

  async function handleSaveObjectiveTargets(
    payload: UpdateMonthlyObjectiveTargetsRequest,
  ) {
    setIsLoadingObjectiveTargets(true);
    setObjectiveTargetsErrorMessage(null);

    try {
      const savedTargets = await updateMonthlyObjectiveTargets(
        selectedMonthDate,
        payload,
      );

      setObjectiveTargets(savedTargets);
    } catch {
      setObjectiveTargetsErrorMessage(
        'Could not save monthly objectives. Please try again.',
      );
    } finally {
      setIsLoadingObjectiveTargets(false);
    }
  }

  async function handleCreateCustomGoal(
    payload: CreateCustomMonthlyGoalRequest,
  ) {
    setIsLoadingCustomGoals(true);
    setCustomGoalsErrorMessage(null);

    try {
      const createdGoal = await createCustomMonthlyGoal(
        selectedMonthDate,
        payload,
      );

      setCustomGoals([...customGoals, createdGoal]);
    } catch {
      setCustomGoalsErrorMessage(
        'Could not create custom goal. Please try again.',
      );
    } finally {
      setIsLoadingCustomGoals(false);
    }
  }

  async function handleUpdateCustomGoal(
    id: number,
    payload: UpdateCustomMonthlyGoalRequest,
  ) {
    setIsLoadingCustomGoals(true);
    setCustomGoalsErrorMessage(null);

    try {
      const updatedGoal = await updateCustomMonthlyGoal(id, payload);

      setCustomGoals(
        customGoals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal)),
      );
    } catch {
      setCustomGoalsErrorMessage(
        'Could not update custom goal. Please try again.',
      );
    } finally {
      setIsLoadingCustomGoals(false);
    }
  }

  async function handleDeleteCustomGoal(id: number) {
    setIsLoadingCustomGoals(true);
    setCustomGoalsErrorMessage(null);

    try {
      await deleteCustomMonthlyGoal(id);

      setCustomGoals(customGoals.filter((goal) => goal.id !== id));
    } catch {
      setCustomGoalsErrorMessage(
        'Could not delete custom goal. Please try again.',
      );
    } finally {
      setIsLoadingCustomGoals(false);
    }
  }

  function handleSelectDay(day: number) {
    setSelectedDay(day);
    setIsEntryModalOpen(true);
  }

  function handleCloseEntryModal() {
    setIsEntryModalOpen(false);
  }

  return (
    <div className="app">
      <AppHeader onLogout={onLogout} />

      <main className="dashboard-layout">
        <div className="dashboard-grid">
          <MonthlyObjectivesPanel
            summary={summary}
            targets={objectiveTargets}
            customGoals={customGoals}
            isLoading={isLoadingObjectiveTargets || isLoadingCustomGoals}
            errorMessage={objectiveTargetsErrorMessage ?? customGoalsErrorMessage}
            onSaveTargets={handleSaveObjectiveTargets}
            onCreateCustomGoal={handleCreateCustomGoal}
            onUpdateCustomGoal={handleUpdateCustomGoal}
            onDeleteCustomGoal={handleDeleteCustomGoal}
          />

          <section className="calendar-section">
            <MonthNavigation
              currentMonth={currentMonth}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
            />

            <MonthCalendar
              currentMonth={currentMonth}
              selectedDay={selectedDay}
              entriesByDate={entriesByDate}
              onSelectDay={handleSelectDay}
            />
          </section>

          <ProfitTrajectoryPanel entriesByDate={entriesByDate} />
        </div>

        <MonthlySummaryPanel summary={summary} />

        {isEntryModalOpen && (
          <div className="modal-backdrop">
            <div className="entry-modal">
              <DailyEntryForm
                key={`${selectedEntryDate}-${selectedEntry ? 'loaded' : 'empty'}`}
                currentMonth={currentMonth}
                selectedDay={selectedDay}
                selectedEntry={selectedEntry}
                isSaved={isSelectedEntrySaved}
                isSaving={isSavingEntry}
                isLoading={isLoadingEntry}
                errorMessage={saveErrorMessage ?? loadErrorMessage}
                onSave={handleSaveEntry}
                onClose={handleCloseEntryModal}
              />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default CalendarPage;