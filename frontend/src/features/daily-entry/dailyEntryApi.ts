import { httpRequest } from '../../shared/api/httpClient';
import type { DailyEntryPayload } from './dailyEntryTypes';

export type DailyEntryResponse = {
  id: number;
  entryDate: string;
  mttHours: number | null;
  mttPlayed: number | null;
  handsPlayed: number | null;
  evBb100: number | null;
  profit: number | null;
  abi: number | null;
  learningHours: number | null;
  sportHours: number | null;
  comment: string | null;
};

export function saveDailyEntry(payload: DailyEntryPayload) {
  return httpRequest<DailyEntryResponse>('/api/daily-entries', {
    method: 'POST',
    body: payload,
  });
}

export function getDailyEntriesByDateRange(
  startDate: string,
  endDate: string,
) {
  return httpRequest<DailyEntryResponse[]>(
    `/api/daily-entries?startDate=${startDate}&endDate=${endDate}`,
  );
}