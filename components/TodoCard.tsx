import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors} from "../theme/colors";
import ReanimatedSwipeable, {SwipeableMethods} from "react-native-gesture-handler/src/components/ReanimatedSwipeable";
import {useRef} from "react";
import * as Haptics from "expo-haptics";
import {Todo} from "../types/todo";

interface TodoCardProps {
    todo: Todo;
    onDone: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onDrag: () => void;
    isDragging: boolean;
}

export default function TodoCard({todo, onDone, onEdit, onDelete, onDrag, isDragging}: TodoCardProps) {
    const swipeableRef = useRef<SwipeableMethods>(null);

    function handleHaptics(): void {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    function renderRightActions() {
        return (
            <View style={styles.rightActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editAction]}
                    onPress={() => {
                        onEdit(todo.id);
                        swipeableRef.current?.close();
                    }}
                >
                    <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteAction]}
                    onPress={() => {
                        onDelete(todo.id);
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
                style={[styles.card, todo.done && styles.cardDone, isDragging && styles.cardDragging]}
                onPress={() => {
                    if (!todo.done) {
                        handleHaptics();
                        onDone(todo.id);
                    }
                }}
                onLongPress={onDrag}
                activeOpacity={0.7}
            >
                <Text style={[styles.name, todo.done && styles.nameDone]}>
                    {todo.name}
                </Text>
                <View style={styles.priorityRow}>
                    <View style={styles.priorityChip}>
                        <Text style={styles.priorityChipText}>
                            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                        </Text>
                    </View>
                </View>
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
    priorityRow: {
        flexWrap: 'wrap',
    },
    priorityChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    priorityChipText: {
        color: Colors.textPrimary,
        fontSize: 12,
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