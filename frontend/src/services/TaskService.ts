import api from './api';
import type { CreateTask, Task, UpdateTask } from '../types/Task';

/**
 * Busca todas as tarefas do utilizador autenticado.
 */
export const getMyTasks = async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks/user');
    return response.data;
};

/**
 * Busca todas as tarefas do utilizador autenticado pelo nome.
 */
export const searchTaskByName = async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks/search?name');
    return response.data;
};

/**
 * Cria uma nova tarefa.
 * @param data - Um objeto contendo o nome da nova lista.
 */
export const createTask = async (data: CreateTask): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
};

export const updateTask = async (id: number, data: UpdateTask): Promise<Task> => {
    const response = await api.put<Task>(`tasks/${id}`, data)
    return response.data;
}
