
import React, { useState, useEffect } from 'react';
import { TaskDTO, TaskStatus, Priority, UserDTO } from '../../types';
import { X, Trash2, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

interface TaskModalProps {
  task: TaskDTO | null;
  onClose: () => void;
  onUpdate: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onUpdate }) => {
  const [editingTask, setEditingTask] = useState<Partial<TaskDTO>>({});
  const [users, setUsers] = useState<UserDTO[]>([]);

  useEffect(() => {
    if (task) {
      setEditingTask({ ...task });
    }
    const fetchUsers = async () => {
      try {
        const data = await api.users.getAll();
        setUsers(data);
      } catch (err) { console.error(err); }
    };
    fetchUsers();
  }, [task]);

  if (!task) return null;

  const handleSave = async () => {
    try {
      await api.tasks.update(task.id, editingTask);
      onUpdate();
      onClose();
    } catch (err) { alert('Güncelleme başarısız'); }
  };

  const handleDelete = async () => {
    if (confirm('Bu görevi silmek istediğinize emin misiniz?')) {
      try {
        await api.tasks.delete(task.id);
        // Silme sonrası listeyi yenile ve modalı kapat
        onUpdate();
        onClose();
      } catch (err: any) { 
        console.error("Silme hatası:", err);
        alert(`Silme işlemi başarısız: ${err.message}`); 
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50/50">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded-lg border border-slate-200">GÖREV-{task.id}</span>
          <div className="flex items-center gap-2">
            <button onClick={handleDelete} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
              <Trash2 size={18} />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Başlık</label>
            <input
              type="text"
              className="text-2xl font-black w-full border-none focus:ring-0 p-0 text-slate-950 placeholder-slate-300 bg-transparent"
              value={editingTask.title || ''}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              placeholder="Başlık girin..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Açıklama</label>
            <textarea
              className="w-full border border-slate-200 rounded-2xl p-4 min-h-[140px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-900 font-medium bg-slate-50/50 placeholder-slate-300"
              value={editingTask.description || ''}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              placeholder="Detaylı açıklama ekleyin..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Durum</label>
              <select
                className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-900 font-bold outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                value={editingTask.status}
                onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as TaskStatus })}
              >
                {Object.values(TaskStatus).map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Öncelik</label>
              <select
                className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-900 font-bold outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                value={editingTask.priority}
                onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as Priority })}
              >
                {Object.values(Priority).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sorumlu</label>
              <select
                className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-900 font-bold outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                value={editingTask.assignee?.id || ''}
                onChange={(e) => {
                  const user = users.find(u => u.id === Number(e.target.value));
                  setEditingTask({ ...editingTask, assignee: user });
                }}
              >
                <option value="">Atanmamış</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.fullName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-white rounded-xl transition-all">
            Vazgeç
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
