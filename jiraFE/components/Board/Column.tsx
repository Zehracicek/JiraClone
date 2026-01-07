
import React from 'react';
import { TaskDTO, TaskStatus } from '../../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: TaskDTO[];
  onTaskSelect: (task: TaskDTO) => void;
  onDropTask: (e: React.DragEvent, status: TaskStatus) => void;
  onDragStart: (e: React.DragEvent, taskId: number) => void;
}

const Column: React.FC<ColumnProps> = ({ title, status, tasks, onTaskSelect, onDropTask, onDragStart }) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO: return 'bg-slate-400';
      case TaskStatus.IN_PROGRESS: return 'bg-blue-500';
      case TaskStatus.DONE: return 'bg-emerald-500';
      case TaskStatus.BLOCKED: return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className="flex flex-col w-[320px] bg-slate-100/50 rounded-2xl p-3 border border-slate-200/50 shadow-inner"
      onDragOver={handleDragOver}
      onDrop={(e) => onDropTask(e, status)}
    >
      <div className="px-3 py-2 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(status)} shadow-sm`}></div>
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">{title}</h3>
        </div>
        <span className="bg-white text-slate-500 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-slate-200 shadow-sm">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-[400px] scrollbar-hide">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onSelect={onTaskSelect} 
            onDragStart={onDragStart}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
            <p className="text-xs font-medium italic">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
