import { type StateCreator } from 'zustand';
import type { TaskList, CreateTaskList, UpdateTaskList } from '../types/TaskList';
import { getMyTaskLists, createTaskList as createTaskListApi, updateTaskList, deleteTaskList } from '../services/TaskListService';
import { type StoreState } from './useStore';
import toast from 'react-hot-toast';

export interface TaskListSlice {
    taskLists: TaskList[];
    fetchTaskListsData: () => Promise<void>;
    createTaskList: (newTaskListData: CreateTaskList) => Promise<void>;
    updateTaskList: (listId: number, updatedData: UpdateTaskList) => Promise<void>;
    deleteTaskList: (listId: number) => Promise<void>;
}

export const createTaskListSlice: StateCreator<
    StoreState,
    [],
    [],
    TaskListSlice
> = (set, get) => ({
    taskLists: [],

    fetchTaskListsData: async () => {
        try {
            const listsData = await getMyTaskLists();
            set({ taskLists: listsData });
        } catch (err) {
            const errorMessage = "Failed to fetch list data";
            set({ error: errorMessage });
            console.error(err);
            throw new Error(errorMessage);
        }
    },

    createTaskList: async (newTaskListData) => {
        try {
            const newList = await createTaskListApi(newTaskListData);
            set(state => ({ taskLists: [newList, ...state.taskLists] }));
        } catch (error) {
            console.error("Failed to create task list", error);
            throw error;
        }
    },

    updateTaskList: async (listId, updatedData) => {
        const originalState = { tasks: get().tasks, taskLists: get().taskLists };

        set(state => {
            const updatedTaskLists = state.taskLists.map(list =>
                list.id === listId ? { ...list, ...updatedData } : list
            );
            const updatedTasks = state.tasks.map(task => {
                if (task.taskListId === listId) {
                    return {
                        ...task,
                        taskListName: updatedData.name
                    };
                }
                return task;
            });
            return { taskLists: updatedTaskLists, tasks: updatedTasks };
        });

        try {
            await updateTaskList(listId, updatedData);
        } catch (error) {
            toast.error("Failed to update list.");
            set(originalState);
        }
    },

    deleteTaskList: async (listId) => {
        const originalState = { tasks: get().tasks, taskLists: get().taskLists };

        set(state => ({
            taskLists: state.taskLists.filter(list => list.id !== listId),
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
});
