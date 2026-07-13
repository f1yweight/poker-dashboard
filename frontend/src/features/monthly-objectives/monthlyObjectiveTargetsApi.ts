import { httpRequest } from '../../shared/api/httpClient';

export type MonthlyObjectiveTargets = {
  id: number;
  targetMonth: string;
  mttPlayedTarget: number;
  learningHoursTarget: number;
  sportHoursTarget: number;
};

export type UpdateMonthlyObjectiveTargetsRequest = {
  mttPlayedTarget: number;
  learningHoursTarget: number;
  sportHoursTarget: number;
};

export function getMonthlyObjectiveTargets(month: string) {
  return httpRequest<MonthlyObjectiveTargets>(
    `/api/monthly-objective-targets?month=${month}`,
  );
}

export function updateMonthlyObjectiveTargets(
  month: string,
  payload: UpdateMonthlyObjectiveTargetsRequest,
) {
  return httpRequest<MonthlyObjectiveTargets>(
    `/api/monthly-objective-targets?month=${month}`,
    {
      method: 'PUT',
      body: payload,
    },
  );
}