
import React, { useState } from 'react';
import { Search, Bell, HelpCircle, LogOut } from 'lucide-react';
import { UserDTO } from '../../types';

interface HeaderProps {
  user: UserDTO;
  onLogout: () => void;
  onSearchChange: (value: string) => void;
  searchValue: string;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onSearchChange, searchValue }) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-slate-50 !placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm font-bold !text-slate-900 transition-all"
            placeholder="Görev veya anahtar kelime ara..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="text-gray-500 hover:text-gray-700 p-2 hover:bg-slate-100 rounded-xl transition-all">
          <Bell size={20} />
        </button>
        <button className="text-gray-500 hover:text-gray-700 p-2 hover:bg-slate-100 rounded-xl transition-all">
          <HelpCircle size={20} />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black uppercase shadow-lg shadow-blue-200">
              {user.username.substring(0, 2)}
            </div>
            <span className="text-xs font-bold text-slate-700 hidden md:block">{user.fullName}</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-3 border-b border-slate-100">
                <p className="text-sm font-black text-slate-900 tracking-tight">{user.fullName}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.email}</p>
              </div>
              <div className="p-2">
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <LogOut size={16} />
                  Oturumu Kapat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
