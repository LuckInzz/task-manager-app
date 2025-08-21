import api from './api';
import type { TaskList } from '../types/TaskList';

// DTO para criar uma nova lista (apenas o nome é necessário)
interface CreateTaskListDTO {
    name: string;
}

/**
 * Busca todas as listas de tarefas do utilizador autenticado.
 */
export const getMyTaskLists = async (): Promise<TaskList[]> => {
    const response = await api.get<TaskList[]>('/task-lists/user');
    return response.data;
};

/**
 * Cria uma nova lista de tarefas.
 * @param data - Um objeto contendo o nome da nova lista.
 */
export const createTaskList = async (data: CreateTaskListDTO): Promise<TaskList> => {
    const response = await api.post<TaskList>('/task-lists', data);
    return response.data;
};

// Futuramente, podemos adicionar:
// export const updateTaskList = async (id: number, data: ...) => { ... };
// export const deleteTaskList = async (id: number) => { ... };
