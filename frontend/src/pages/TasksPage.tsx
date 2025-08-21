import React, { useState, useEffect } from "react";
import { useDebounce } from 'react-use'
import api from "../services/api";
import type { Task } from "../types/Task";
import AddTaskForm from '../components/AddTaskForm';

const TasksPage: React.FC = () => {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]); 

    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading , setIsLoading] = useState(false);

    const [isTaskModelOpen, setIsTaskModelOpen] = useState(false);
    const handleTaskModel = () => setIsTaskModelOpen(!isTaskModelOpen);
 
    const fetchTasks = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('');

        try{
            const endpoint = query
                ? `/tasks/search?name=${encodeURIComponent(query)}`
                : `/tasks/user`;

            const response = await api.get(endpoint);

            const data = response.data;

            if (data.Response === 'False'){
                setErrorMessage(data.Error || 'Failed to fetch tasks');
                setTasks([]);
                return;
            }

            if (data.length === 0) {
                setTasks([]);
                return;
            }

            setTasks(data);
            console.log(data);

        } catch (error){
            console.error(`Error fetching tasks: ${error}`);
            setErrorMessage('Error fetching tasks. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchTasks(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

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

    const handleTaskCreated = (newTask: Task) => {
        // Adiciona a nova tarefa no início da lista existente
        setTasks(currentTasks => [newTask, ...currentTasks]);
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="font-bold text-[10px] sm:text-[15px] md:text-[25px] mb-8">My Tasks</h1>

            <div className="flex flex-row justify-between gap-4 mb-6">

                <div className="relative flex items-center">
                    <svg className=" absolute w-5 h-5 text-slate-400 ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input type="search" placeholder="Search tasks" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                     className="rounded-lg bg-white border w-full pl-10 pr-4 py-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"></input>
                </div>

                <button className="flex items-center py-2 px-4 rounded-lg bg-blue-700 hover:bg-blue-800
                 text-white font-semibold gap-1 cursor-pointer" onClick={handleTaskModel}>
                    <span className="text-[18px] pr-1">+</span>
                    <span>New Task</span>
                </button>

            </div>

            <div>
                {isLoading ? (
                    <p>Loading...</p>
                ) : errorMessage ? (
                    <p className="text-red-500">{errorMessage}</p>
                ) : tasks.length === 0 ? (
                    <p className="text-[20px] flex justify-center font-semibold text-slate-800">Tasks not found</p>
                ) : (
                    <ul>
                        {tasks.map((task) => (
                            <li key={task.id} className="flex justify-between items-center bg-white rounded-lg shadow-md hover:shadow-lg 
                            transition-shadow mb-8 p-4 hover:scale-101">
                                <div className="flex gap-2 md:gap-4">
                                    <input type="checkbox" className="h-6 w-6 rounded-md text-blue-600 cursor-pointer"></input>
                                    <p className="text-slate-800 font-semibold text-lg">{task.taskName}</p>
                                </div>

                                <div className="flex items-center text-sm gap-10">
                                    <p className="text-slate-400">{formatDate(task.dateUpdate)}</p>
                                    <p className="px-3 py-1 rounded-xl font-semibold bg-purple-200 text-purple-800">
                                        {task.taskListName != null ? task.taskListName : 'None'}
                                    </p>
                                    {(() => {
                                        const { label, bg, text } = getPriorityInfo(task.priority);
                                        return (
                                            <p className={`px-3 py-1 rounded-xl font-semibold ${bg} ${text}`}>{label}</p>
                                        );
                                    })()}
                                    <button className="cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                     </ul>
                )}
            </div>

            <AddTaskForm isOpen={isTaskModelOpen} onClose={handleTaskModel} onTaskCreated={handleTaskCreated}/>
        </div>
    )
}

export default TasksPage;