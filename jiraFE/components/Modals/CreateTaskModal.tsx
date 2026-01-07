
import React, { useState, useEffect } from 'react';
import { TaskStatus, Priority, UserDTO, SprintDTO } from '../../types';
import { X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  currentUser: UserDTO;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onCreated, currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [sprints, setSprints] = useState<SprintDTO[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: Priority.MEDIUM,
    assigneeId: currentUser.id.toString(),
    sprintId: ''
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [usersData, sprintsData] = await Promise.all([
            api.users.getAll(),
            api.sprints.getAll()
          ]);
          setUsers(usersData);
          setSprints(Array.isArray(sprintsData) ? sprintsData : []);
        } catch (err) { 
          console.error('Veri yükleme hatası:', err); 
        }
      };
      fetchData();
      setErrors({});
      setFormData({
        title: '',
        description: '',
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        assigneeId: currentUser.id.toString(),
        sprintId: ''
      });
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.title.trim().length < 5) {
      newErrors.title = "Görev başlığı en az 5 karakter olmalıdır.";
    }
    if (formData.description.trim().length < 10) {
      newErrors.description = "Lütfen daha açıklayıcı bir görev detayı giriniz (En az 10 karakter).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const selectedAssignee = users.find(u => u.id === Number(formData.assigneeId)) || currentUser;
      const selectedSprint = sprints.find(s => s.id === Number(formData.sprintId));
      
      await api.tasks.create({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignee: selectedAssignee,
        sprintId: selectedSprint ? selectedSprint.id : undefined,
        sprintName: selectedSprint ? selectedSprint.name : undefined
      });
      onCreated();
      onClose();
    } catch (err) {
      alert('Görev oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in zoom-in duration-200">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Yeni Görev Oluştur</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Görev Başlığı</label>
            <input
              type="text"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 font-bold transition-all ${errors.title ? 'border-rose-300' : 'border-slate-200'}`}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Neler yapılması gerekiyor?"
            />
            {errors.title && <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.title}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Açıklama</label>
            <textarea
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 font-medium min-h-[100px] transition-all ${errors.description ? 'border-rose-300' : 'border-slate-200'}`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Görev detaylarını buraya yazın..."
            />
            {errors.description && <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Öncelik</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 font-bold appearance-none cursor-pointer" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}>
                {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sorumlu</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 font-bold appearance-none cursor-pointer" value={formData.assigneeId} onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}>
                {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sprint (Opsiyonel)</label>
            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 font-bold appearance-none cursor-pointer" value={formData.sprintId} onChange={(e) => setFormData({ ...formData, sprintId: e.target.value })}>
              <option value="">Backlog'a Ekle</option>
              {sprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all">İptal</button>
            <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
              Görevi Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
