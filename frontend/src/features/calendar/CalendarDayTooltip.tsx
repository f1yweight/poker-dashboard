import { BadgeDollarSign, ChartNoAxesCombined, Trophy } from 'lucide-react';

import type { DailyEntryPayload } from '../daily-entry/dailyEntryTypes';

type CalendarDayTooltipProps = {
  dateLabel: string;
  entry: DailyEntryPayload;
};

function formatProfit(value: number | null) {
  if (value === null) {
    return '0';
  }

  const formattedValue = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Math.abs(value));

  if (value > 0) {
    return `+${formattedValue}`;
  }

  if (value < 0) {
    return `-${formattedValue}`;
  }

  return formattedValue;
}

function formatValue(value: number | null) {
  return value === null ? '0' : String(value);
}

function CalendarDayTooltip({ dateLabel, entry }: CalendarDayTooltipProps) {
  const commentPreview =
    entry.comment.trim().length > 80
      ? `${entry.comment.trim().slice(0, 80)}...`
      : entry.comment.trim();

  return (
    <div className="calendar-day-tooltip">
      <div className="calendar-day-tooltip-header">
        <strong>{dateLabel}</strong>

        <span
          className={
            entry.profit !== null && entry.profit < 0
              ? 'calendar-day-tooltip-profit negative'
              : 'calendar-day-tooltip-profit positive'
          }
        >
          {formatProfit(entry.profit)}
          <span className="calendar-day-tooltip-currency">$</span>
        </span>
      </div>

      <div className="calendar-day-tooltip-grid">
        <span>
          <Trophy size={13} strokeWidth={2.4} />
          MTT played
        </span>
        <strong>{formatValue(entry.mttPlayed)}</strong>

        <span>
          <ChartNoAxesCombined size={13} strokeWidth={2.4} />
          EV BB/100
        </span>
        <strong>{formatValue(entry.evBb100)}</strong>

        <span>
          <BadgeDollarSign size={13} strokeWidth={2.4} />
          ABI
        </span>
        <strong>{formatValue(entry.abi)}</strong>
      </div>

      {commentPreview && (
        <p className="calendar-day-tooltip-comment">{commentPreview}</p>
      )}
    </div>
  );
}

export default CalendarDayTooltip;