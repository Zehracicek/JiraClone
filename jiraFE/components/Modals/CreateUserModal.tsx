
import React, { useState } from 'react';
import { X, CheckCircle2, Loader2, UserPlus, Shield, Mail, Key, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    role: 'DEVELOPER'
  });

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "İsim en az 3 karakter olmalıdır.";
    }
    
    if (formData.username.trim().length < 4) {
      newErrors.username = "Kullanıcı adı en az 4 karakter olmalıdır.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz.";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.auth.register(formData);
      onCreated();
      onClose();
    } catch (err: any) {
      alert(`Ekip üyesi oluşturulamadı: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in zoom-in duration-200">
        <div className="flex items-center justify-between px-10 py-8 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
              <UserPlus size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Yeni Ekip Üyesi</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tam Ad Soyad</label>
            <input
              type="text"
              className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900 font-bold transition-all ${errors.fullName ? 'border-rose-300' : 'border-slate-200'}`}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Ahmet Yılmaz"
            />
            {errors.fullName && <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kullanıcı Adı</label>
              <input
                type="text"
                className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900 font-bold transition-all ${errors.username ? 'border-rose-300' : 'border-slate-200'}`}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="ahmtylmz"
              />
              {errors.username && <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.username}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rol</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900 font-bold appearance-none transition-all"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="DEVELOPER">DEVELOPER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="DESIGNER">DESIGNER</option>
                  <option value="PRODUCT_OWNER">PRODUCT OWNER</option>
                  <option value="TESTER">TESTER</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-Posta Adresi</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="email"
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900 font-bold transition-all ${errors.email ? 'border-rose-300' : 'border-slate-200'}`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ahmet@sirket.com"
              />
            </div>
            {errors.email && <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Şifre</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="password"
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900 font-bold transition-all ${errors.password ? 'border-rose-300' : 'border-slate-200'}`}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.password}</p>}
          </div>

          <div className="pt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Vazgeç</button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
              Üyeyi Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
