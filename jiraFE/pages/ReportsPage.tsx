
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SprintDTO, UserWorkloadReport } from '../types';
import { Users, Target, CheckCircle2, Loader2, List, PieChart, Activity } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [sprints, setSprints] = useState<SprintDTO[]>([]);
  const [workloadComparison, setWorkloadComparison] = useState<UserWorkloadReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sprintData, comparisonData] = await Promise.all([
          api.sprints.getAll(),
          api.reports.getWorkloadComparison()
        ]);
        setSprints(Array.isArray(sprintData) ? sprintData : []);
        setWorkloadComparison(Array.isArray(comparisonData) ? comparisonData : []);
      } catch (err) {
        console.error('Rapor veri çekme hatası:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Veriler İşleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12 animate-in fade-in duration-500">
      {/* Sprint Performance Section */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
            <Target size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sprint Performans Raporu</h1>
            <p className="text-slate-500 font-medium italic">Sprint bazlı görev dağılımı ve tamamlama oranları.</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sprint Adı</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Toplam Görev</th>
                <th className="px-8 py-5 text-[10px] font-black text-emerald-500 uppercase tracking-widest text-center">Tamamlanan</th>
                <th className="px-8 py-5 text-[10px] font-black text-rose-500 uppercase tracking-widest text-center">Kalan</th>
                <th className="px-8 py-5 text-[10px] font-black text-blue-600 uppercase tracking-widest text-right">İlerleme</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sprints.map(sprint => (
                <tr key={sprint.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800">{sprint.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: #SPR-{sprint.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-sm font-black text-slate-900">{sprint.taskCount}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-sm font-black text-emerald-600">{sprint.completedTasks}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-sm font-black text-rose-600">{sprint.taskCount - sprint.completedTasks}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-black text-blue-600">{sprint.completionPercentage}%</span>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full transition-all duration-1000" 
                          style={{ width: `${sprint.completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {sprints.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic font-medium">Sprint verisi bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Team Workload Section */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ekip İş Yükü Karşılaştırması</h1>
            <p className="text-slate-500 font-medium italic">Kim ne kadar maddeye sahip ve ne kadarını tamamladı?</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kullanıcı</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Atanan Toplam</th>
                <th className="px-8 py-5 text-[10px] font-black text-emerald-500 uppercase tracking-widest text-center">Biten</th>
                <th className="px-8 py-5 text-[10px] font-black text-blue-500 uppercase tracking-widest text-center">Devam Eden</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Verimlilik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {workloadComparison.map((report) => {
                const efficiency = report.totalTasks > 0 ? Math.round((report.completedTasks / report.totalTasks) * 100) : 0;
                
                return (
                  <tr key={report.username} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-black">
                          {report.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 tracking-tight">@{report.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-sm font-black text-slate-700">{report.totalTasks}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex items-center justify-center gap-2 text-emerald-600 font-black">
                        <CheckCircle2 size={14} />
                        {report.completedTasks}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex items-center justify-center gap-2 text-blue-600 font-black">
                        <Activity size={14} />
                        {report.inProgressTasks}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs font-black ${efficiency > 70 ? 'text-emerald-600' : efficiency > 40 ? 'text-blue-600' : 'text-slate-400'}`}>
                          {efficiency}%
                        </span>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${efficiency > 70 ? 'bg-emerald-500' : efficiency > 40 ? 'bg-blue-500' : 'bg-slate-300'}`} 
                            style={{ width: `${efficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {workloadComparison.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic font-medium">İş yükü verisi bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ReportsPage;
