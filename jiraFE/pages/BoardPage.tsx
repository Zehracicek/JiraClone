
import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { TaskDTO, TaskStatus, UserDTO } from '../types';
import Column from '../components/Board/Column';
import TaskModal from '../components/Modals/TaskModal';
import CreateTaskModal from '../components/Modals/CreateTaskModal';
import { Plus, Search, RefreshCw, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BoardPageProps {
  user: UserDTO;
  searchTerm?: string;
}

const BoardPage: React.FC<BoardPageProps> = ({ user, searchTerm = '' }) => {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskDTO | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const userTasks = await api.tasks.getByAssignee(user.username);
      setTasks(Array.isArray(userTasks) ? userTasks : []);
    } catch (err) {
      console.error('Board veri çekme hatası:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [user.username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData('taskId', taskId.toString());
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    const taskId = Number(e.dataTransfer.getData('taskId'));
    const taskToUpdate = tasks.find(t => t.id === taskId);
    
    if (taskToUpdate && taskToUpdate.status !== newStatus) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      try {
        await api.tasks.update(taskId, { status: newStatus });
      } catch (err) {
        fetchData();
      }
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toString().includes(searchTerm)
  );

  const getTasksByStatus = (status: TaskStatus) => filteredTasks.filter(t => t.status === status);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Link to="/projects" className="hover:text-blue-600 transition-colors">Panolar</Link>
            <span>/</span>
            <span className="text-slate-600">Görevlerim</span>
          </nav>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            İş Takip Panosu
            <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest border border-blue-200 flex items-center gap-1">
              <UserIcon size={10} />
              {user.username}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={fetchData}
            className={`p-2.5 text-slate-500 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all ${loading ? 'animate-spin' : ''}`}
            title="Yenile"
          >
            <RefreshCw size={18} />
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus size={18} />
            Görev Ekle
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto min-h-0 pb-6">
        <div className="flex h-full min-w-max gap-6">
          {[
            { title: "Yapılacaklar", status: TaskStatus.TODO },
            { title: "Devam Edenler", status: TaskStatus.IN_PROGRESS },
            { title: "Bloke Olanlar", status: TaskStatus.BLOCKED },
            { title: "Tamamlananlar", status: TaskStatus.DONE }
          ].map(col => (
            <Column 
              key={col.status}
              title={col.title} 
              status={col.status} 
              tasks={getTasksByStatus(col.status)} 
              onTaskSelect={setSelectedTask} 
              onDropTask={handleDrop} 
              onDragStart={handleDragStart} 
            />
          ))}
        </div>
      </div>

      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onUpdate={fetchData} 
        />
      )}

      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreated={fetchData} 
        currentUser={user}
      />
    </div>
  );
};

export default BoardPage;
