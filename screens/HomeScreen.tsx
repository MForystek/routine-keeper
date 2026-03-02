import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useCallback, useMemo, useState} from "react";
import {Activity, DayOfWeek} from "../types/activity";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {deleteActivity, getActivities, saveActivities, updateActivity} from "../storage/activityStorage";
import {Colors} from "../theme/colors";
import ActivityCard from "../components/ActivityCard";
import {resetActivity, shouldReset} from "../utils/resetUtils";
import DraggableFlatList from "react-native-draggable-flatlist/src/components/DraggableFlatList";
import {DragEndParams, ScaleDecorator} from "react-native-draggable-flatlist";
import {RenderItemParams} from "react-native-draggable-flatlist/src";
import ActivitiesEmptyState from "../components/ActivitiesEmptyState";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    const [activities, setActivities] = useState<Activity[]>([]);

    const undoneActivities = useMemo(() => activities.filter(a => a.completedCount < a.targetCount), [activities]);

    const doneActivities = useMemo(() => activities.filter(a => a.completedCount >= a.targetCount), [activities]);

    useFocusEffect(
        useCallback(() => {
            const loadAndResetActivities = async (): Promise<void> => {
                let stored = await getActivities();

                const resetPromises = stored
                    .filter(a => shouldReset(a))
                    .map(async a => {
                        const reset = resetActivity(a);
                        await updateActivity(reset);
                        return reset;
                    });

                const resetActivities = await Promise.all(resetPromises);

                const resetIds = new Set(resetActivities.map(a => a.id));
                stored = stored.map(a => resetIds.has(a.id)
                    ? resetActivities.find(r => r.id === a.id)!
                    : a
                );

                setActivities(stored);
            };
            loadAndResetActivities();
        }, [])
    );

    async function handleDone(id: string, weekday?: DayOfWeek): Promise<void> {
        const activity = activities.find(a => a.id === id);
        if (!activity) return;

        let updated: Activity;

        if (activity.schedule.type === 'specific_weekdays' && weekday) {
            if (activity.completedDays.includes(weekday)) return;

            const newCompletedDays = [...activity.completedDays, weekday];
            updated = {
                ...activity,
                completedDays: newCompletedDays,
                completedCount: newCompletedDays.length,
            }
        } else {
            if (activity.completedCount >= activity.targetCount) return;

            updated = {...activity, completedCount: activity.completedCount + 1};
        }

        await updateActivity(updated);
        setActivities(prev => prev.map(a => a.id === id ? updated : a));
    }

    async function handleEdit(id: string): Promise<void> {
        const activity = activities.find(a => a.id === id);
        if (!activity) return;
        navigation.navigate('AddEditActivity', {activity: activity});
    }

    async function handleDelete(id: string): Promise<void> {
        await deleteActivity(id);
        setActivities(prev => prev.filter(a => a.id !== id));
    }

    async function handleDragEnd({data}: DragEndParams<Activity>): Promise<void> {
        const mergedLists = [...data, ...doneActivities];
        await saveActivities(mergedLists);
        setActivities(mergedLists);
    }

    return (
            <View style={styles.container}>
                <DraggableFlatList
                    style={styles.list}
                    data={undoneActivities}
                    keyExtractor={item => item.id}
                    onDragEnd={handleDragEnd}
                    renderItem={({item, drag, isActive}: RenderItemParams<Activity>) => (
                        <ScaleDecorator>
                            <ActivityCard
                                activity={item}
                                onDone={handleDone}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onDrag={drag}
                                isDragging={isActive}
                            />
                        </ScaleDecorator>
                    )}
                    ListEmptyComponent={
                        doneActivities.length < 1 ? <ActivitiesEmptyState /> : null
                    }
                    ListFooterComponent={
                        doneActivities.length > 0 ? (
                            <>
                                <View style={styles.separator}>
                                    <Text style={styles.separatorText}>Completed</Text>
                                </View>
                                {doneActivities.map(item => (
                                    <ActivityCard
                                        key={item.id}
                                        activity={item}
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
                    onPress={() => navigation.navigate('AddEditActivity', {activity: undefined})}
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