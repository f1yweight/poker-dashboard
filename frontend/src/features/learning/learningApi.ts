import { httpRequest } from '../../shared/api/httpClient';
import type {
  LearningResource,
  LearningResourcePayload,
  LearningResourceStatus,
} from './learningTypes';

export function getLearningResources(status?: LearningResourceStatus) {
  const query = status ? `?status=${status}` : '';

  return httpRequest<LearningResource[]>(`/api/learning-resources${query}`);
}

export function createLearningResource(payload: LearningResourcePayload) {
  return httpRequest<LearningResource>('/api/learning-resources', {
    method: 'POST',
    body: payload,
  });
}

export function updateLearningResource(
  id: number,
  payload: LearningResourcePayload,
) {
  return httpRequest<LearningResource>(`/api/learning-resources/${id}`, {
    method: 'PATCH',
    body: payload,
  });
}

export function deleteLearningResource(id: number) {
  return httpRequest<void>(`/api/learning-resources/${id}`, {
    method: 'DELETE',
  });
}