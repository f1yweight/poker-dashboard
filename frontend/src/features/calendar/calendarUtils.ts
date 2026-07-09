export function getCalendarDays(year: number, monthIndex: number) {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const mondayBasedWeekday = (firstDayOfMonth.getDay() + 6) % 7;

  const emptyDays = Array.from({ length: mondayBasedWeekday }, () => null);
  const monthDays = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  return [...emptyDays, ...monthDays];
}