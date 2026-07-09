export type DailyEntryFormData = {
  mttHours: string;
  mttPlayed: string;
  handsPlayed: string;
  evBb100: string;
  profit: string;
  abi: string;
  learningHours: string;
  sportHours: string;
  comment: string;
};

export type DailyEntryPayload = {
  entryDate: string;
  mttHours: number | null;
  mttPlayed: number | null;
  handsPlayed: number | null;
  evBb100: number | null;
  profit: number | null;
  abi: number | null;
  learningHours: number | null;
  sportHours: number | null;
  comment: string;
};