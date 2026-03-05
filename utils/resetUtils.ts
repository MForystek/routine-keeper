import {Routine} from "../types/routine";

export function shouldReset(routine: Routine): boolean {
    const today = new Date();
    const last = new Date(routine.lastResetDate);

    if (routine.schedule.type === 'daily') {
        return today.toDateString() !== last.toDateString();
    }

    const getMonday = (d: Date): Date => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = (day === 0 ? -6 : 1 - day);
        date.setDate(date.getDate() + diff);
        date.setHours(0, 0, 0, 0);
        return date;
    };

    return getMonday(today).getTime() !== getMonday(last).getTime();
}

export function resetRoutine(routine: Routine): Routine {
    return {
        ...routine,
        completedCount: 0,
        lastResetDate: new Date().toISOString().split('T')[0],
        completedDays: [],
    };
}