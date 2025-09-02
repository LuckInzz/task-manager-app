import type { Task } from "./Task";

export interface TaskList {
    id: number;
    name: string;
    description: string;
    dateCreation: string;
    color: string;
    tasks: Task[];
}

export interface CreateTaskList {
    name: string;
    description: string;
    color: string;
}