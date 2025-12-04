import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { User } from '../../types';
import { Mail, User as UserIcon, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useTypewriter } from '../../hooks/useTypewriter';

interface LoginFormProps {
  mode: 'admin' | 'student';
  onLoginSuccess: (user: User) => void;
  onShowRegister: () => void;
  onShowActivate: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  mode, 
  onLoginSuccess, 
  onShowRegister, 
  onShowActivate 
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Dynamic Placeholder using Hook
  const adminPlaceholders = ["admin@vtu.edu", "principal@vtu.edu", "registrar@vtu.edu"];
  const studentPlaceholders = ["1GA24CS001", "1GA23EC092", "1GA24ME055"];
  const placeholder = useTypewriter(mode === 'admin' ? adminPlaceholders : studentPlaceholders);

  // Reset inputs when mode switches
  useEffect(() => {
    setIdentifier('');
    setPassword('');
    setError('');
  }, [mode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.login(identifier, password, mode);
      onLoginSuccess(response.user);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow mixed case for Admin, force Upper for Student ID
    if (mode === 'admin') {
      setIdentifier(val);
    } else {
      setIdentifier(val.toUpperCase());
    }
  };

  return (
    <form className="mt-4 space-y-4" onSubmit={handleLogin}>
      <div className="space-y-3">
        <div className="login-input-group">
          <label>
            {mode === 'admin' ? 'Email Address' : 'University Number'}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {mode === 'admin' ? <Mail className="h-4 w-4 text-gray-400" /> : <UserIcon className="h-4 w-4 text-gray-400" />}
            </div>
            <input
              type={mode === 'admin' ? 'email' : 'text'}
              required
              className="login-input"
              placeholder={placeholder}
              value={identifier}
              onChange={handleIdentifierChange}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="login-input-group">
          <label>Password</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              className="login-input pr-10"
              placeholder={showPassword ? "password123" : "••••••••"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-3 rounded-md fade-in">
          <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
            <>
              Sign In <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>

      <div className="text-center pt-2">
        {mode === 'admin' ? (
          <button type="button" onClick={onShowRegister} className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium">
            Create Admin Account
          </button>
        ) : (
          <button type="button" onClick={onShowActivate} className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium">
            First time? Activate Student Account
          </button>
        )}
      </div>
    </form>
  );
};