import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {RootStackParamList} from "../App";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {generateId} from "../utils/id";
import {Colors} from "../theme/colors";
import {Priority, Todo} from "../types/todo";
import {addTodo, updateTodo} from "../storage/todoStorage";

type AddEditTodoRouteProp = RouteProp<RootStackParamList, 'AddEditTodo'>;

export default function AddEditTodoScreen() {
    const navigation = useNavigation();
    const route = useRoute<AddEditTodoRouteProp>();
    const existingTodo = route.params?.todo;

    const [name, setName] = useState<string>(existingTodo
        ? existingTodo.name
        : '');
    const [priority, setPriority] = useState<Priority | null>(existingTodo
        ? existingTodo.priority
        : null)

    useEffect(() => {
        navigation.setOptions({title: existingTodo ? 'Edit Todo' : 'Add Todo'});
    }, []);

    async function handleSave() {
        if (!name.trim()) {
            Alert.alert('Validation', 'Please enter a todo name.');
            return;
        }
        if (!priority) {
            Alert.alert('Validation', 'Please choose a todo priority.');
            return;
        }

        const isEditing = existingTodo !== undefined;

        const todo: Todo = {
            id: isEditing ? existingTodo.id : generateId(),
            name: name.trim(),
            priority: priority,
            done: isEditing ? existingTodo.done : false,
        };

        if (isEditing) {
            await updateTodo(todo);
        } else {
            await addTodo(todo);
        }
        navigation.goBack();
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.label}>Todo name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="E.g. Fix broken light bulb"
                placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.label}>Priority</Text>
            <View style={styles.row}>
                {(['urgent', 'important'] as const).map(type => (
                    <TouchableOpacity
                        style={[styles.chip, priority === type && styles.chipActive]}
                        key={type}
                        onPress={() => setPriority(type)}
                    >
                        <Text style={[styles.chipText, priority === type && styles.chipTextActive]}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.row}>
                {(['errand', 'optional'] as const).map(type => (
                    <TouchableOpacity
                        style={[styles.chip, priority === type && styles.chipActive]}
                        key={type}
                        onPress={() => setPriority(type)}
                    >
                        <Text style={[styles.chipText, priority === type && styles.chipTextActive]}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
            >
                <Text style={styles.saveButtonText}>Save todo</Text>
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
        justifyContent: 'flex-start',
        paddingVertical: 4,
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