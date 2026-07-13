import type { DailyEntryPayload } from '../daily-entry/dailyEntryTypes';

export type MonthlySummary = {
  sessions: number;
  totalMttPlayed: number;
  totalHandsPlayed: number;
  averageEvBb100: number | null;
  totalProfit: number;
  averageAbi: number | null;
  totalMttHours: number;
  totalLearningHours: number;
  totalSportHours: number;
};

function valueOrZero(value: number | null) {
  return value ?? 0;
}

function hasPokerActivity(entry: DailyEntryPayload) {
  return (
    valueOrZero(entry.mttHours) > 0 ||
    valueOrZero(entry.mttPlayed) > 0 ||
    valueOrZero(entry.handsPlayed) > 0
  );
}

function average(values: number[]) {
  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function calculateMonthlySummary(
  entriesByDate: Record<string, DailyEntryPayload>,
): MonthlySummary {
  const entries = Object.values(entriesByDate);

  const evValues = entries
    .map((entry) => entry.evBb100)
    .filter((value): value is number => value !== null);

  const abiValues = entries
    .map((entry) => entry.abi)
    .filter((value): value is number => value !== null);

  return {
    sessions: entries.filter(hasPokerActivity).length,
    totalMttPlayed: entries.reduce(
      (sum, entry) => sum + valueOrZero(entry.mttPlayed),
      0,
    ),
    totalHandsPlayed: entries.reduce(
      (sum, entry) => sum + valueOrZero(entry.handsPlayed),
      0,
    ),
    averageEvBb100: average(evValues),
    totalProfit: entries.reduce(
      (sum, entry) => sum + valueOrZero(entry.profit),
      0,
    ),
    averageAbi: average(abiValues),
    totalMttHours: entries.reduce(
      (sum, entry) => sum + valueOrZero(entry.mttHours),
      0,
    ),
    totalLearningHours: entries.reduce(
      (sum, entry) => sum + valueOrZero(entry.learningHours),
      0,
    ),
    totalSportHours: entries.reduce(
      (sum, entry) => sum + valueOrZero(entry.sportHours),
      0,
    ),
  };
}