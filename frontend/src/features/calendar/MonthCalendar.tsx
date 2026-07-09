import { formatDateForApi } from '../../shared/date/dateUtils';
import { getCalendarDays } from './calendarUtils';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type MonthCalendarProps = {
  currentMonth: Date;
  selectedDay: number;
  entryDates: string[];
  onSelectDay: (day: number) => void;
};

function MonthCalendar({
  currentMonth,
  selectedDay,
  entryDates,
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
        const hasEntry = entryDates.includes(dayDateKey);

        return (
          <button
            className={[
              'calendar-day',
              day === selectedDay ? 'selected' : '',
              hasEntry ? 'has-entry' : '',
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