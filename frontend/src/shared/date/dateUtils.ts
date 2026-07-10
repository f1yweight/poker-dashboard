export function formatDateForApi(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getMonthStartDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getMonthEndDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}