import { useState } from 'react';

import AppHeader from '../../components/AppHeader';
import DailyEntryForm from '../daily-entry/DailyEntryForm';
import MonthCalendar from './MonthCalendar';
import MonthNavigation from './MonthNavigation';

function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1));
  const [selectedDay, setSelectedDay] = useState(9);

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
            onSelectDay={setSelectedDay}
          />
        </section>

        <DailyEntryForm currentMonth={currentMonth} selectedDay={selectedDay} />
      </main>
    </div>
  );
}

export default CalendarPage;