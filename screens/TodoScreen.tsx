import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useCallback, useMemo, useState} from "react";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {Colors} from "../theme/colors";
import DraggableFlatList from "react-native-draggable-flatlist/src/components/DraggableFlatList";
import {DragEndParams, ScaleDecorator} from "react-native-draggable-flatlist";
import {RenderItemParams} from "react-native-draggable-flatlist/src";
import {Todo} from "../types/todo";
import {deleteTodo, getTodos, saveTodos, updateTodo} from "../storage/todoStorage";
import TodoCard from "../components/TodoCard";
import TodosEmptyState from "../components/TodosEmptyState";

type TodoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TodoScreen() {
    const navigation = useNavigation<TodoScreenNavigationProp>();

    const [todos, setTodos] = useState<Todo[]>([]);

    const undoneTodos = useMemo(() => todos.filter(t => !t.done), [todos]);
    const doneTodos = useMemo(() => todos.filter(t => t.done), [todos]);

    useFocusEffect(
        useCallback(() => {
            const loadTodos = async (): Promise<void> => {
                const stored = await getTodos();
                setTodos(stored);
            };
            loadTodos();
        }, [])
    );

    async function handleDone(id: string): Promise<void> {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        if (todo.done) return;

        const updated: Todo = {...todo, done: true};
        await updateTodo(updated);
        setTodos(prev => prev.map(t => t.id === id ? updated : t));
    }

    async function handleEdit(id: string): Promise<void> {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        navigation.navigate('AddEditTodo', {todo: todo});
    }

    async function handleDelete(id: string): Promise<void> {
        await deleteTodo(id);
        setTodos(prev => prev.filter(t => t.id !== id));
    }

    async function handleDragEnd({data}: DragEndParams<Todo>): Promise<void> {
        const mergedLists = [...data, ...doneTodos];
        await saveTodos(mergedLists);
        setTodos(mergedLists);
    }

    return (
        <View style={styles.container}>
            <DraggableFlatList
                style={styles.list}
                data={undoneTodos}
                keyExtractor={item => item.id}
                onDragEnd={handleDragEnd}
                renderItem={({item, drag, isActive}: RenderItemParams<Todo>) => (
                    <ScaleDecorator>
                        <TodoCard
                            todo={item}
                            onDone={handleDone}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onDrag={drag}
                            isDragging={isActive}
                        />
                    </ScaleDecorator>
                )}
                ListEmptyComponent={
                    doneTodos.length < 1 ? <TodosEmptyState /> : null
                }
                ListFooterComponent={
                    doneTodos.length > 0 ? (
                        <>
                            <View style={styles.separator}>
                                <Text style={styles.separatorText}>Completed</Text>
                            </View>
                            {doneTodos.map(item => (
                                <TodoCard
                                    key={item.id}
                                    todo={item}
                                    onDone={handleDone}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onDrag={() => {}}
                                    isDragging={false}
                                />
                            ))}
                        </>
                    ) : null
                }
                contentContainerStyle={styles.listContent}
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddEditTodo', {todo: undefined})}
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
    listContent: {
        paddingBottom: 80,
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
    separator: {
        marginHorizontal: 5,
        marginTop: 16,
        marginBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderSecondary,
        paddingBottom: 4,
    },
    separatorText: {
        color: Colors.textMuted,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});