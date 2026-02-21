import {Activity} from "../types/activity";
import {Alert, StyleSheet, Text, TouchableOpacity} from "react-native";
import {Colors} from "../theme/colors";

interface ActivityCardProps {
    activity: Activity;
    onDelete: (id: string) => void;
}

export default function ActivityCard({activity, onDelete}: ActivityCardProps) {
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
            style={styles.card}
            onLongPress={handleLongPress}
        >
            <Text style={styles.name}>{activity.name}</Text>
            <Text style={styles.progress}>{activity.completedCount + ' out of ' + activity.targetCount}</Text>
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
    name: {
        color: Colors.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',

    },
    progress: {
        color: Colors.textSecondary,
        fontSize: 13,
        marginTop: 4,
    },
});