import { useState } from "react";
import AddTaskForm from '../components/AddTaskForm';
import { Spinner } from "../components/Spinner";
import { useStore } from "../stores/useStore";

const TasksPage = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const { tasks, taskLists, isLoading, toggleTaskStatus } = useStore();
    const [isTaskModelOpen, setIsTaskModelOpen] = useState(false);
    const handleTaskModel = () => setIsTaskModelOpen(!isTaskModelOpen);

    const [searchTerm, setSearchTerm] = useState("");

    const filtered = tasks.filter(t =>
        t.taskName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString?: string) => {
        if(!dateString) return "N/A";
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})
    }

    const getPriorityInfo = (priority: String) => {
        switch (priority) {
            case 'LOW':
            return { label: 'Low Priority', bg: 'bg-green-200', text: 'text-green-800' };
            case 'MEDIUM':
            return { label: 'Medium Priority', bg: 'bg-yellow-200', text: 'text-yellow-800' };
            case 'HIGH':
            return { label: 'High Priority', bg: 'bg-red-200', text: 'text-red-800' };
            default:
            return { label: 'No Priority', bg: 'bg-gray-200', text: 'text-gray-800' };
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 text-slate-500">

            <div className="flex items-center justify-between">
                <h1 className="font-bold text-[32px] text-black">Tasks</h1>
                
                <button className="flex items-center py-2 px-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500
                 text-white font-semibold gap-1 cursor-pointer hover:scale-110 transition-all duration-300" onClick={handleTaskModel}>
                    <span className="text-[18px] pr-1">+</span>
                    <span>New Task</span>
                </button>
            </div>

            <div className="flex justify-between flex-col md:flex-row gap-8 mt-8 mb-8 text-[14px]">
                <div className="flex flex-col rounded-lg bg-white h-20 w-full shadow-sm p-4">
                    <p>Total tasks</p>
                    <p className="text-black font-semibold text-[20px]">{tasks.length}</p>
                </div>

                <div className="flex flex-col rounded-lg bg-white h-20 w-full shadow-sm p-4">
                    <p>Pending tasks</p>
                    <p className="text-orange-400 font-semibold text-[20px]">
                        {tasks.filter(task => task.status  != 'COMPLETED').length}
                    </p>
                </div>

                <div className="flex flex-col rounded-lg bg-white h-20 w-full shadow-sm p-4">
                    <p>Completed tasks</p>
                    <p className="text-green-500 font-semibold text-[20px]">
                        {tasks.filter(task => task.status  == 'COMPLETED').length}
                    </p>
                </div>
            </div>

            <div className="flex justify-between bg-white p-4 rounded-lg shadow-sm gap-4">
                <div className="relative flex items-center w-full">
                    <svg className=" absolute w-5 h-5 text-slate-500 ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input type="search" placeholder="Search tasks" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                     className="rounded-lg bg-slate-100 border border-slate-200 pl-10 pr-4 py-2 w-full focus:outline-none"></input>
                </div>

                <div className="flex items-center gap-4">
                    <button className="rounded-lg bg-slate-100 border border-slate-200 px-8 py-2 cursor-pointer">
                        <span>filtro</span>
                    </button>

                    <button className="rounded-lg bg-slate-100 border border-slate-200 px-8 py-2 cursor-pointer">
                        <span>filtro</span>
                    </button>
                </div>
            </div>

            <div className="mt-8">
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <Spinner h={10} bg={"text-white"} color={"fill-purple-500"}/>
                    </div>
                ) : errorMessage ? (
                    <p className="text-red-500">{errorMessage}</p>
                ) : tasks.length === 0 ? (
                    <p className="text-[20px] flex justify-center font-semibold text-slate-800">Tasks not found</p>
                ) : (
                    <ul>
                        {filtered.map((task) => {
                            const isCompleted = task.status === 'COMPLETED';
                            return(
                                <li key={task.id} className={`flex justify-between items-center bg-white rounded-lg shadow-md hover:shadow-lg 
                                mb-8 p-4 hover:scale-101 transition-all ${isCompleted ? 'opacity-50' : 'hover:scale-101'}
                                ${isCompleted}`}>
                                    <div className="flex items-center gap-2 md:gap-4">
                                        <div className="flex items-center gap-2 md:gap-4">
                                            <button onClick={() => toggleTaskStatus(task.id, task.status)}
                                            className={`w-6 h-6 rounded-full border transition-all
                                            ${isCompleted ? 'bg-green-500 border-green-500' : 'cursor-pointer border-black'}`}>
                                                {isCompleted && 
                                                    <svg className="text-white px-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                }
                                            </button>
                                            <p className={`text-black font-semibold text-sm md:text-lg ${isCompleted ? 'line-through' : ''}`}>{task.taskName}</p>
                                        </div>
        
                                        <div>
                                            <p className={`${isCompleted ? 'line-through' : ''}`}>{task.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-sm gap-4 md:gap-8">
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            <p className="">{formatDate(task.dateCreation)}</p>
                                        </div>
                                        <p className={`px-3 py-1 rounded-xl font-semibold text-white text-xs md:text-sm
                                            bg-${(taskLists.find(list => list.id === task.taskListId)?.color || 'gray-200')}`}>
                                            {task.taskListName != null ? task.taskListName : 'None'}
                                        </p>
                                        {(() => {
                                            const { label, bg, text } = getPriorityInfo(task.priority);
                                            return (
                                                <p className={`px-3 py-1 rounded-xl text-xs md:text-sm font-semibold ${bg} ${text}`}>{label}</p>
                                            );
                                        })()}
                                        <button className="cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                     </ul>
                )}
            </div>

            <AddTaskForm isOpen={isTaskModelOpen} onClose={handleTaskModel}/>
        </div>
    )
}

export default TasksPage;