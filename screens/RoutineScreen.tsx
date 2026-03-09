import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useCallback, useMemo, useState} from "react";
import {Routine, DayOfWeek} from "../types/routine";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {deleteRoutine, getRoutines, saveRoutines, updateRoutine} from "../storage/routineStorage";
import {Colors} from "../theme/colors";
import RoutineCard from "../components/RoutineCard";
import {resetRoutine, shouldReset} from "../utils/resetUtils";
import DraggableFlatList from "react-native-draggable-flatlist/src/components/DraggableFlatList";
import {DragEndParams, ScaleDecorator} from "react-native-draggable-flatlist";
import {RenderItemParams} from "react-native-draggable-flatlist/src";
import RoutinesEmptyState from "../components/RoutinesEmptyState";

type RoutineScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RoutineScreen() {
    const navigation = useNavigation<RoutineScreenNavigationProp>();

    const [routines, setRoutines] = useState<Routine[]>([]);

    const undoneRoutines = useMemo(() => routines.filter(r => r.completedCount < r.targetCount), [routines]);
    const doneRoutines = useMemo(() => routines.filter(r => r.completedCount >= r.targetCount), [routines]);

    useFocusEffect(
        useCallback(() => {
            const loadAndResetRoutines = async (): Promise<void> => {
                let stored = await getRoutines();

                const resetPromises = stored
                    .filter(r => shouldReset(r))
                    .map(async r => {
                        const reset = resetRoutine(r);
                        await updateRoutine(reset);
                        return reset;
                    });

                const resetRoutines = await Promise.all(resetPromises);

                const resetIds = new Set(resetRoutines.map(r => r.id));
                stored = stored.map(r => resetIds.has(r.id)
                    ? resetRoutines.find(reset => reset.id === r.id)!
                    : r
                );

                setRoutines(stored);
            };
            loadAndResetRoutines();
        }, [])
    );

    async function handleDone(id: string, weekday?: DayOfWeek): Promise<void> {
        const routine = routines.find(r => r.id === id);
        if (!routine) return;

        let updated: Routine;

        if (routine.schedule.type === 'specific_weekdays' && weekday) {
            if (routine.completedDays.includes(weekday)) return;

            const newCompletedDays = [...routine.completedDays, weekday];
            updated = {
                ...routine,
                completedDays: newCompletedDays,
                completedCount: newCompletedDays.length,
            }
        } else {
            if (routine.completedCount >= routine.targetCount) return;

            updated = {...routine, completedCount: routine.completedCount + 1};
        }

        await updateRoutine(updated);
        setRoutines(prev => prev.map(r => r.id === id ? updated : r));
    }

    async function handleEdit(id: string): Promise<void> {
        const routine = routines.find(r => r.id === id);
        if (!routine) return;
        navigation.navigate('AddEditRoutine', {routine: routine});
    }

    async function handleDelete(id: string): Promise<void> {
        await deleteRoutine(id);
        setRoutines(prev => prev.filter(r => r.id !== id));
    }

    async function handleDragEnd({data}: DragEndParams<Routine>): Promise<void> {
        const mergedLists = [...data, ...doneRoutines];
        await saveRoutines(mergedLists);
        setRoutines(mergedLists);
    }

    return (
            <View style={styles.container}>
                <DraggableFlatList
                    style={styles.list}
                    data={undoneRoutines}
                    keyExtractor={item => item.id}
                    onDragEnd={handleDragEnd}
                    renderItem={({item, drag, isActive}: RenderItemParams<Routine>) => (
                        <ScaleDecorator>
                            <RoutineCard
                                routine={item}
                                onDone={handleDone}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onDrag={drag}
                                isDragging={isActive}
                            />
                        </ScaleDecorator>
                    )}
                    ListEmptyComponent={
                        doneRoutines.length < 1 ? <RoutinesEmptyState /> : null
                    }
                    ListFooterComponent={
                        doneRoutines.length > 0 ? (
                            <>
                                <View style={styles.separator}>
                                    <Text style={styles.separatorText}>Completed</Text>
                                </View>
                                {doneRoutines.map(item => (
                                    <RoutineCard
                                        key={item.id}
                                        routine={item}
                                        onDone={handleDone}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onDrag={() => {}}
                                        isDragging={false}
                                    />
                                ))}
                            </>
                        ) : null
                    }
                    contentContainerStyle={styles.listContent}
                />
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('AddEditRoutine', {routine: undefined})}
                >
                    <Text style={styles.fabText}>+</Text>
                </TouchableOpacity>
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    list: {
        marginBottom: 20,
    },
    listContent: {
        paddingBottom: 80,
    },
    fab: {
        position: 'absolute',
        bottom: 32,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fabText: {
        color: Colors.textPrimary,
        fontSize: 32,
        lineHeight: 56,
    },
    separator: {
        marginHorizontal: 5,
        marginTop: 16,
        marginBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderSecondary,
        paddingBottom: 4,
    },
    separatorText: {
        color: Colors.textMuted,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});