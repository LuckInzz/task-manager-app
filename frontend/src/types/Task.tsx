// Define a "forma" de um objeto Task, espelhando nossa entidade Java.
export interface Task {
    id: number;
    taskName: string;
    description: string;
    done: boolean;
    priority: number;
    dateCreation: string; // Datas vêm como string no formato ISO (ex: "2025-08-07T22:30:00")
    dateUpdate: string;
}