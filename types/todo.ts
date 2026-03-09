export type Priority = 'urgent' | 'important' | 'errand' | 'optional';

export interface Todo {
    id: string;
    name: string;
    priority: Priority;
    done: boolean;
}