import {Routine} from "../types/routine";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ROUTINES_KEY = 'routines';

export async function getRoutines(): Promise<Routine[]> {
    const json = await AsyncStorage.getItem(ROUTINES_KEY);
    return json ? JSON.parse(json) : [];
}

export async function saveRoutines(routines: Routine[]): Promise<void> {
    const json = JSON.stringify(routines);
    await AsyncStorage.setItem(ROUTINES_KEY, json);
}

export async function addRoutine(routine: Routine): Promise<void> {
    const routines = await getRoutines();
    await saveRoutines([...routines, routine]);
}

export async function updateRoutine(updated: Routine): Promise<void> {
    const routines = await getRoutines();
    const newList = routines.map(a => a.id === updated.id ? updated : a);
    await saveRoutines(newList);
}

export async function deleteRoutine(id: string): Promise<void> {
    const routines = await getRoutines();
    const newList = routines.filter(a => a.id !== id);
    await saveRoutines(newList);
}