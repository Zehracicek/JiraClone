
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TaskDTO, UserDTO, TaskStatus } from '../types';
import { CheckCircle2, Clock, ListTodo, Target, ArrowUpRight, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface DashboardPageProps {
  user: UserDTO;
  searchTerm?: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, searchTerm = '' }) => {
  const navigate = useNavigate();
  const [userTasks, setUserTasks] = useState<TaskDTO[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    done: 0,
    open: 0,
    progress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const tasks = await api.tasks.getByAssignee(user.username);
        const taskArray = Array.isArray(tasks) ? tasks : [];
        setUserTasks(taskArray);

        const total = taskArray.length;
        const done = taskArray.filter(t => t.status === TaskStatus.DONE || t.status === TaskStatus.COMPLETED).length;
        const open = total - done;
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;

        setStats({ total, done, open, progress });
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [user.username]);

  const filteredTasks = userTasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kişisel Özet</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Hoş geldin, <span className="text-blue-600 not-italic font-bold">{user.fullName}</span>.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Görev İlerlemesi', val: `${stats.progress}%`, icon: <Target />, color: 'text-blue-600', bg: 'bg-blue-50', path: '/board' },
          { label: 'Tamamlanan', val: stats.done, icon: <CheckCircle2 />, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/board' },
          { label: 'Açık Görevler', val: stats.open, icon: <ListTodo />, color: 'text-amber-600', bg: 'bg-amber-50', path: '/board' },
          { label: 'Toplam Atanan', val: stats.total, icon: <Clock />, color: 'text-rose-600', bg: 'bg-rose-50', path: '/backlog' }
        ].map((stat, i) => (
          <div 
            key={i} 
            onClick={() => navigate(stat.path)}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:shadow-md transition-all cursor-pointer active:scale-95"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                {React.cloneElement(stat.icon as React.ReactElement<any>, { size: 24 })}
              </div>
              <ArrowUpRight className="text-slate-300 group-hover:text-slate-600 transition-colors" size={18} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-black text-slate-800 tracking-tight">Üzerimdeki Görevler</h2>
                {searchTerm && (
                  <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-lg font-bold">"{searchTerm}" filtrelendi</span>
                )}
              </div>
              <Link to="/board" className="text-blue-600 text-xs font-black uppercase tracking-widest hover:text-blue-700">Board'a Git</Link>
            </div>
            <div className="divide-y divide-slate-50 min-h-[300px]">
              {filteredTasks.length > 0 ? filteredTasks.slice(0, 8).map((task) => (
                <div key={task.id} className="px-8 py-5 hover:bg-slate-50 flex items-center justify-between transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-8 rounded-full ${task.status === TaskStatus.DONE || task.status === TaskStatus.COMPLETED ? 'bg-emerald-400' : 'bg-blue-400'}`}></div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600">{task.title}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">#{task.id}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                    task.status === TaskStatus.DONE || task.status === TaskStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center p-12 text-slate-400 italic">
                  <Search size={48} className="text-slate-200 mb-4" />
                  {searchTerm ? 'Aranan kriterde görev bulunamadı.' : 'Atanmış bir görev bulunmuyor.'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-[#0747a6] to-[#0052cc] rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
            <h3 className="text-xl font-black mb-2">Başarı Durumu</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6 italic">
              Atanan görevlerinizi tamamlayarak verimlilik puanınızı artırın.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span>Tamamlanma Oranı</span>
                <span>{stats.progress}%</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full transition-all duration-1000" style={{ width: `${stats.progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
