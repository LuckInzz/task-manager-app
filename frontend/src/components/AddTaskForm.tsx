import React, { useState } from "react";
import type { Task } from '../types/Task';
import api from '../services/api';

interface AddTaskFormProps {
    isOpen: boolean;
    onClose: () => void;
    // Passa a nova tarefa de volta para o componente pai.
    onTaskCreated: (newTask: Task) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ isOpen, onClose, onTaskCreated }) => {
    if(!isOpen){
        return null;
    }

    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState("LOW"); // Prioridade 'Baixa' como padrão
    //const [groupId, setGroupId] = useState(1); // Futuramente, o ID do grupo

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault()  // Impede o recarregamento da pag

      if(!taskName.trim()){
        return;
      }

      setIsSubmitting(true)

      const newTaskData = {
        taskName,
        description,
        priority
      };

      try{
        const response = await api.post<Task>('/tasks', newTaskData);

        onTaskCreated(response.data);

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
          <h2 className="text-2xl font-bold text-text-main">Create New Task</h2>
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
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
            </div>
            {/* Input para a Descrição */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-secondary mb-1">Description(Opcional)</label>
              <textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"></textarea>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/*Botao para seleção de grupos*/}
              <div>
                <label htmlFor="taskGroup" className="block text-sm">Group</label>
                <select id="taskGroup" 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer">
                  <option>None</option>
                </select>
              </div>
              <div>
                <label htmlFor="taskPriority" className="block text-sm">Prioridade</label>
                <select id="taskPriority" value={priority} onChange={(e) => setPriority(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer">
                  <option value={"LOW"}>Baixa</option>
                  <option value={"MEDIUM"}>Média</option>
                  <option value={"HIGH"}>Alta</option>
                </select>
              </div>
            </div>

                {/* 5. O Rodapé com os Botões de Ação */}
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-blue-600 text-white 
              hover:opacity-80 cursor-pointer disabled:hover:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? 'Saving Task...' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    )
}

export default AddTaskForm