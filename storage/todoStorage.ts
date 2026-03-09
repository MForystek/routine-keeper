import AsyncStorage from "@react-native-async-storage/async-storage";
import {Todo} from "../types/todo";

const TODOS_KEY = 'todos';

export async function getTodos(): Promise<Todo[]> {
    const json = await AsyncStorage.getItem(TODOS_KEY);
    return json ? JSON.parse(json) : [];
}

export async function saveTodos(todos: Todo[]): Promise<void> {
    const json = JSON.stringify(todos);
    await AsyncStorage.setItem(TODOS_KEY, json);
}

export async function addTodo(todo: Todo): Promise<void> {
    const todos = await getTodos();
    await saveTodos([...todos, todo]);
}

export async function updateTodo(updated: Todo): Promise<void> {
    const todos = await getTodos();
    const newList = todos.map(t => t.id === updated.id ? updated : t);
    await saveTodos(newList);
}

export async function deleteTodo(id: string): Promise<void> {
    const todos = await getTodos();
    const newList = todos.filter(t => t.id !== id);
    await saveTodos(newList);
}