import {Activity, DayOfWeek} from "../types/activity";
import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors} from "../theme/colors";

interface ActivityCardProps {
    activity: Activity;
    onDone: (id: string, weekday?: DayOfWeek) => void;
    onDelete: (id: string) => void;
}

function formatProgress(activity: Activity): string {
    const {completedCount, targetCount, schedule} = activity;
    switch (schedule.type) {
        case 'daily': return `${completedCount} of ${targetCount} for today`;
        case 'weekly': return `${completedCount} of ${targetCount} for this week`;
        default: return '';
    }
}

export default function ActivityCard({activity, onDone, onDelete}: ActivityCardProps) {
    const isDone = activity.completedCount >= activity.targetCount;
    const isSpecificDays = activity.schedule.type === 'specific_weekdays';

    function handleLongPress(): void {
        Alert.alert(
            'Delete activity',
            `Are you sure you want to delete ${activity.name}?`,
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Delete', style: 'destructive', onPress: () => onDelete(activity.id)}
            ]
        );
    }

    return (
        <TouchableOpacity
            style={[styles.card, isDone && styles.cardDone]}
            onPress={() => !isSpecificDays && !isDone && onDone(activity.id)}
            onLongPress={handleLongPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.name, isDone && styles.nameDone]}>
                {activity.name}
            </Text>
            {isSpecificDays && activity.schedule.type === 'specific_weekdays' ? (
                <View style={styles.daysRow}>
                    {activity.schedule.days.map(day => {
                        const dayDone = activity.completedDays.includes(day);
                        return (
                            <TouchableOpacity
                                style={[styles.dayChip, dayDone && styles.dayChipDone]}
                                key={day}
                                onPress={() => onDone(activity.id, day)}
                                activeOpacity={0.7}
                                disabled={isDone || dayDone}
                            >
                                <Text style={[styles.dayChipText, dayDone && styles.dayChipTextDone]}>
                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ) : (
                <Text style={styles.progress}>
                    {formatProgress(activity)}
                </Text>
            )}

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        margin: 5,
        marginBottom: 0,
        backgroundColor: Colors.secondary,
        borderRadius: 8,
    },
    cardDone: {
        opacity: 0.5,
    },
    name: {
        color: Colors.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    nameDone: {
        textDecorationLine: 'line-through',
        color: Colors.textMuted,
    },
    progress: {
        color: Colors.textSecondary,
        fontSize: 13,
    },
    daysRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 4,
    },
    dayChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.borderSecondary,
    },
    dayChipDone: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        opacity: 0.5,
    },
    dayChipText: {
        color: Colors.textSecondary,
        fontSize: 12,
    },
    dayChipTextDone: {
        color: Colors.textPrimary,
        textDecorationLine: 'line-through',
    },
});