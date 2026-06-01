export interface Habit {
  id: string;
  name: string;
  emoji: string;
  goal: number;
}

export interface CompletionData {
  [dateKey: string]: {
    [habitId: string]: boolean;
  };
}

export interface WeekData {
  weekNumber: number;
  days: Date[];
}
