type MonthNavigationProps = {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
};

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
});

function MonthNavigation({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
}: MonthNavigationProps) {
  const monthLabel = monthFormatter.format(currentMonth);

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