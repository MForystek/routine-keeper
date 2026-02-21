import {Activity} from "../types/activity";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACTIVITIES_KEY = 'activities';

export async function getActivities(): Promise<Activity[]> {
    const json = await AsyncStorage.getItem(ACTIVITIES_KEY);
    return json ? JSON.parse(json) : [];
}

export async function saveActivities(activities: Activity[]): Promise<void> {
    const json = JSON.stringify(activities);
    await AsyncStorage.setItem(ACTIVITIES_KEY, json);
}

export async function addActivity(activity: Activity): Promise<void> {
    const activities = await getActivities();
    await saveActivities([...activities, activity]);
}

export async function updateActivity(updated: Activity): Promise<void> {
    const activities = await getActivities();
    const newList = activities.map(a => a.id === updated.id ? updated : a);
    await saveActivities(newList);
}

export async function deleteActivity(id: string): Promise<void> {
    const activities = await getActivities();
    const newList = activities.filter(a => a.id !== id);
    await saveActivities(newList);
}