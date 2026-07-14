import { formatDateForApi } from '../../shared/date/dateUtils';
import { getCalendarDays } from './calendarUtils';

import CalendarDayTooltip from './CalendarDayTooltip';

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

        const dayDateLabel = dayDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });

        const today = new Date();
        const todayDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
        );

        const isFutureDay = dayDate > todayDate;

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
              isFutureDay ? 'future' : '',
              getEntryClassName(entry),
            ]
              .filter(Boolean)
              .join(' ')}
            key={day}
            type="button"
            disabled={isFutureDay}
            onClick={() => onSelectDay(day)}
          >
            <span className="calendar-day-number">{day}</span>

            {entry && <span className="calendar-day-dot" />}

            {entry?.profit !== null && entry?.profit !== undefined && (
              <span className="calendar-day-profit">
                {entry.profit > 0 ? '+' : ''}
                {entry.profit}
              </span>
            )}

            {entry && <CalendarDayTooltip dateLabel={dayDateLabel} entry={entry} />}
          </button>
        );
      })}
    </div>
  );
}

export default MonthCalendar;