import { useState } from 'react';

import type { DailyEntryPayload } from '../daily-entry/dailyEntryTypes';

import { formatDateForApi } from '../../shared/date/dateUtils';
import { saveDailyEntry } from '../daily-entry/dailyEntryApi';

import AppHeader from '../../components/AppHeader';
import DailyEntryForm from '../daily-entry/DailyEntryForm';
import MonthCalendar from './MonthCalendar';
import MonthNavigation from './MonthNavigation';

type CalendarPageProps = {
  onLogout: () => void;
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

  const selectedDate = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    selectedDay,
  );

  const selectedEntryDate = formatDateForApi(selectedDate);
  const selectedEntry = entriesByDate[selectedEntryDate];
  const isSelectedEntrySaved = lastSavedEntryDate === selectedEntryDate;

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

  return (
    <div className="app">
      <AppHeader onLogout={onLogout} />

      <main className="dashboard-layout">
        <section className="calendar-section">
          <MonthNavigation
            currentMonth={currentMonth}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
          />

          <MonthCalendar
            currentMonth={currentMonth}
            selectedDay={selectedDay}
            entryDates={Object.keys(entriesByDate)}
            onSelectDay={setSelectedDay}
          />
        </section>

        <DailyEntryForm
          key={selectedEntryDate}
          currentMonth={currentMonth}
          selectedDay={selectedDay}
          selectedEntry={selectedEntry}
          isSaved={isSelectedEntrySaved}
          isSaving={isSavingEntry}
          errorMessage={saveErrorMessage}
          onSave={handleSaveEntry}
        />
      </main>
    </div>
  );
}

export default CalendarPage;