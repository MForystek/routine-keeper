import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {RootStackParamList} from "../App";
import {Routine, DayOfWeek, Schedule} from "../types/routine";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {generateId} from "../utils/id";
import {addRoutine, updateRoutine} from "../storage/routineStorage";
import {Colors} from "../theme/colors";
import {compareDaysOfWeek, WEEKDAYS_IN_ORDER} from "../utils/dayOfWeekUtils";

type AddEditRoutineRouteProp = RouteProp<RootStackParamList, 'AddEditRoutine'>;

export default function AddEditRoutineScreen() {
    const navigation = useNavigation();
    const route = useRoute<AddEditRoutineRouteProp>();
    const existingRoutine = route.params?.routine;

    const [name, setName] = useState<string>(existingRoutine
        ? existingRoutine.name
        : '');
    const [scheduleType, setScheduleType] = useState<'daily' | 'weekly' | 'specific_weekdays'>(existingRoutine
        ? existingRoutine.schedule.type
        : 'daily');
    const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(existingRoutine && existingRoutine.schedule.type === 'specific_weekdays'
        ? existingRoutine.schedule.days
        : []);
    const [targetCount, setTargetCount] = useState<string>(existingRoutine
        ? existingRoutine.targetCount.toString()
        : '1');

    useEffect(() => {
        navigation.setOptions({title: existingRoutine ? 'Edit Routine' : 'Add Routine'});
    }, []);

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
            Alert.alert('Validation', 'Please enter a routine name.');
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
        const isEditing = existingRoutine !== undefined;

        const routine: Routine = {
            id: isEditing ? existingRoutine.id : generateId(),
            name: name.trim(),
            schedule: buildSchedule(),
            targetCount: scheduleType === 'specific_weekdays' ? selectedDays.length : parseInt(targetCount) || 1,
            completedCount: isEditing ? existingRoutine.completedCount : 0,
            lastResetDate: isEditing ? existingRoutine.lastResetDate : today,
            completedDays: isEditing ? existingRoutine.completedDays : [],
        };

        if (isEditing) {
            await updateRoutine(routine);
        } else {
            await addRoutine(routine);
        }
        navigation.goBack();
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.label}>Routine name</Text>
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
                <Text style={styles.saveButtonText}>Save routine</Text>
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