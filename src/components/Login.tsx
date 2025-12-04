import React, { useState } from 'react';
import { User } from '../types';
import { GraduationCap } from 'lucide-react';
import { APP_NAME, LOGIN_BG_URL } from '../constants';
import '../styles/Login.css';

// Sub Components
import { LoginForm } from './auth/LoginForm';
import { AdminRegisterModal } from './auth/AdminRegisterModal';
import { StudentActivateModal } from './auth/StudentActivateModal';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

type LoginMode = 'admin' | 'student';

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<LoginMode>('admin');
  const [showAdminRegister, setShowAdminRegister] = useState(false);
  const [showStudentActivate, setShowStudentActivate] = useState(false);

  return (
    <div 
      className="login-container" 
      style={{ 
        backgroundImage: `url(${LOGIN_BG_URL})`,
        // Inline style fallback to ensure coverage on all devices if CSS lags
        backgroundSize: 'cover',
        backgroundPosition: 'center' 
      }}
    >
      {/* Dark Overlay for readability */}
      <div className="login-overlay" />

      {/* Centered Login Card */}
      <div className="login-card fade-in">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Welcome to {APP_NAME}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Secure Portal Access</p>
        </div>

        {/* Mode Tabs */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
          <button 
            onClick={() => setMode('admin')}
            className={`tab-button ${mode === 'admin' ? 'tab-active' : 'tab-inactive'}`}
          >
            Admin Login
          </button>
          <button 
            onClick={() => setMode('student')}
            className={`tab-button ${mode === 'student' ? 'tab-active' : 'tab-inactive'}`}
          >
            Student Login
          </button>
        </div>

        <LoginForm 
          mode={mode} 
          onLoginSuccess={onLoginSuccess} 
          onShowRegister={() => setShowAdminRegister(true)}
          onShowActivate={() => setShowStudentActivate(true)}
        />
      </div>

      {/* Modals */}
      {showAdminRegister && (
        <AdminRegisterModal onClose={() => setShowAdminRegister(false)} />
      )}

      {showStudentActivate && (
        <StudentActivateModal onClose={() => setShowStudentActivate(false)} />
      )}
    </div>
  );
};

export default Login;