
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TaskDTO, UserDTO, TaskStatus, Priority } from '../types';
// Added Loader2 to the imports
import { ChevronRight, Layers, Loader2 } from 'lucide-react';
import TaskModal from '../components/Modals/TaskModal';

interface BacklogPageProps {
  user: UserDTO;
  searchTerm?: string;
}

const BacklogPage: React.FC<BacklogPageProps> = ({ user, searchTerm = '' }) => {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<TaskDTO | null>(null);

  const fetchAllTasks = async () => {
    setLoading(true);
    try {
      const data = await api.tasks.getAll();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Tüm görevler yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toString().includes(searchTerm) ||
    (t.sprintName && t.sprintName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case Priority.CRITICAL: return 'text-rose-600 bg-rose-50';
      case Priority.HIGH: return 'text-orange-600 bg-orange-50';
      case Priority.MEDIUM: return 'text-blue-600 bg-blue-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
          <Layers size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tüm Görevler (Backlog)</h1>
          <p className="text-slate-500 font-medium italic">Sistemdeki tüm iş öğelerini ve sprint aidiyetlerini görüntüleyin.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">GÖREV ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">BAŞLIK</th>
                <th className="px-8 py-5 text-[10px] font-black text-blue-600 uppercase tracking-widest">SPRINT</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">ÖNCELİK</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">DURUM</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">SORUMLU</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="animate-spin text-blue-500" size={24} />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Görevler Yükleniyor...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTasks.length > 0 ? filteredTasks.map(task => (
                <tr 
                  key={task.id} 
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  onClick={() => setSelectedTask(task)}
                >
                  <td className="px-8 py-5 text-xs font-black text-slate-400 uppercase">#{task.id}</td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{task.title}</p>
                  </td>
                  <td className="px-8 py-5">
                    {task.sprintName ? (
                      <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                        {task.sprintName}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300 italic uppercase">Backlog</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase text-slate-500 bg-slate-100 border border-slate-200">
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black border border-indigo-100">
                        {task.assignee?.username.substring(0, 2).toUpperCase() || '?'}
                      </div>
                      <span className="text-xs font-bold text-slate-600">{task.assignee?.fullName || 'Atanmamış'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-8 py-16 text-center text-slate-400 italic font-medium">Eşleşen görev bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onUpdate={fetchAllTasks} 
        />
      )}
    </div>
  );
};

export default BacklogPage;
