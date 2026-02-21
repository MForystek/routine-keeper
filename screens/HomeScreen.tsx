import {FlatList, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useCallback, useState} from "react";
import {Activity} from "../types/activity";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {deleteActivity, getActivities} from "../storage/activityStorage";
import {Colors} from "../theme/colors";
import ActivityCard from "../components/ActivityCard";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const navigation = useNavigation<HomeScreenNavigationProp>();

    useFocusEffect(
        useCallback(() => {
            const loadActivities = async () => {
                const stored = await getActivities();
                setActivities(stored);
            };
            loadActivities();
        }, [])
    );

    async function handleDelete(id: string): Promise<void> {
        await deleteActivity(id);
        setActivities(prev => prev.filter(a => a.id !== id));
    }

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.list}
                data={activities}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <ActivityCard
                        activity={item}
                        onDelete={handleDelete}
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>No activities yet. Add one!</Text>
                }
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddActivity')}
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
    empty: {
        textAlign: 'center',
        marginTop: 20,
        color: Colors.textMuted,
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
});