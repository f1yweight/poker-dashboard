import { httpRequest } from '../../shared/api/httpClient';

export type CustomMonthlyGoal = {
  id: number;
  targetMonth: string;
  title: string;
  completed: boolean;
};

export type CreateCustomMonthlyGoalRequest = {
  title: string;
};

export type UpdateCustomMonthlyGoalRequest = {
  title: string;
  completed: boolean;
};

export function getCustomMonthlyGoals(month: string) {
  return httpRequest<CustomMonthlyGoal[]>(
    `/api/custom-monthly-goals?month=${month}`,
  );
}

export function createCustomMonthlyGoal(
  month: string,
  payload: CreateCustomMonthlyGoalRequest,
) {
  return httpRequest<CustomMonthlyGoal>(
    `/api/custom-monthly-goals?month=${month}`,
    {
      method: 'POST',
      body: payload,
    },
  );
}

export function updateCustomMonthlyGoal(
  id: number,
  payload: UpdateCustomMonthlyGoalRequest,
) {
  return httpRequest<CustomMonthlyGoal>(`/api/custom-monthly-goals/${id}`, {
    method: 'PATCH',
    body: payload,
  });
}

export function deleteCustomMonthlyGoal(id: number) {
  return httpRequest<void>(`/api/custom-monthly-goals/${id}`, {
    method: 'DELETE',
  });
}