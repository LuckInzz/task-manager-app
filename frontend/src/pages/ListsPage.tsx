import { useState } from "react";
import { Spinner } from "../components/Spinner";
import AddTaskListForm from "../components/AddTaskListForm";
import { useStore } from "../stores/useStore";


const ListsPage = () => {
    //const [type, setType] = useState('col');
    const { taskLists, tasks, isLoading } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [isListModelOpen, setIsListModelOpen] = useState(false);
    const handleListModel = () => setIsListModelOpen(!isListModelOpen);

    const totalTasksCount = tasks.length;
    const completedTasksCount = tasks.filter(task => task.status === 'COMPLETED').length;
    const completionRate = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount ) * 100 : 0;

    const formatDate = (dateString?: string) => {
        if(!dateString) return "N/A";
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})
    }

    const filtered = taskLists.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 sm:p-6 md:p-8 text-slate-500">

            <div className="flex items-center justify-between">
                <h1 className="font-bold text-[32px] text-black">Lists</h1>
                
                <button className="flex items-center py-2 px-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500
                 text-white font-semibold gap-1 cursor-pointer hover:scale-110 transition-all duration-300" onClick={handleListModel}>
                    <span className="text-[18px] pr-1">+</span>
                    <span>New List</span>
                </button>
            </div>

            <div className="flex justify-between flex-col md:flex-row gap-8 mt-8 mb-8 text-[14px]">
                <div className="flex flex-col rounded-lg bg-white h-20 w-full shadow-sm p-4">
                    <p>Total Lists</p>
                    <p className="text-black font-semibold text-[20px]">
                        {taskLists.length}
                    </p>
                </div>

                <div className="flex flex-col rounded-lg bg-white h-20 w-full shadow-sm p-4">
                    <p>Completion Rate </p>
                    <p className="text-purple-500 font-semibold text-[20px]">{completionRate.toFixed(0)}%</p>
                </div>
            </div>

            <div className="flex justify-between bg-white p-4 rounded-lg shadow-sm gap-4">
                <div className="relative flex items-center w-full">
                    <svg className=" absolute w-5 h-5 text-slate-500 ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input type="search" placeholder="Search Lists" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                     className="rounded-lg bg-slate-100 border border-slate-200 pl-10 pr-4 py-2 w-full focus:outline-none"></input>
                </div>

                <div className="flex items-center gap-4">
                    <button className="rounded-lg bg-slate-100 border border-slate-200 p-2 w-10 h-10 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    </button>

                    <button className="rounded-lg bg-slate-100 border border-slate-200 p-2 w-10 h-10 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M21 12H3M12 3v18"/></svg>
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
                ) : taskLists.length === 0 ? (
                    <p className="text-[20px] flex justify-center font-semibold text-slate-800">Lists not found</p>
                ) : (
                    <ul>
                        {filtered.map((list) => {
                            const completedTasksCount = (list.tasks || []).filter(task => task.status === 'COMPLETED').length;
                            const totalTasksCount = (list.tasks || []).length;
                            const progressPercentage = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;
                            
                            return (
                                <li key={list.id} className="flex flex-col bg-white rounded-lg shadow-md hover:shadow-lg 
                                transition-all mb-8 p-4 hover:scale-101 space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <p className={`rounded-full h-4 w-4 bg-${list.color}`}></p>
                                            <p className="text-black font-semibold text-lg">{list.name}</p>
                                        </div>

                                        <button className="flex cursor-pointer hover:bg-slate-100 rounded-lg p-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                                        </button>
                                    </div>

                                    <div>
                                        <p>{list.description}</p>
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

                                    <div className="flex items-center justify-between">
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

                                    <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            <p className="">{formatDate(list.dateCreation)}</p>
                                        </div> 
                                    </div>
                                </li>
                            );
                        })}
                     </ul>
                )}
            </div>


            <AddTaskListForm isOpen={isListModelOpen} onClose={handleListModel}/>
        </div>
    )
}

export default ListsPage;