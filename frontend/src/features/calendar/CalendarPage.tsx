import { useState } from 'react';

import type { DailyEntryPayload } from '../daily-entry/dailyEntryTypes';

import { formatDateForApi } from '../../shared/date/dateUtils';

import AppHeader from '../../components/AppHeader';
import DailyEntryForm from '../daily-entry/DailyEntryForm';
import MonthCalendar from './MonthCalendar';
import MonthNavigation from './MonthNavigation';

function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1));
  const [selectedDay, setSelectedDay] = useState(9);
  const [entriesByDate, setEntriesByDate] = useState<
    Record<string, DailyEntryPayload>
  >({});
  const [lastSavedEntryDate, setLastSavedEntryDate] = useState<string | null>(
    null,
  );

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

  function handleSaveEntry(payload: DailyEntryPayload) {
    setEntriesByDate({
      ...entriesByDate,
      [payload.entryDate]: payload,
    });

    setLastSavedEntryDate(payload.entryDate);
  }

  return (
    <div className="app">
      <AppHeader />

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
          onSave={handleSaveEntry}
        />
      </main>
    </div>
  );
}

export default CalendarPage;