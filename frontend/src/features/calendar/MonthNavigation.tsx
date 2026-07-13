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
      <button
        className="month-nav-button"
        type="button"
        onClick={onPreviousMonth}
        aria-label="Previous month"
      >
        ‹
      </button>

      <h2>{monthLabel}</h2>

      <button
        className="month-nav-button"
        type="button"
        onClick={onNextMonth}
        aria-label="Next month"
      >
        ›
      </button>
    </div>
  );
}

export default MonthNavigation;