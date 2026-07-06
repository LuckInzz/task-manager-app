import type { Task } from '../types/Task';
import { useStore } from '../stores/useStore'
import { useState } from 'react';
import EditTaskForm from './EditTaskForm';

interface TaskItemProps {
    task: Task;
    variant?: 'card' | 'list'; // Pode ser 'card' (com sombra) ou 'list' (simples)
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, variant = 'card' }) => {
    const isCompleted = task.status === 'COMPLETED';
    const { toggleTaskStatus, taskLists, deleteTask } = useStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isTaskOptionsOpen, setIsTaskOptionsOpen] = useState(false);

    const getPriorityInfo = (priority: String) => {
        switch (priority) {
            case 'LOW':
                return { label: 'Low Priority', bg: 'bg-green-500', text: 'text-white' };
            case 'MEDIUM':
                return { label: 'Medium Priority', bg: 'bg-yellow-500', text: 'text-white' };
            case 'HIGH':
                return { label: 'High Priority', bg: 'bg-red-500', text: 'text-white' };
            default:
                return { label: 'No Priority', bg: 'bg-gray-500', text: 'text-white' };
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure that you want to delete this task?")) {
            deleteTask(task.id);
        }
        setIsTaskOptionsOpen(false);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }

    const taskItemStyles = {
        base: {
            container: "flex flex-col md:flex-row md:justify-between md:items-center bg-white rounded-lg p-3 md:p-4 md:gap-4 space-y-2 md:space-y-0",
            title: "font-semibold text-black",
            button: "w-6 h-6 rounded-full flex-shrink-0 border-2 transition-all flex items-center justify-center",
            checkIcon: "rounded-full border cursor-pointer",
            tagsContainer: "flex items-center text-xs gap-2", // Tamanho de fonte base para as tags
        },
        variants: {
            card: {
                container: "shadow-md hover:shadow-lg mb-4",
                title: "text-base md:text-lg",
                checkIcon: "h-5 w-5 md:h-6 md:w-6",
                description: "text-sm md:text-base", // Mostra a descrição
            },
            list: {
                container: "border border-slate-300",
                title: "text-sm md:text-base",
                checkIcon: "h-4 w-4 md:h-5 md:w-5",
                description: "text-xs md:text-sm", // Esconde a descrição para uma vista mais compacta
            }
        }
    }

    return (
        <>
            <div key={task.id} className={`${taskItemStyles.base.container} ${taskItemStyles.variants[variant].container} 
        ${isCompleted ? 'opacity-50' : ''}`}>

                {/* Check + Title */}
                <div className='flex flex-col md:grid md:grid-cols-[minmax(150px,250px)_minmax(200px,300px)] gap-2 md:gap-0'>
                    <div className='flex items-center gap-2 md:gap-4'>
                        <button onClick={() => toggleTaskStatus(task.id, task.status)}
                            className={`${taskItemStyles.base.checkIcon} ${taskItemStyles.variants[variant].checkIcon}
                            ${isCompleted ? 'bg-green-500 border-green-500' : 'border-black'}`}>
                            {isCompleted &&
                                <svg className="text-white px-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            }
                        </button>
                        <p className={`text-black font-semibold ${taskItemStyles.variants[variant].title} ${isCompleted ? 'line-through' : ''}`}>{task.taskName}</p>
                    </div>

                    {/* Description */}
                    <div className='flex items-center'>
                        <p className={`${taskItemStyles.variants[variant].description} ${isCompleted ? 'line-through' : ''}`}>{task.description}</p>
                    </div>

                </div>


                {/* Dates + Badges */}
                <div className='flex flex-col md:flex-row gap-2 md:gap-0'>
                    {/* Dates */}
                    <div className={`flex md:grid md:grid-cols-[minmax(100px,200px)_minmax(100px,200px)] gap-4 ${taskItemStyles.variants[variant].description}`}>
                        <div className='flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <p className="">{formatDate(task.dateCreation)}</p>
                        </div>

                        <div className='flex items-center gap-2'>
                            <p>Data prevista</p>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className='flex items-center justify-between md:grid md:grid-cols-[260px_25px]'>
                        <div className='flex gap-4 md:grid md:grid-cols-[140px_minmax(50px,200px)]'>
                            <div className='flex justify-end'>
                                {(() => {
                                    const { label, bg, text } = getPriorityInfo(task.priority);
                                    return (
                                        <p className={`flex px-3 py-1 rounded-xl text-xs md:text-sm font-semibold ${bg} ${text}`}>{label}</p>
                                    );
                                })()}
                            </div>

                            <div className='flex'>
                                {variant != 'list' &&
                                    <p className={`px-3 py-1 rounded-xl font-semibold text-white text-xs md:text-sm
                                        bg-${(taskLists.find(list => list.id === task.taskListId)?.color || 'gray-500')}`}>
                                        {/* {task.taskListName != null ? task.taskListName : 'None'} */}
                                        {task.taskListName || 'None'}
                                    </p>
                                }
                            </div>
                        </div>

                        <button onClick={() => setIsTaskOptionsOpen(!isTaskOptionsOpen)} className="flex cursor-pointer hover:bg-slate-100 text-black rounded-lg px-1 py-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                        </button>
                        {isTaskOptionsOpen && (
                            <div className={`absolute mt-30 md:mt-36 right-4 shadow-lg text-sm md:text-base 
                                p-1 md:p-2 bg-white rounded-lg z-50`}>
                                <ul>
                                    <li>
                                        <button onClick={() => { setIsEditModalOpen(true); setIsTaskOptionsOpen(false); }}
                                            className='w-full rounded-lg hover:bg-slate-100 p-2 cursor-pointer'>
                                            Edit Task
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={handleDelete} className='w-full rounded-lg text-red-500 hover:bg-red-200 p-2 cursor-pointer'>
                                            Delete Task
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <EditTaskForm isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} task={task} />
        </>
    )
}