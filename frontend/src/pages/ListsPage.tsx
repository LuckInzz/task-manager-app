import { useState } from "react";
import { Spinner } from "../components/Spinner";
import AddTaskListForm from "../components/AddTaskListForm";
import { useStore } from "../stores/useStore";
import { TaskListItem } from "../components/TaskListItem";


const ListsPage = () => {
    //const [type, setType] = useState('col');
    const { taskLists, tasks, isLoading } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [isAddListModelOpen, setIsAddListModelOpen] = useState(false);
    const handleAddListModel = () => setIsAddListModelOpen(!isAddListModelOpen);

    const totalTasksCount = tasks.filter(task => task.taskListId > 0).length;
    const completedTasksCount = tasks.filter(task => task.status === 'COMPLETED').length;
    const completionRate = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount ) * 100 : 0;

    const filtered = taskLists.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 sm:p-6 md:p-8 text-slate-500">

            <div className="flex items-center justify-between">
                <h1 className="font-bold text-[32px] text-black">Lists</h1>
                
                <button className="flex items-center py-2 px-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500
                 text-white font-semibold gap-1 cursor-pointer hover:scale-110 transition-all duration-300" onClick={handleAddListModel}>
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
                    <input type="search" id="list-search" placeholder="Search Lists" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                     className="rounded-lg bg-slate-100 border border-slate-200 pl-10 pr-4 py-2 w-full focus:outline-none"></input>
                </div>

                <div className="flex items-center gap-4">
                    <button className="rounded-lg bg-slate-100 border border-slate-200 p-2 w-10 h-10 cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    </button>

                    <button className="rounded-lg bg-slate-100 border border-slate-200 p-2 w-10 h-10 cursor-not-allowed">
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
                    <p className="text-lg flex justify-center font-semibold">You have no list created</p>
                ) : (
                    <ul>
                        {filtered.map((list) => (
                           <TaskListItem key={list.id} taskList={list}/>
                        ))}
                    </ul>
                )}
            </div>

            <AddTaskListForm isOpen={isAddListModelOpen} onClose={handleAddListModel}/>
        </div>
    )
}

export default ListsPage;