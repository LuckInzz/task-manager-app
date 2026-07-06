import { useState } from "react";
import AddTaskForm from '../components/AddTaskForm';
import { Spinner } from "../components/Spinner";
import { useStore } from "../stores/useStore";
import { TaskItem } from "../components/TaskItem";

const TasksPage = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const { tasks, isLoading } = useStore();
    const [isTaskModelOpen, setIsTaskModelOpen] = useState(false);
    const handleTaskModel = () => setIsTaskModelOpen(!isTaskModelOpen);

    const [isTaskConfigOpen, setIsTaskConfigOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");

    const filtered = tasks.filter(t =>
        t.taskName.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

            <div className="flex flex-col md:flex-row justify-between bg-white p-4 rounded-lg shadow-sm gap-4">
                <div className="relative flex items-center w-full">
                    <svg className=" absolute w-5 h-5 text-slate-500 ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input type="search" id="task-search" placeholder="Search tasks" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                     className="rounded-lg bg-slate-100 border border-slate-200 pl-10 pr-4 py-2 w-full focus:outline-none"></input>
                </div>

                <div className="flex justify-center items-center gap-4">
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
                    <p className="text-lg flex justify-center font-semibold">You have no task created</p>
                ) : (
                    <ul>
                        {filtered.map((task) => (
                            <TaskItem key={task.id} task={task} variant="card"/>
                        ))}
                    </ul>
                )}
            </div>

            <AddTaskForm isOpen={isTaskModelOpen} onClose={handleTaskModel}/>
        </div>
    )
}

export default TasksPage;