import { create } from 'zustand';
import type { Task, CreateTask, UpdateTask } from '../types/Task';
import type { TaskList, CreateTaskList, UpdateTaskList } from '../types/TaskList';
import type { UserResponse, LoginRequest, RegisterRequest } from '../types/Auth';

// Importa TODAS as nossas funções de serviço
import { getMyTasks, createTask as createTaskApi, updateTask, deleteTask } from '../services/TaskService';
import { getMyTaskLists, createTaskList as createTaskListApi, updateTaskList, deleteTaskList } from '../services/TaskListService';
import { login as loginApi, register as registerApi, getMe } from '../services/AuthService';
import api from '../services/api';
import toast from 'react-hot-toast';

interface AppState {
    user: UserResponse | null;
    tasks: Task[];
    taskLists: TaskList[];
    isLoading: boolean;
    error: string | null;
}

interface AppActions {
    // Ações de Autenticação
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    fetchInitialData: () => Promise<void>;
    fetchTasksData: () => Promise<void>;
    fetchTaskListsData: () => Promise<void>;
    createTaskList: (newTaskListData: CreateTaskList) => Promise<void>;
    createTask: (newTaskData: CreateTask) => Promise<void>;
    toggleTaskStatus: (taskId: number, status: string) => Promise<void>;
    updateTask: (taskId: number, updatedTask: UpdateTask) => Promise<void>;
    deleteTask: (taskId: number) => Promise<void>;
    updateTaskList: (listId: number, updatedData: UpdateTaskList) => Promise<void>;
    deleteTaskList: (listId: number) => Promise<void>;
}

export const useStore = create<AppState & AppActions>((set, get) => ({
// --- ESTADO INICIAL ---
    user: null,
    tasks: [],
    taskLists: [],
    isLoading: false,
    error: null,

    // --- AÇÕES ---

    // -- Ações de Autenticação --
    checkAuth: async () => {
        set({ isLoading: true });
        const token = localStorage.getItem('authToken');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                const userData = await getMe();
                set({ user: userData });
                await get().fetchInitialData(); // Busca os dados se o token for válido
            } catch (error) {
                get().logout(); // Se o token for inválido, faz o logout
            }
        }
        set({ isLoading: false });
    },

    login: async (credentials: LoginRequest) => {
        const { token } = await loginApi(credentials);
        localStorage.setItem('authToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const userData = await getMe();
        set({ user: userData });
        
        await get().fetchInitialData();
    },

    register: async (userData: RegisterRequest) => {
        await registerApi(userData);
    },

    logout: () => {
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, tasks: [], taskLists: [], error: null }); // Limpa todo o estado
    },

    // -- Ações de Dados --
    fetchInitialData: async () => {
        try {
            const [tasksData, listsData] = await Promise.all([
                getMyTasks(),
                getMyTaskLists()
            ]);
            set({ tasks: tasksData, taskLists: listsData });
        } catch (err) {
            const errorMessage = "Failed to fetch initial data";
            set({ error: errorMessage });
            console.error(err);
            throw new Error(errorMessage);
        }
    },

    fetchTaskListsData: async () => {
        try {
            const [listsData] = await Promise.all([
                getMyTaskLists()
            ]);
            set({taskLists: listsData });
        } catch (err) {
            const errorMessage = "Failed to fetch list data";
            set({ error: errorMessage });
            console.error(err);
            throw new Error(errorMessage);
        }
    },

    fetchTasksData: async () => {
        try {
            const [tasksData] = await Promise.all([
                getMyTasks()
            ]);
            set({ tasks: tasksData });
        } catch (err) {
            const errorMessage = "Failed to fetch task data";
            set({ error: errorMessage });
            console.error(err);
            throw new Error(errorMessage);
        }
    },

    // -- Ações de TaskList --
    createTaskList: async (newTaskListData) => {
        try {
            const newList = await createTaskListApi(newTaskListData);
            // Adiciona a nova lista ao estado existente
            set(state => ({ taskLists: [newList, ...state.taskLists] }));
        } catch (error) {
            console.error("Failed to create task list", error);
            throw error; // Lança o erro para o componente poder lidar com ele (ex: mostrar um toast)
        }
    },

    // -- Ações de Task --
    createTask: async (newTaskData) => {
        try {
            const newTask = await createTaskApi(newTaskData);
            // Adiciona a nova tarefa ao estado existente
                set(state => { 
                    const updatedTask = [newTask, ...state.tasks];

                    const updatedTaskLists = state.taskLists.map(list => {
                    // Se o ID da lista corresponder ao da nova tarefa...
                    if (list.id === newTask.taskListId) {
                        // ...retorna uma nova versão da lista com a nova tarefa incluída.
                        return {
                            ...list,
                            tasks: [newTask, ...(list.tasks || [])]
                        };
                    }
                    // Se não, retorna a lista sem modificações.
                    return list;
                });
                return { tasks: updatedTask, taskLists: updatedTaskLists}
            });
            
        } catch (error) {
            console.error("Failed to create task", error);
            throw error;
        }
    },

    updateTask: async (taskId: number, updatedData: UpdateTask) => {
        // Guarda o estado original completo para o caso de a API falhar
        const originalState = { tasks: get().tasks, taskLists: get().taskLists };

        try {
            // --- ATUALIZAÇÃO OTIMISTA (A Lógica Corrigida) ---
            set(state => {
                // 1. Encontra a informação completa da nova lista
                const newList = state.taskLists.find(list => list.id === updatedData.taskListId);
                
                // 2. Atualiza a lista principal de tarefas
                const updatedTasks = state.tasks.map(task => {
                    if (task.id === taskId) {
                        // Cria um objeto de tarefa completamente atualizado
                        return { 
                            ...task, 
                            ...updatedData,
                            // A CORREÇÃO: Substitui o objeto taskList e o nome
                            taskList: newList ? { id: newList.id, name: newList.name, color: newList.color } : null,
                            taskListName: newList ? newList.name : "",
                        };
                    }
                    return task;
                });

                const taskToMove = updatedTasks.find(t => t.id === taskId)!;
                const oldListId = originalState.tasks.find(t => t.id === taskId)?.taskListId;
                
                const updatedTaskLists = state.taskLists.map(list => {
                    // Adiciona a tarefa à nova lista
                    if (list.id === taskToMove.taskListId) {
                        return { ...list, tasks: [taskToMove, ...(list.tasks || [])] };
                    }
                    // Remove a tarefa da lista antiga
                    if (list.id === oldListId) {
                        return { ...list, tasks: list.tasks?.filter(t => t.id !== taskId) };
                    }
                    // Retorna outras listas sem alterações
                    return list;
                });

                return { tasks: updatedTasks, taskLists: updatedTaskLists };
            });

            // 4. Chama a API em segundo plano
            await updateTask(taskId, updatedData);

        } catch (error) {
            toast.error("Failed to update task.");
            // Reverte para o estado original em caso de erro
            set({ tasks: originalState.tasks, taskLists: originalState.taskLists });
        }
    },

    deleteTask: async (taskId: number) => {
        const originalTasks = get().tasks;
        const originalTaskLists = get().taskLists;

        // ATUALIZAÇÃO OTIMISTA
        set(state => ({
            // Remove a tarefa da lista principal
            tasks: state.tasks.filter(task => task.id !== taskId),
            // Remove a tarefa aninhada da sua TaskList
            taskLists: state.taskLists.map(list => ({
                ...list,
                tasks: list.tasks?.filter(task => task.id !== taskId)
            }))
        }));

        try {
            await deleteTask(taskId); // Chama a API em segundo plano
            toast.success("Task deleted!");
        } catch (error) {
            toast.error("Failed to delete task.");
            set({ tasks: originalTasks, taskLists: originalTaskLists }); // Reverte em caso de erro
        }
    },

    updateTaskList: async (listId, updatedData) => {
        // Guarda o estado original completo para o caso de a API falhar
        const originalState = { tasks: get().tasks, taskLists: get().taskLists };
        
        // --- ATUALIZAÇÃO OTIMISTA ---
        set(state => {

            const updatedTaskLists = state.taskLists.map(list => 
                list.id === listId ? { ...list, ...updatedData } : list
            );

            const updatedTasks = state.tasks.map(task => {
                // Se a tarefa pertencer à lista que foi atualizada...
                if (task.taskListId === listId) {
                    // ...retorna uma nova versão da tarefa com o nome da lista atualizado.
                    return { 
                        ...task, 
                        taskListName: updatedData.name // Usa o novo nome do 'updatedData'
                    };
                }
                // Se não, retorna a tarefa sem modificações.
                return task;
            });
            // Retorna o novo estado com ambos os "livros de registo" atualizados.
            return { taskLists: updatedTaskLists, tasks: updatedTasks };
        });

        try {
            await updateTaskList(listId, updatedData); // Chama a API em segundo plano
        } catch (error) {
            toast.error("Failed to update list.");
            set(originalState);
        }
    },

    deleteTaskList: async (listId) => {
        const originalState = { tasks: get().tasks, taskLists: get().taskLists };

        set(state => ({
            // Remove a lista
            taskLists: state.taskLists.filter(list => list.id !== listId),
            // Remove todas as tarefas que pertenciam a essa lista
            tasks: state.tasks.filter(task => task.taskListId !== listId)
        }));

        try {
            await deleteTaskList(listId);
            toast.success("List deleted!");
        } catch (error) {
            toast.error("Failed to delete list.");
            set(originalState);
        }
    },

    toggleTaskStatus: async (taskId: number, currentStatus: string) => {
        const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

        // Guarda o estado original para o caso de a API falhar
        const originalState = { tasks: get().tasks, taskLists: get().taskLists };

        // ATUALIZAÇÃO OTIMISTA: Atualiza a UI imediatamente
        set(state => {
            const updatedTasks = state.tasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            );
        
            const updatedTaskLists = state.taskLists.map(list => {
                // Encontra a tarefa a ser atualizada dentro da lista
                const taskExistsInList = list.tasks?.some(task => task.id === taskId);
                
                if (taskExistsInList) {
                    // Se a tarefa estiver nesta lista, atualiza-a
                    return {
                        ...list,
                        tasks: list.tasks.map(task =>
                            task.id === taskId ? { ...task, status: newStatus } : task
                        )
                    };
                }
                // Se não, retorna a lista sem alterações
                return list;
            });

            // Retorna o novo estado com AMBAS as listas atualizadas
            return { tasks: updatedTasks, taskLists: updatedTaskLists };
        });

        try {
            // Encontra a tarefa completa para enviar todos os seus dados
            const taskToUpdate = originalState.tasks.find(t => t.id === taskId);
            if (!taskToUpdate) throw new Error("Tarefa não encontrada");

            // Chama a API em segundo plano
            await updateTask(taskId, {
                ...taskToUpdate, // Envia todos os dados da tarefa
                status: newStatus // Com o novo status
            });
        } catch (error) {
            console.error("Falha ao atualizar a tarefa:", error);
            toast.error("Não foi possível atualizar a tarefa.");
            // Se a API falhar, reverte a mudança na UI
            set({ tasks: originalState.tasks, taskLists: originalState.taskLists });
        }
    },
}));