import React, { useState, useEffect, type JSX } from "react";
import type { TaskList } from "../types/TaskList";
import api from "../services/api";
import type { UserResponse } from "../types/Auth";

interface SidebarProps {
    onLogout: () => void;
    user: UserResponse | null;
}

const NavItem = ({ icon, text, href = "#" }: { icon: JSX.Element, text: string, href?: string }) => (
    <a href={href} className="flex items-center p-2 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors">
        <div className="w-6 h-6 flex-shrink-0">{icon}</div>
        <span className="ml-4 font-medium">{text}</span>
    </a>
);

const Sidebar = ( { onLogout, user }:SidebarProps ) => {
    const [taskList, setTaskList] = useState<TaskList[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading , setIsLoading] = useState(false);

    const fetchTaskList = async () => {
        setIsLoading(true);
        setErrorMessage('');

        try{
            const endpoint = `task_list/user`
            const response = await api.get(endpoint);
            const data = response.data;
            if (data.Response === 'False'){
                setErrorMessage(data.Error || 'Failed to fetch tasks');
                setTaskList([]);
                return;
            }

            if (data.length === 0) {
                setTaskList([]);
                return;
            }
            
            setTaskList(data);
            console.log(data);
        } catch (error) {
            console.error(`Error fetching task list: ${error}`);
            setErrorMessage('Error fetching task list. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchTaskList();
    }, []);

    return (
        <aside className="flex flex-col w-70 bg-gray-100 text-gray-600 p-2 rounded-lg">
            <div className="flex justify-between items-center mb-16 mt-2 mx-2">
                <div className="w-12">
                    <img src="src/assets/logo-no-bg.png" className=""/>
                </div>
                <h1 className="text-[10px] sm:text-[15px] md:text-[24px] font-bold">TaskManager</h1>
                <button /*onClick={onClose}*/ className="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
            </div>

            <nav className="flex-grow flex flex-col mx-3">
                <ul className="space-y-1">
                    <div className="flex gap-4 py-2 px-1 rounded-lg items-center cursor-pointer hover:bg-gray-200 hover:font-semibold">
                        <svg className="w-auto h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <li>My Tasks</li>
                        <div className="flex justify-end items-center">
                            <p className="rounded-sm px-3 bg-white">6</p>
                        </div>
                    </div>

                    <p>---------------------------------------------</p>

                    <div className="flex flex-col">

                        <div className="flex gap-4 py-2 px-1 rounded-lg items-center cursor-pointer hover:bg-gray-200 hover:font-semibold">
                            <svg className="w-auto h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            <p>List</p>
                        </div>

                        <div className="space-y-2 text-[14px] mx-6 my-2">
                            {isLoading && <p className="p-2">Loading...</p>}
                            {errorMessage && <p className="p-2">{errorMessage}</p>}
                            {taskList.map((list) => (
                                <button className="flex items-center gap-2 w-full py-2 px-2 rounded-lg cursor-pointer hover:bg-gray-200 hover:font-semibold">
                                    <p className={`rounded-sm h-4 w-4 bg-blue-600`}/> {/* ${list.color} */}
                                    <p key={list.id}>{list.name}</p>
                                    <div className="flex justify-end items-center">
                                        <p className="rounded-sm px-3 bg-white">3</p>
                                    </div>
                                </button>
                            ))}
                            <button className="flex items-center gap-2 w-full pl-1 py-1.5 px-0.5 rounded-lg cursor-pointer hover:bg-gray-200 hover:font-semibold">
                                <svg className="w-auto h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Add New List
                            </button>
                        </div>
                    </div>

                    <p>---------------------------------------------</p>

                    <div className="flex gap-4 py-2 px-1 rounded-lg items-center cursor-pointer hover:bg-gray-200 hover:font-semibold">
                        <svg  className="w-auto h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
                        <li>Dashboard</li>
                    </div>
                </ul>
            </nav>

            <button onClick={onLogout} className="flex gap-4 mx-2 mb-2 py-2 px-1 rounded-lg items-center cursor-pointer hover:bg-gray-200 hover:font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 17l5-5-5-5M19.8 12H9M10 3H4v18h6"/></svg>
                <p className="">Sign-out</p>
            </button>
        </aside>
    )
}

export default Sidebar;