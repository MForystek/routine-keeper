import {FlatList, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useCallback, useState} from "react";
import {Activity} from "../types/activity";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {getActivities} from "../storage/activityStorage";
import {Colors} from "../theme/colors";

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

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.list}
                data={activities}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <View style={styles.item}>
                        <Text style={styles.itemText}>{item.name + ' | ' + item.completedCount + ' out of ' + item.targetCount}</Text>
                    </View>
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
    item: {
        padding: 16,
        margin: 5,
        marginTop: 0,
        backgroundColor: Colors.secondary,
        borderRadius: 8,
    },
    itemText: {
        color: Colors.textSecondary,
        fontSize: 16,
        fontWeight: 'bold',

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