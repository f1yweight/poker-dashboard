export function formatDateForApi(date: Date) {
  return date.toISOString().slice(0, 10);
}