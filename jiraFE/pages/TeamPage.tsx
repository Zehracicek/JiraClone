
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserDTO } from '../types';
import { Mail, Shield, User as UserIcon, MoreHorizontal, UserPlus, Loader2 } from 'lucide-react';
import CreateUserModal from '../components/Modals/CreateUserModal';

interface TeamPageProps {
  user: UserDTO;
}

const TeamPage: React.FC<TeamPageProps> = ({ user }) => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.users.getAll();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ekip Üyeleri</h1>
          <p className="text-slate-500 font-medium italic">Workspace'e erişimi olan tüm çalışma arkadaşlarınız.</p>
        </div>
        
        {user.role === 'ADMIN' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <UserPlus size={20} />
            Yeni Üye Ekle
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && users.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Ekip Yükleniyor...</p>
          </div>
        ) : users.length > 0 ? users.map(u => (
          <div key={u.id} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-100/50 transition-colors"></div>
            
            <div className="relative flex items-start justify-between mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white text-xl font-black shadow-xl shadow-indigo-100 transition-transform group-hover:scale-105">
                {u.username.substring(0, 2).toUpperCase()}
              </div>
              <button className="p-2 text-slate-300 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all">
                <MoreHorizontal size={20} />
              </button>
            </div>
            
            <div className="relative space-y-1 mb-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{u.fullName}</h3>
              <p className="text-xs font-bold text-slate-400 italic">@{u.username}</p>
            </div>

            <div className="relative space-y-4 pt-8 border-t border-slate-50">
              <div className="flex items-center gap-3 text-slate-500">
                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400">
                  <Mail size={14} />
                </div>
                <span className="text-xs font-bold truncate max-w-[200px]">{u.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-400">
                  <Shield size={14} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                  {u.role}
                </span>
              </div>
            </div>

            <div className="relative mt-8 flex items-center justify-end">
              <div className="text-[10px] font-bold text-slate-300 italic">Üye Kayıt No: #{u.id}</div>
            </div>
          </div>
        )) : (
          <div className="col-span-full bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 p-24 text-center">
             <UserIcon size={64} className="text-slate-200 mx-auto mb-6" />
             <h3 className="text-xl font-black text-slate-400 mb-2">Ekip Üyesi Bulunamadı</h3>
             <p className="text-slate-400 italic">Henüz kimse eklenmemiş. Yeni üye ekleyerek başlayın.</p>
          </div>
        )}
      </div>

      <CreateUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreated={fetchUsers} 
      />
    </div>
  );
};

export default TeamPage;
