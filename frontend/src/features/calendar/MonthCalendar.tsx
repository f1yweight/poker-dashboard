import { getCalendarDays } from './calendarUtils';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type MonthCalendarProps = {
  currentMonth: Date;
  selectedDay: number;
  onSelectDay: (day: number) => void;
};

function MonthCalendar({
  currentMonth,
  selectedDay,
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

        return (
          <button
            className={
              day === selectedDay ? 'calendar-day selected' : 'calendar-day'
            }
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