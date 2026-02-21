import {Activity} from "../types/activity";
import {Alert, StyleSheet, Text, TouchableOpacity} from "react-native";
import {Colors} from "../theme/colors";

interface ActivityCardProps {
    activity: Activity;
    onDone: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function ActivityCard({activity, onDone, onDelete}: ActivityCardProps) {
    const isDone = activity.completedCount >= activity.targetCount

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
            onPress={() => !isDone && onDone(activity.id)}
            onLongPress={handleLongPress}
        >
            <Text style={[styles.name, isDone && styles.nameDone]}>
                {activity.name}
            </Text>
            <Text style={styles.progress}>
                {activity.completedCount + ' out of ' + activity.targetCount}
            </Text>
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

    },
    nameDone: {
        textDecorationLine: 'line-through',
        color: Colors.textMuted,
    },
    progress: {
        color: Colors.textSecondary,
        fontSize: 13,
        marginTop: 4,
    },
});