import { useState } from "react";
import type { TaskList } from "../types/TaskList";
import { useStore } from '../stores/useStore'
import { AnimatePresence, motion } from "framer-motion";
import { TaskItem } from "./TaskItem";
import { Spinner } from "./Spinner";
import EditTaskListForm from "./EditTaskListForm";

interface TaskItemProps {
    taskList: TaskList;
}

export const TaskListItem: React.FC<TaskItemProps> = ({ taskList }) => {

    const completedTasksCount = (taskList.tasks || []).filter(task => task.status === 'COMPLETED').length;
    const totalTasksCount = (taskList.tasks || []).length;
    const progressPercentage = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;
    const [isListOpen, setIsListOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isListOptionsOpen, setIsListOptionsOpen] = useState(false);
    const { deleteTaskList, isLoading } = useStore();
    const [errorMessage, setErrorMessage] = useState('');

    const handleDelete = () => {
        if (window.confirm("Are you sure that you want to delete this list?")) {
            deleteTaskList(taskList.id);
        }
        setIsListOptionsOpen(false);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }

    return (
        <div key={taskList.id} className="flex flex-col bg-white rounded-lg shadow-md hover:shadow-xl 
            transition-shadow duration-300 mb-8 p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    {isListOpen ? <svg onClick={() => setIsListOpen(!isListOpen)} className="cursor-pointer rounded-lg hover:bg-slate-200" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                        : <svg onClick={() => setIsListOpen(!isListOpen)} className="cursor-pointer rounded-lg hover:bg-slate-200" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    }
                    <p className={`rounded-full h-4 w-4 bg-${taskList.color}`}></p>
                    <p className="text-black font-semibold text-lg">{taskList.name}</p>
                </div>

                <button onClick={() => setIsListOptionsOpen(!isListOptionsOpen)} className="flex cursor-pointer hover:bg-slate-100 text-black rounded-lg px-1 py-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                </button>
                {isListOptionsOpen && (
                    <div className={`absolute mt-30 md:mt-36 right-4 shadow-lg text-sm md:text-base 
                        p-1 md:p-2 bg-white rounded-lg z-50`}>
                        <ul>
                            <li>
                                <button onClick={() => { setIsEditModalOpen(true); setIsListOptionsOpen(false); }}
                                    className='w-full rounded-lg hover:bg-slate-100 p-2 cursor-pointer'>
                                    Edit List
                                </button>
                            </li>
                            <li>
                                <button onClick={handleDelete} className='w-full rounded-lg text-red-500 hover:bg-red-200 p-2 cursor-pointer'>
                                    Delete List
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div>
                <p>{taskList.description}</p>
            </div>

            <div>
                <div className="flex justify-between">
                    <p>Progress</p>
                    <p className="text-md text-slate-500 mt-1">{progressPercentage.toFixed(0)}%</p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 mt-1">
                    <div
                        className="bg-gradient-to-r from-indigo-500 to bg-purple-500 h-2.5 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
                        <p>{totalTasksCount} tasks</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="text-green-500" xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <p className="text-green-500">
                            {completedTasksCount} completed
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <p className="">{formatDate(taskList.dateCreation)}</p>
                    </div>
                </div>
            </div>
            <AnimatePresence initial={false}>
                {isListOpen && (
                    <motion.div
                        key="taskList"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className={`overflow-hidden ${taskList.tasks && taskList.tasks.length > 0 ? 'mt-4' : ''}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <Spinner h={10} bg={"text-white"} color={"fill-purple-500"} />
                            </div>
                        ) : errorMessage ? (
                            <p className="text-red-500">{errorMessage}</p>
                        ) : !taskList.tasks || taskList.tasks.length === 0 ? (
                            <p className="text-md flex justify-center font-semibold">List dont have any task</p>
                        ) : (
                            <ul className="space-y-4">
                                {taskList.tasks.map((task) => (
                                    <TaskItem key={task.id} task={task} variant="list" />
                                ))}
                            </ul>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <EditTaskListForm isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} taskList={taskList} />
        </div>
    );
}