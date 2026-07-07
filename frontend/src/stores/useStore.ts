import { create } from 'zustand';
import { type AuthSlice, createAuthSlice } from './authSlice';
import { type TaskSlice, createTaskSlice } from './taskSlice';
import { type TaskListSlice, createTaskListSlice } from './taskListSlice';
import { getMyTasks } from '../services/TaskService';
import { getMyTaskLists } from '../services/TaskListService';

export interface AppState {
    isLoading: boolean;
    error: string | null;
}

export interface AppActions {
    fetchInitialData: () => Promise<void>;
}

export type StoreState = AppState & AppActions & AuthSlice & TaskSlice & TaskListSlice;

export const useStore = create<StoreState>()((...a) => ({
    isLoading: false,
    error: null,

    fetchInitialData: async () => {
        try {
            const [tasksData, listsData] = await Promise.all([
                getMyTasks(),
                getMyTaskLists()
            ]);
            a[0]({ tasks: tasksData, taskLists: listsData });
        } catch (err) {
            const errorMessage = "Failed to fetch initial data";
            a[0]({ error: errorMessage });
            console.error(err);
            throw new Error(errorMessage);
        }
    },

    ...createAuthSlice(...a),
    ...createTaskSlice(...a),
    ...createTaskListSlice(...a),
}));