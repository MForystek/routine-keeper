import {Activity} from "../types/activity";

export function shouldReset(activity: Activity): boolean {
    const today = new Date();
    const last = new Date(activity.lastResetDate);

    if (activity.schedule.type === 'daily') {
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

export function resetActivity(activity: Activity): Activity {
    return {
        ...activity,
        completedCount: 0,
        lastResetDate: new Date().toISOString().split('T')[0],
        completedDays: [],
    };
}