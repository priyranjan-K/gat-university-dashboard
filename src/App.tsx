import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Gallery from './components/Gallery';
import Settings from './components/Settings';
import { User, Page } from './types';
import { api } from './services/api';
import { DEFAULT_BACKGROUNDS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<Page>(Page.DASHBOARD);
  const [backgrounds, setBackgrounds] = useState<Record<Page, string>>(DEFAULT_BACKGROUNDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      // 1. Check Auth
      if (api.isAuthenticated()) {
        // In a real app, verify with api.me()
        // Restoring generic admin for demo if token exists but no user state
         setUser({
          id: 'u-restore',
          name: 'Restored User',
          email: 'user@vtu.edu',
          role: 'admin',
          avatar: 'https://ui-avatars.com/api/?name=Restored+User'
        });
      }

      // 2. Fetch Settings (Backgrounds)
      try {
        const settings = await api.getSettings();
        if (settings && settings.backgrounds) {
          setBackgrounds(settings.backgrounds);
        }
      } catch (e) {
        console.warn("Using default backgrounds", e);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setActivePage(Page.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleBackgroundChange = (page: Page, url: string) => {
    setBackgrounds(prev => ({ ...prev, [page]: url }));
  };

  // Simple Placeholder Components for other pages
  const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex flex-col items-center justify-center h-96 text-center bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
      <h2 className="text-3xl font-bold text-gray-300 dark:text-gray-600 mb-4">{title}</h2>
      <p className="text-gray-400 dark:text-gray-500">This module is under construction.</p>
    </div>
  );

  if (loading) return null;

  if (!user) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return (
    <Layout 
      user={user} 
      activePage={activePage} 
      backgrounds={backgrounds}
      onNavigate={setActivePage} 
      onLogout={handleLogout}
    >
      {activePage === Page.DASHBOARD && <Dashboard />}
      {activePage === Page.STUDENTS && <Students currentUser={user} />}
      {activePage === Page.GALLERY && <Gallery currentUser={user} />}
      {activePage === Page.SETTINGS && <Settings backgrounds={backgrounds} onBackgroundChange={handleBackgroundChange} currentUser={user} />}
      {activePage === Page.COLLEGE && <PlaceholderPage title="College Information" />}
      {activePage === Page.CAREER && <PlaceholderPage title="Career Center" />}
      {activePage === Page.ABOUT && <PlaceholderPage title="About VTU University" />}
    </Layout>
  );
};

export default App;