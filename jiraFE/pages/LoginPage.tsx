
import React, { useState } from 'react';
import { api } from '../services/api';
import { UserDTO } from '../types';
import { Lock, User, Mail, Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (token: string, user: UserDTO) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '', email: '', fullName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const loginResponse: any = await api.auth.login({ 
          username: formData.username, 
          password: formData.password 
        });
        
        console.log("Login Response:", loginResponse);

        let token = '';
        let userData: any = null;

        if (typeof loginResponse === 'string') {
          token = loginResponse;
          userData = { username: formData.username }; 
        } else {
          token = loginResponse.token || loginResponse.accessToken || 'dummy-token';
          userData = loginResponse.user || loginResponse;
        }
        
        localStorage.setItem('token', token);
        
        let normalizedUser: UserDTO | null = null;
        if (typeof userData === "string") {
          try {
            normalizedUser = JSON.parse(userData);
          } catch (e) {
            normalizedUser = null;
          }
        } else {
          normalizedUser = userData as UserDTO;
        }

        if (normalizedUser && (normalizedUser.id != null || normalizedUser.username)) {
          const finalUser: UserDTO = {
            ...normalizedUser,
            id: normalizedUser.id ?? (loginResponse.id ?? 2)
          } as UserDTO;
          
          // Refresh durumunda /me atmamak için kullanıcıyı saklıyoruz
          localStorage.setItem('user', JSON.stringify(finalUser));
          onLogin(token, finalUser);
        } else {
          throw new Error("Kullanıcı bilgileri login cevabında bulunamadı.");
        }
      } else {
        await api.auth.register(formData);
        setIsLogin(true);
        setFormData({ ...formData, password: '' });
        alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
      }
    } catch (err: any) {
      console.error("Login hatası:", err);
      setError(err.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0747a6] via-[#0052cc] to-[#091e42] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 transform transition-all border border-white/20">
        <div className="text-center mb-10">
          <div className="inline-flex bg-blue-600 p-4 rounded-2xl shadow-xl shadow-blue-500/30 mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">JiraPro</h1>
          <p className="text-slate-500 mt-2 font-medium italic">
            {isLogin ? 'Workspace\'e bağlanın' : 'Yeni hesap oluşturun'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-xs font-bold mb-6 border border-rose-100 border-l-4 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Ad Soyad</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-950 font-bold placeholder-slate-300"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Adınız Soyadınız"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">E-Posta</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-950 font-bold placeholder-slate-300"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@adresiniz.com"
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Kullanıcı Adı</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-950 font-bold placeholder-slate-400"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Kullanıcı Adı"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Şifre</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-950 font-bold placeholder-slate-300"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
          >
            {isLogin ? "Henüz hesabınız yok mu? Kayıt olun" : 'Zaten hesabınız var mı? Giriş yapın'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
