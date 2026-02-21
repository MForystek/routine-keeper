import {FlatList, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useEffect, useState} from "react";
import {Activity} from "../types/activity";
import {useNavigation} from "@react-navigation/native";
import {getActivities} from "../storage/activityStorage";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const navigation = useNavigation<HomeScreenNavigationProp>();

    useEffect(() => {
        const loadActivities = async () => {
            const stored = await getActivities();
            setActivities(stored);
        };
        loadActivities();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={activities}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <View style={styles.item}>
                        <Text>{item.name}</Text>
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
    container: {flex: 1, backgroundColor: '#1e1e1e'},
    item: {padding: 16, margin: 0, backgroundColor: '#000', borderRadius: 8},
    empty: {textAlign: 'center', marginTop: 20, color: '#999'},
    fab: {
        position: 'absolute',
        bottom: 32,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#055c02',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fabText: {color: '#fff', fontSize: 32, lineHeight: 56},
});