export type LearningResourceStatus = 'TO_WATCH' | 'IN_PROGRESS' | 'DONE';

export type LearningResource = {
  id: number;
  title: string;
  url: string;
  description: string | null;
  category: string | null;
  status: LearningResourceStatus;
  createdAt: string;
  updatedAt: string;
};

export type LearningResourcePayload = {
  title: string;
  url: string;
  description: string | null;
  category: string | null;
  status: LearningResourceStatus;
};