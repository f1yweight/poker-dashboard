type MonthNavigationProps = {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
};

function MonthNavigation({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
}: MonthNavigationProps) {
  const monthLabel = currentMonth.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="month-header">
      <button type="button" onClick={onPreviousMonth}>
        Previous
      </button>
      <h2>{monthLabel}</h2>
      <button type="button" onClick={onNextMonth}>
        Next
      </button>
    </div>
  );
}

export default MonthNavigation;