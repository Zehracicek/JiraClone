
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BoardPage from './pages/BoardPage';
import ReportsPage from './pages/ReportsPage';
import BacklogPage from './pages/BacklogPage';
import TeamPage from './pages/TeamPage';
import ProjectsPage from './pages/ProjectsPage';
import CreateTaskModal from './components/Modals/CreateTaskModal';
import { UserDTO } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [globalSearch, setGlobalSearch] = useState('');

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("User parsing error:", e);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else if (token && !savedUser) {
          localStorage.removeItem('token');
      }
      setLoading(false);
    };
    initAuth();

    const handleQuickCreate = () => setIsCreateModalOpen(true);
    window.addEventListener('quick-create-task' as any, handleQuickCreate);
    return () => window.removeEventListener('quick-create-task' as any, handleQuickCreate);
  }, []);

  const handleLogin = (token: string, userData: UserDTO) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleTaskCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Sistem Hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/*" 
          element={user ? (
            <div className="flex h-screen overflow-hidden bg-[#f4f5f7]">
              <Sidebar user={user} />
              <div className="flex-1 flex flex-col min-w-0">
                <Header 
                  user={user} 
                  onLogout={handleLogout} 
                  onSearchChange={setGlobalSearch} 
                  searchValue={globalSearch}
                />
                <main className="flex-1 overflow-y-auto p-6">
                  <Routes>
                    <Route path="/" element={<DashboardPage user={user} key={`dash-${refreshTrigger}`} searchTerm={globalSearch} />} />
                    <Route path="/board" element={<BoardPage user={user} key={`board-${refreshTrigger}`} searchTerm={globalSearch} />} />
                    
                    <Route 
                      path="/backlog" 
                      element={user.role === 'ADMIN' ? <BacklogPage user={user} key={`backlog-${refreshTrigger}`} searchTerm={globalSearch} /> : <Navigate to="/" />} 
                    />
                    <Route 
                      path="/projects" 
                      element={user.role === 'ADMIN' ? <ProjectsPage user={user} key={`projects-${refreshTrigger}`} /> : <Navigate to="/" />} 
                    />
                    
                    <Route path="/team" element={<TeamPage user={user} key={`team-${refreshTrigger}`} />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>
              </div>
              <CreateTaskModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onCreated={handleTaskCreated}
                currentUser={user}
              />
            </div>
          ) : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
