// Define a "forma" de um objeto Task, espelhando nossa entidade Java.
export interface Task {
    id: number;
    taskName: string;
    description: string;
    status: string;
    priority: string;
    dateCreation: string; // Datas vêm como string no formato ISO (ex: "2025-08-07T22:30:00")
    taskListId: number;
    taskListName: string;
}

export interface CreateTask {
    taskName: string;
    description: string;
    priority: string;
    taskListId: number;
}

export interface UpdateTask {
    taskName: string;
    description: string;
    status: string;
    priority: string;
    taskListId: number;
}