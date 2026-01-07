
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SprintDTO, UserDTO, TaskStatus } from '../types';
import { Folder, Calendar, Target, ChevronRight, Activity, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateSprintModal from '../components/Modals/CreateSprintModal';

interface ProjectsPageProps {
  user: UserDTO;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [sprints, setSprints] = useState<SprintDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSprints = async () => {
    setLoading(true);
    try {
      const data = await api.sprints.getAll();
      setSprints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Sprint listesi yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSprints();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Projeler & Sprintler</h1>
          <p className="text-slate-500 font-medium italic">Aktif ve planlanan tüm iş paketleri burada listelenir.</p>
        </div>
        
        {user.role === 'ADMIN' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus size={20} />
            Yeni Sprint Oluştur
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading && sprints.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4">
             <Loader2 className="animate-spin text-blue-600" size={32} />
             <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Sprintler Getiriliyor...</p>
          </div>
        ) : sprints.length > 0 ? sprints.map(sprint => {
          // İlerleme hesaplama: Eğer sprint.tasks varsa oradan, yoksa özet alanlardan hesapla
          // Hem DONE hem COMPLETED durumlarını tamamlanmış kabul et
          let total = sprint.totalTasks || sprint.taskCount || 0;
          let completed = sprint.completedTasks || 0;

          if (sprint.tasks && sprint.tasks.length > 0) {
            total = sprint.tasks.length;
            completed = sprint.tasks.filter(t => 
              t.status === TaskStatus.DONE || t.status === TaskStatus.COMPLETED
            ).length;
          }

          const calculatedProgress = total > 0 
            ? Math.round((completed / total) * 100) 
            : (sprint.completionPercentage || 0);

          return (
            <div 
              key={sprint.id} 
              onClick={() => navigate('/board')}
              className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Folder size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                    sprint.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                  }`}>
                    {sprint.active ? 'AKTİF' : 'PASİF'}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-blue-600 transition-colors">{sprint.name}</h3>
              <p className="text-sm text-slate-500 font-medium italic mb-6 line-clamp-2">{sprint.goal || 'Bu sprint için henüz bir hedef belirlenmemiş.'}</p>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Activity size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">İlerleme</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{calculatedProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-1000" 
                    style={{ width: `${calculatedProgress}%` }}
                  ></div>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={12} />
                    <span className="text-[10px] font-bold">{new Date(sprint.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Target size={12} />
                    <span className="text-[10px] font-bold">{total} Görev</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 p-24 text-center">
            <Folder size={64} className="text-slate-200 mx-auto mb-6" />
            <h3 className="text-xl font-black text-slate-400 mb-2">Henüz Bir Proje Yok</h3>
            <p className="text-slate-400 italic">Admin panelinden yeni bir sprint tanımlayarak başlayın.</p>
          </div>
        )}
      </div>

      <CreateSprintModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreated={fetchSprints}
        currentUser={user}
      />
    </div>
  );
};

export default ProjectsPage;
