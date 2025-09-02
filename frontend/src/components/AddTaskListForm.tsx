import React, { useState } from "react";
import api from '../services/api';
import type { TaskList } from "../types/TaskList";
import { useStore } from '../stores/useStore'

interface AddTaskListFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddTaskListForm: React.FC<AddTaskListFormProps> = ({ isOpen, onClose }) => {
    if(!isOpen){
        return null;
    }

    const [taskListName, setTaskListName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState(""); 
    const { createTaskList } = useStore();

    const colors = [
      "green-200", "green-500", "green-800",
      "blue-200", "blue-500", "blue-800",
      "purple-200", "purple-500", "purple-800",
      "red-500", "red-800",
      "yellow-200", "yellow-500", "yellow-800",
      "pink-200", "pink-500", "pink-800",
      "teal-200", "teal-500", "teal-800",
      "orange-200", "orange-500",
    ];

    const colorClasses: Record<string, string> = {
      "green-200": "bg-green-200",
      "green-500": "bg-green-500",
      "green-800": "bg-green-800",

      "blue-200": "bg-blue-200",
      "blue-500": "bg-blue-500",
      "blue-800": "bg-blue-800",

      "purple-200": "bg-purple-200",
      "purple-500": "bg-purple-500",
      "purple-800": "bg-purple-800",

      "red-500": "bg-red-500",
      "red-800": "bg-red-800",

      "yellow-200": "bg-yellow-200",
      "yellow-500": "bg-yellow-500",
      "yellow-800": "bg-yellow-800",

      "pink-200": "bg-pink-200",
      "pink-500": "bg-pink-500",
      "pink-800": "bg-pink-800",

      "teal-200": "bg-teal-200",
      "teal-500": "bg-teal-500",
      "teal-800": "bg-teal-800",

      "orange-200": "bg-orange-200",
      "orange-500": "bg-orange-500",
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault()  // Impede o recarregamento da pag

      if(!taskListName.trim()){
        return;
      }

      setIsSubmitting(true)

      const newTaskListData = {
        name: taskListName,
        description: description,
        color: color
      };

      try{
        await createTaskList(newTaskListData);

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
          <h2 className="text-2xl font-semibold text-black">Create New List</h2>
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
              <label htmlFor="ListName" className="block text-sm font-medium  mb-1">List Name</label>
              <input type="text" id="ListName" value={taskListName} onChange={(e) => setTaskListName(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            {/* Input para a Descrição */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-secondary mb-1">Description(Opcional)</label>
              <textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"></textarea>
            </div>

            <div>
              <label className="block text-sm mb-1">Color</label>
              <div className="grid grid-cols-6 md:grid-cols-11 gap-1">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-lg border-2 ${colorClasses[c]} cursor-pointer hover:scale-110 transition-all
                      ${color === c ? 'border-black' : 'border-slate-300'} `}
                  />
                ))}
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
                {isSubmitting ? 'Saving List...' : 'Create List'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    )
}

export default AddTaskListForm