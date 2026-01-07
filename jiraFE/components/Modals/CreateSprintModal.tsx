
import React, { useState } from 'react';
import { X, CheckCircle2, Loader2, Calendar, Target, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { UserDTO } from '../../types';

interface CreateSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  currentUser: UserDTO;
}

const CreateSprintModal: React.FC<CreateSprintModalProps> = ({ isOpen, onClose, onCreated, currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 3) {
      newErrors.name = "Sprint ismi en az 3 karakter olmalıdır.";
    }
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (end <= start) {
      newErrors.endDate = "Bitiş tarihi başlangıç tarihinden sonra olmalıdır.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        goal: formData.goal,
        startDate: formData.startDate,
        endDate: formData.endDate,
        active: true,
        user: currentUser
      };

      await api.sprints.create(payload as any);
      onCreated();
      onClose();
    } catch (err: any) {
      alert(`Sprint oluşturulamadı: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in zoom-in duration-200">
        <div className="flex items-center justify-between px-10 py-8 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
              <Target size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Yeni Sprint Planla</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sprint Adı</label>
            <input
              type="text"
              className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 font-bold placeholder-slate-300 transition-all ${errors.name ? 'border-rose-300' : 'border-slate-200'}`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Örn: Innovation Sprint Q4"
            />
            {errors.name && <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sprint Hedefi</label>
            <textarea
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 font-medium placeholder-slate-300 min-h-[100px] transition-all"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              placeholder="Bu sprintte neyi başarmayı hedefliyoruz?"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Başlangıç Tarihi</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="date"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 font-bold transition-all"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bitiş Tarihi</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="date"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 font-bold transition-all ${errors.endDate ? 'border-rose-300' : 'border-slate-200'}`}
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              {errors.endDate && <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.endDate}</p>}
            </div>
          </div>

          <div className="pt-8 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Vazgeç</button>
            <button type="submit" disabled={loading} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
              Sprinti Başlat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSprintModal;
