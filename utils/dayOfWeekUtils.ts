import {DayOfWeek} from "../types/routine";

export const WEEKDAYS_IN_ORDER: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export function compareDaysOfWeek(a: DayOfWeek, b: DayOfWeek): number {
    return WEEKDAYS_IN_ORDER.indexOf(a) - WEEKDAYS_IN_ORDER.indexOf(b);
}