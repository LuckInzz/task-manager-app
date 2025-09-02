import { create } from 'zustand';
import type { Task, CreateTask, UpdateTask } from '../types/Task';
import type { TaskList, CreateTaskList } from '../types/TaskList';
import type { UserResponse, LoginRequest, RegisterRequest } from '../types/Auth';

// Importa TODAS as nossas funções de serviço
import { getMyTasks, createTask as createTaskApi, updateTask } from '../services/TaskService';
import { getMyTaskLists, createTaskList as createTaskListApi } from '../services/TaskListService';
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
    toggleTaskStatus: (taskId:number, status: string) => Promise<void>;
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
            set(state => ({ tasks: [newTask, ...state.tasks] }));
        } catch (error) {
            console.error("Failed to create task", error);
            throw error;
        }
    },

    toggleTaskStatus: async (taskId: number, currentStatus: string) => {
        const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

        // Guarda o estado original para o caso de a API falhar
        const originalTasks = get().tasks;

        // ATUALIZAÇÃO OTIMISTA: Atualiza a UI imediatamente
        set(state => ({
            tasks: state.tasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        }));

        try {
            // Encontra a tarefa completa para enviar todos os seus dados
            const taskToUpdate = originalTasks.find(t => t.id === taskId);
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
            set({ tasks: originalTasks });
        }
    },
}));