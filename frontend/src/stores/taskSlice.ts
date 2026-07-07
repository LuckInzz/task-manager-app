import { type StateCreator } from 'zustand';
import type { Task, CreateTask, UpdateTask } from '../types/Task';
import { getMyTasks, createTask as createTaskApi, updateTask, deleteTask } from '../services/TaskService';
import { type StoreState } from './useStore';
import toast from 'react-hot-toast';

export interface TaskSlice {
    tasks: Task[];
    fetchTasksData: () => Promise<void>;
    createTask: (newTaskData: CreateTask) => Promise<void>;
    updateTask: (taskId: number, updatedData: UpdateTask) => Promise<void>;
    deleteTask: (taskId: number) => Promise<void>;
    toggleTaskStatus: (taskId: number, currentStatus: string) => Promise<void>;
}

export const createTaskSlice: StateCreator<
    StoreState,
    [],
    [],
    TaskSlice
> = (set, get) => ({
    tasks: [],

    fetchTasksData: async () => {
        try {
            const tasksData = await getMyTasks();
            set({ tasks: tasksData });
        } catch (err) {
            const errorMessage = "Failed to fetch task data";
            set({ error: errorMessage });
            console.error(err);
            throw new Error(errorMessage);
        }
    },

    createTask: async (newTaskData) => {
        try {
            const newTask = await createTaskApi(newTaskData);
            set(state => {
                const updatedTask = [newTask, ...state.tasks];
                const updatedTaskLists = state.taskLists.map(list => {
                    if (list.id === newTask.taskListId) {
                        return {
                            ...list,
                            tasks: [newTask, ...(list.tasks || [])]
                        };
                    }
                    return list;
                });
                return { tasks: updatedTask, taskLists: updatedTaskLists };
            });
        } catch (error) {
            console.error("Failed to create task", error);
            throw error;
        }
    },

    updateTask: async (taskId: number, updatedData: UpdateTask) => {
        const originalState = { tasks: get().tasks, taskLists: get().taskLists };
        try {
            set(state => {
                const newList = state.taskLists.find(list => list.id === updatedData.taskListId);
                const updatedTasks = state.tasks.map(task => {
                    if (task.id === taskId) {
                        return {
                            ...task,
                            ...updatedData,
                            taskList: newList ? { id: newList.id, name: newList.name, color: newList.color } : null,
                            taskListName: newList ? newList.name : "",
                        };
                    }
                    return task;
                });

                const taskToMove = updatedTasks.find(t => t.id === taskId)!;
                const oldListId = originalState.tasks.find(t => t.id === taskId)?.taskListId;

                const updatedTaskLists = state.taskLists.map(list => {
                    if (list.id === taskToMove.taskListId) {
                        return { ...list, tasks: [taskToMove, ...(list.tasks || [])] };
                    }
                    if (list.id === oldListId) {
                        return { ...list, tasks: list.tasks?.filter(t => t.id !== taskId) };
                    }
                    return list;
                });
                return { tasks: updatedTasks, taskLists: updatedTaskLists };
            });

            await updateTask(taskId, updatedData);
        } catch (error) {
            toast.error("Failed to update task.");
            set({ tasks: originalState.tasks, taskLists: originalState.taskLists });
        }
    },

    deleteTask: async (taskId: number) => {
        const originalTasks = get().tasks;
        const originalTaskLists = get().taskLists;

        set(state => ({
            tasks: state.tasks.filter(task => task.id !== taskId),
            taskLists: state.taskLists.map(list => ({
                ...list,
                tasks: list.tasks?.filter(task => task.id !== taskId)
            }))
        }));

        try {
            await deleteTask(taskId);
            toast.success("Task deleted!");
        } catch (error) {
            toast.error("Failed to delete task.");
            set({ tasks: originalTasks, taskLists: originalTaskLists });
        }
    },

    toggleTaskStatus: async (taskId: number, currentStatus: string) => {
        const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
        const originalState = { tasks: get().tasks, taskLists: get().taskLists };

        set(state => {
            const updatedTasks = state.tasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            );

            const updatedTaskLists = state.taskLists.map(list => {
                const taskExistsInList = list.tasks?.some(task => task.id === taskId);
                if (taskExistsInList) {
                    return {
                        ...list,
                        tasks: list.tasks.map(task =>
                            task.id === taskId ? { ...task, status: newStatus } : task
                        )
                    };
                }
                return list;
            });
            return { tasks: updatedTasks, taskLists: updatedTaskLists };
        });

        try {
            const taskToUpdate = originalState.tasks.find(t => t.id === taskId);
            if (!taskToUpdate) throw new Error("Tarefa não encontrada");
            await updateTask(taskId, {
                ...taskToUpdate,
                status: newStatus
            });
        } catch (error) {
            console.error("Falha ao atualizar a tarefa:", error);
            toast.error("Não foi possível atualizar a tarefa.");
            set({ tasks: originalState.tasks, taskLists: originalState.taskLists });
        }
    },
});
