import React, { useState, useEffect } from 'react';
import { User, Page } from '../types';
import { APP_NAME, NAVIGATION_ITEMS } from '../constants';
import { LogOut, GraduationCap, Menu, X, Home, Moon, Sun, Clock } from 'lucide-react';
import { api } from '../services/api';
import '../styles/Layout.css';

interface LayoutProps {
  user: User;
  activePage: Page;
  backgrounds: Record<Page, string>;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, activePage, backgrounds, onNavigate, onLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());

  // Fancy Clock Timer
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    api.logout().then(() => onLogout());
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className={`flex h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar-container ${isDarkMode ? 'sidebar-dark' : 'sidebar-light'} ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className={`flex items-center h-16 px-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="bg-indigo-600 p-1.5 rounded-lg mr-3">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{APP_NAME}</span>
          <button 
            className="ml-auto lg:hidden text-gray-500"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {/* Home Button */}
          <button
             onClick={() => { onNavigate(Page.DASHBOARD); setIsSidebarOpen(false); }}
             className={`nav-item mb-4 ${
               activePage === Page.DASHBOARD 
                 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                 : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
             }`}
          >
            <Home className="mr-3 h-5 w-5" />
            Home
          </button>

          <div className={`text-xs font-semibold uppercase tracking-wider mb-2 px-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Menu
          </div>

          {NAVIGATION_ITEMS.filter(i => i.id !== Page.DASHBOARD).map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id as Page);
                  setIsSidebarOpen(false);
                }}
                className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-4 px-2">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
              alt="User" 
              className="h-9 w-9 rounded-full border border-gray-200"
            />
            <div className="overflow-hidden">
              <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'border-gray-600 text-red-400 hover:bg-gray-700' : 'border-gray-200 text-red-600 hover:bg-red-50'}`}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content with Configurable Background */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Fancy Background Layer */}
        <div 
          className="absolute inset-0 z-0 transition-all duration-700"
          style={{ 
            backgroundImage: `url(${backgrounds[activePage]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: isDarkMode ? 0.05 : 0.1 
          }}
        />

        {/* Top Header */}
        <header className={`main-header ${isDarkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
           <div className="flex items-center gap-4">
             <button 
              className={`lg:hidden p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className={`text-lg font-semibold hidden md:block ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {NAVIGATION_ITEMS.find(i => i.id === activePage)?.label || 'Dashboard'}
            </h2>
           </div>
          
          <div className="ml-auto flex items-center space-x-6">
             {/* Fancy Clock */}
             <div className="hidden md:flex flex-col items-end mr-4 group">
               <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-xl font-bold font-mono tracking-tight">{formatTime(dateTime)}</span>
               </div>
               <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  {formatDate(dateTime)}
               </div>
             </div>

             {/* Dark Mode Toggle */}
             <button 
               onClick={() => setIsDarkMode(!isDarkMode)}
               className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
             >
               {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
             </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative z-10 flex-1 overflow-y-auto p-4 lg:p-8">
           <div className="max-w-7xl mx-auto">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;