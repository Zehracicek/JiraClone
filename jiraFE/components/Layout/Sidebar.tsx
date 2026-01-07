
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Kanban, BarChart2, Users, Layers, Plus, FolderOpen } from 'lucide-react';
import { UserDTO } from '../../types';

interface SidebarProps {
  user: UserDTO;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Özet', path: '/' },
    { icon: <FolderOpen size={20} />, label: 'Projeler', path: '/projects', adminOnly: true },
    { icon: <Kanban size={20} />, label: 'İş Takip Panosu', path: '/board' },
    { icon: <Layers size={20} />, label: 'Tüm Görevler', path: '/backlog', adminOnly: true },
    { icon: <Users size={20} />, label: 'Ekip Üyeleri', path: '/team' },
    { icon: <BarChart2 size={20} />, label: 'Raporlar', path: '/reports' },
  ].filter(item => !item.adminOnly || user.role === 'ADMIN');

  return (
    <div className="w-68 bg-[#091E42] text-white flex flex-col h-full shadow-2xl z-30 transition-all">
      <div className="p-8 flex items-center gap-4">
        <div className="bg-gradient-to-tr from-blue-400 to-indigo-600 p-2 rounded-xl shadow-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="flex flex-col">
           <span className="text-lg font-black tracking-tight leading-none">JiraPro</span>
           <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-1">Geliştirici Paneli</span>
        </div>
      </div>

      <div className="px-4 py-4 mb-2">
         <div className="bg-white/5 h-px w-full"></div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="transition-transform group-hover:scale-110">{item.icon}</span>
            <span className="text-sm font-bold tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('quick-create-task'))}
          className="flex items-center gap-3 w-full px-4 py-3 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl transition-all text-sm font-bold border border-white/5"
        >
          <Plus size={18} />
          Hızlı Oluştur
        </button>
      </div>
      
      <div className="px-6 py-4 bg-black/20 flex items-center gap-3 border-t border-white/5">
         <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
         </div>
         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sistem Aktif</span>
      </div>
    </div>
  );
};

export default Sidebar;
