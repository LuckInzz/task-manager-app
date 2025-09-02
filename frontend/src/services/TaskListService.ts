import api from './api';
import type { CreateTaskList, TaskList } from '../types/TaskList';

/**
 * Busca todas as listas de tarefas do utilizador autenticado.
 */
export const getMyTaskLists = async (): Promise<TaskList[]> => {
    const response = await api.get<TaskList[]>('/task-lists/user');
    return response.data;
};

/**
 * Busca todas as listas de tarefas do utilizador autenticado.
 */
export const searchTaskListByName = async (): Promise<TaskList[]> => {
    const response = await api.get<TaskList[]>('/task-lists/search?name');
    return response.data;
};

/**
 * Cria uma nova lista de tarefas.
 * @param data - Um objeto contendo o nome da nova lista.
 */
export const createTaskList = async (data: CreateTaskList): Promise<TaskList> => {
    const response = await api.post<TaskList>('/task-lists', data);
    return response.data;
};

// Futuramente, podemos adicionar:
// export const updateTaskList = async (id: number, data: ...) => { ... };
// export const deleteTaskList = async (id: number) => { ... };
