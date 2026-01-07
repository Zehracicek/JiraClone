
import React from 'react';
import { Priority, TaskDTO } from '../../types';
import { AlertCircle, ArrowUp, ArrowDown, Minus, MoreHorizontal } from 'lucide-react';

interface TaskCardProps {
  task: TaskDTO;
  onSelect: (task: TaskDTO) => void;
  onDragStart: (e: React.DragEvent, taskId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onSelect, onDragStart }) => {
  const getPriorityInfo = (priority: Priority) => {
    switch (priority) {
      case Priority.CRITICAL: return { icon: <AlertCircle className="text-red-500" size={14} />, color: 'bg-red-50' };
      case Priority.HIGH: return { icon: <ArrowUp className="text-orange-500" size={14} />, color: 'bg-orange-50' };
      case Priority.MEDIUM: return { icon: <Minus className="text-blue-500" size={14} />, color: 'bg-blue-50' };
      case Priority.LOW: return { icon: <ArrowDown className="text-slate-400" size={14} />, color: 'bg-slate-50' };
      default: return { icon: null, color: 'bg-gray-50' };
    }
  };

  const priorityInfo = getPriorityInfo(task.priority);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onSelect(task)}
      className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all duration-200 group mb-3 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-blue-500 transition-all"></div>
      
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PROJ-{task.id}</span>
        <button className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <h4 className="text-sm font-semibold text-slate-800 mb-3 leading-relaxed">
        {task.title}
      </h4>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded ${priorityInfo.color}`}>
            {priorityInfo.icon}
          </div>
          {task.priority === Priority.CRITICAL && (
            <span className="text-[9px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded uppercase">Urgent</span>
          )}
        </div>
        
        <div className="flex items-center -space-x-1">
          {task.assignee ? (
            <div 
              title={task.assignee.fullName}
              className="w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold ring-1 ring-slate-100"
            >
              {task.assignee.username.substring(0, 2).toUpperCase()}
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-slate-400 ring-1 ring-slate-100">
              <span className="text-[10px]">?</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
