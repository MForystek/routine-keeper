import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {RootStackParamList} from "../App";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Activity, DayOfWeek, Schedule} from "../types/activity";
import {useNavigation} from "@react-navigation/native";
import {useState} from "react";
import {generateId} from "../utils/id";
import {addActivity} from "../storage/activityStorage";
import {Colors} from "../theme/colors";
import {compareDaysOfWeek, WEEKDAYS_IN_ORDER} from "../utils/dayOfWeekUtils";

type AddApplicationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddActivity'>;

export default function AddActivityScreen() {
    const navigation = useNavigation<AddApplicationNavigationProp>();

    const [name, setName] = useState<string>('');
    const [scheduleType, setScheduleType] = useState<'daily' | 'weekly' | 'specific_weekdays'>('daily');
    const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
    const [targetCount, setTargetCount] = useState<string>('1');

    function toggleDay(day: DayOfWeek) {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    }

    function buildSchedule(): Schedule {
        switch (scheduleType) {
            case 'daily': return {type: 'daily'};
            case 'weekly': return {type: 'weekly', timesPerWeek: parseInt(targetCount) || 1};
            case 'specific_weekdays': return {type: 'specific_weekdays', days: [...selectedDays].sort(compareDaysOfWeek)};
        }
    }

    async function handleSave() {
        if (!name.trim()) {
            Alert.alert('Validation', 'Please enter an activity name.');
            return;
        }
        if (scheduleType === 'specific_weekdays' && selectedDays.length === 0) {
            Alert.alert('Validation', 'Please select at least one day.');
            return;
        }
        if (parseInt(targetCount) < 1) {
            Alert.alert('Validation', 'Target count must be greater than 0.');
            return;
        }

        const today = new Date().toISOString().split('T')[0];

        const activity: Activity = {
            id: generateId(),
            name: name.trim(),
            schedule: buildSchedule(),
            targetCount: scheduleType === 'specific_weekdays' ? selectedDays.length : parseInt(targetCount) || 1,
            completedCount: 0,
            lastResetDate: today,
            completedDays: [],
        };

        await addActivity(activity);
        navigation.goBack();
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.label}>Activity name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="E.g. Drink glass of water"
                placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.label}>Schedule type</Text>
            <View style={styles.row}>
                {(['daily', 'weekly', 'specific_weekdays'] as const).map(type => (
                    <TouchableOpacity
                        style={[styles.chip, scheduleType === type && styles.chipActive]}
                        key={type}
                        onPress={() => setScheduleType(type)}
                    >
                        <Text style={[styles.chipText, scheduleType === type && styles.chipTextActive]}>
                            {type === 'specific_weekdays' ? 'Specific weekdays' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {scheduleType === 'daily' && (
                <>
                    <Text style={styles.label}>Times per day</Text>
                    <TextInput
                        style={styles.input}
                        value={targetCount}
                        onChangeText={setTargetCount}
                        keyboardType="numeric"
                        placeholderTextColor={Colors.textMuted}
                    />
                </>
            )}

            {scheduleType === 'weekly' && (
                <>
                    <Text style={styles.label}>Times per week</Text>
                    <TextInput
                        style={styles.input}
                        value={targetCount}
                        onChangeText={setTargetCount}
                        keyboardType="numeric"
                        placeholderTextColor={Colors.textMuted}
                    />
                </>
            )}

            {scheduleType === 'specific_weekdays' && (
                <>
                    <Text style={styles.label}>Days</Text>
                    <View style={styles.row}>
                        {WEEKDAYS_IN_ORDER.map(day => (
                            <TouchableOpacity
                                style={[styles.chip, selectedDays.includes(day) && styles.chipActive]}
                                key={day}
                                onPress={() => toggleDay(day)}
                            >
                                <Text style={[styles.chipText, selectedDays.includes(day) && styles.chipTextActive]}>
                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            )}

            <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
            >
                <Text style={styles.saveButtonText}>Save activity</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 20,
    },
    label: {
        color: Colors.textSecondary,
        fontSize: 13,
        marginTop: 20,
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        backgroundColor: Colors.secondary,
        color: Colors.textPrimary,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.secondary,
        borderWidth: 1,
        borderColor: Colors.borderSecondary,
    },
    chipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.borderPrimary,
    },
    chipText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    chipTextActive: {
        color: Colors.textPrimary,
    },
    saveButton: {
        marginTop: 40,
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: Colors.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});