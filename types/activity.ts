export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type Schedule =
    | { type: 'daily'}
    | { type: 'weekly'; timesPerWeek: number}
    | { type: 'specific_weekdays'; days: DayOfWeek[] };

export interface Activity {
    id: string;
    name: string;
    schedule: Schedule;
    targetCount: number;
    completedCount: number;
    lastResetDate: string;
    completedDays: DayOfWeek[];
}