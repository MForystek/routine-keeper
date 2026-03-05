import {Routine, DayOfWeek} from "../types/routine";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors} from "../theme/colors";
import ReanimatedSwipeable, {SwipeableMethods} from "react-native-gesture-handler/src/components/ReanimatedSwipeable";
import {useRef} from "react";
import * as Haptics from "expo-haptics";

interface RoutineCardProps {
    routine: Routine;
    onDone: (id: string, weekday?: DayOfWeek) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onDrag: () => void;
    isDragging: boolean;
}

export default function RoutineCard({routine, onDone, onEdit, onDelete, onDrag, isDragging}: RoutineCardProps) {
    const swipeableRef = useRef<SwipeableMethods>(null);

    const isDone = routine.completedCount >= routine.targetCount;
    const isSpecificDays = routine.schedule.type === 'specific_weekdays';

    function formatProgress(): string {
        const {completedCount, targetCount, schedule} = routine;
        switch (schedule.type) {
            case 'daily': return `${completedCount} of ${targetCount} for today`;
            case 'weekly': return `${completedCount} of ${targetCount} for this week`;
            default: return '';
        }
    }

    function handleHaptics(): void {
        const willComplete = routine.completedCount + 1 >= routine.targetCount;
        if (willComplete) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    }

    function renderRightActions() {
        return (
            <View style={styles.rightActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editAction]}
                    onPress={() => {
                        onEdit(routine.id);
                        swipeableRef.current?.close();
                    }}
                >
                    <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteAction]}
                    onPress={() => {
                        onDelete(routine.id);
                        swipeableRef.current?.close();
                    }}
                >
                    <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ReanimatedSwipeable
            ref={swipeableRef}
            renderRightActions={renderRightActions}
        >
            <TouchableOpacity
                style={[styles.card, isDone && styles.cardDone, isDragging && styles.cardDragging]}
                onPress={() => {
                    if (!isSpecificDays && !isDone) {
                        handleHaptics();
                        onDone(routine.id);
                    }
                }}
                onLongPress={onDrag}
                activeOpacity={0.7}
            >
                <Text style={[styles.name, isDone && styles.nameDone]}>
                    {routine.name}
                </Text>
                {isSpecificDays && routine.schedule.type === 'specific_weekdays' ? (
                    <View style={styles.daysRow}>
                        {routine.schedule.days.map(day => {
                            const dayDone = routine.completedDays.includes(day);
                            return (
                                <TouchableOpacity
                                    style={[styles.dayChip, dayDone && styles.dayChipDone]}
                                    key={day}
                                    onPress={() => {
                                        handleHaptics();
                                        onDone(routine.id, day);
                                    }}
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
                        {formatProgress()}
                    </Text>
                )}

            </TouchableOpacity>
        </ReanimatedSwipeable>
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
    rightActions: {
        flexDirection: 'row',
        margin: 5,
        marginBottom: 0,
        gap: 4,
    },
    actionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 72,
        borderRadius: 8,
    },
    editAction: {
        backgroundColor: Colors.primary,
    },
    deleteAction: {
        backgroundColor: Colors.red,
    },
    actionText: {
        color: Colors.textPrimary,
        fontWeight: 'bold',
    },
    cardDragging: {
        opacity: 0.9,
        shadowColor: Colors.black,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
});