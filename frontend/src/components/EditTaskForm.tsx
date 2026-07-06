import React, { useState } from "react";
import { Spinner } from "./Spinner";
import { useStore } from '../stores/useStore'
import type { Task } from "../types/Task";
import toast from "react-hot-toast";

interface EditTaskFormProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ isOpen, onClose, task }) => {
    if(!isOpen){
        return null;
    }

    const [taskName, setTaskName] = useState(task.taskName);
    const [description, setDescription] = useState(task.description);
    const [status, setStatus] = useState(task.status)
    const [priority, setPriority] = useState(task.priority); // Prioridade 'Baixa' como padrão
    const [taskListId, setTaskListId] = useState(task.taskListId); // Futuramente, o ID do grupo
    const { taskLists, updateTask } = useStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault()  // Impede o recarregamento da pag
      setIsSubmitting(true)

      if(!taskName.trim()){
        return;
      }

      const updatedTask = {
        taskName: taskName,
        description: description,
        status: status,
        priority: priority,
        taskListId: taskListId
      }

      try{
        await updateTask(task.id, updatedTask);
        toast.success("Task updated with success!")
        //fetchTasksData();
        onClose();
      
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    };

    return(
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" //onClick={onClose}
      >
      <div 
        className="relative bg-white w-full max-w-lg rounded-xl shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 3. O Cabeçalho do Modal */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-black">Update Task</h2>
          {/* Botão de Fechar */}
          <button onClick={onClose} className="text-text-light rounded-lg p-2 cursor-pointer hover:text-red-500 hover:bg-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* 4. O Corpo do Formulário (com os inputs) */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Input para o Nome da Tarefa */}
            <div>
              <label htmlFor="taskName" className="block text-sm font-medium  mb-1">Task Name</label>
              <input type="text" id="taskName" value={taskName} onChange={(e) => setTaskName(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            {/* Input para a Descrição */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-secondary mb-1">Description(Opcional)</label>
              <textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"></textarea>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/*Botao para seleção de grupos*/}
                <div>
                    <label htmlFor="taskGroup" className="block text-sm">List</label>
                    <select id="taskGroup" value={taskListId} onChange={(e) => setTaskListId(Number(e.target.value))}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white cursor-pointer">
                        <option value={0}>None</option>
                        {taskLists.length !== 0 && taskLists.map((list) => (
                        <option key={list.id} value={list.id}>{list.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="taskPriority" className="block text-sm">Status</label>
                    <select id="taskPriority" value={status} onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white cursor-pointer">
                        <option value={"PENDING"}>PENDING</option>
                        <option value={"COMPLETED"}>COMPLETED</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="taskPriority" className="block text-sm">Priority</label>
                    <select id="taskPriority" value={priority} onChange={(e) => setPriority(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white cursor-pointer">
                        <option value={"LOW"}>Low</option>
                        <option value={"MEDIUM"}>Medium</option>
                        <option value={"HIGH"}>High</option>
                    </select>
                </div>
            </div>

                {/* 5. O Rodapé com os Botões de Ação */}
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-slate-100 cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg 
              bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:scale-105 transition-all 
              cursor-pointer disabled:hover:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? <Spinner h={5} bg={"text-white"} color={"fill-purple-500"}/> : 'Update Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    )
}

export default EditTaskForm