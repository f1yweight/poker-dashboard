import { formatDateForApi } from '../../shared/date/dateUtils';
import { getCalendarDays } from './calendarUtils';

import type { DailyEntryPayload } from '../daily-entry/dailyEntryTypes';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type MonthCalendarProps = {
  currentMonth: Date;
  selectedDay: number;
  entriesByDate: Record<string, DailyEntryPayload>;
  onSelectDay: (day: number) => void;
};

function MonthCalendar({
  currentMonth,
  selectedDay,
  entriesByDate,
  onSelectDay,
}: MonthCalendarProps) {
  const calendarDays = getCalendarDays(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
  );

  return (
    <div className="calendar-grid">
      {weekdays.map((weekday) => (
        <div className="weekday" key={weekday}>
          {weekday}
        </div>
      ))}

      {calendarDays.map((day, index) => {
        if (day === null) {
          return (
            <button
              className="calendar-day empty"
              key={`empty-${index}`}
              type="button"
            />
          );
        }

        const dayDate = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          day,
        );

        const dayDateKey = formatDateForApi(dayDate);
        const entry = entriesByDate[dayDateKey];

        function getEntryClassName(entry: DailyEntryPayload | undefined) {
          if (!entry) {
            return '';
          }

          if (entry.profit === null || entry.profit === 0) {
            return 'has-entry';
          }

          return entry.profit > 0 ? 'has-positive-entry' : 'has-negative-entry';
        }

        return (
          <button
            className={[
              'calendar-day',
              day === selectedDay ? 'selected' : '',
              getEntryClassName(entry),
            ]
              .filter(Boolean)
              .join(' ')}
            key={day}
            type="button"
            onClick={() => onSelectDay(day)}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
}

export default MonthCalendar;