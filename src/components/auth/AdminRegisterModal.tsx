import React, { useState } from 'react';
import { api } from '../../services/api';
import { ShieldCheck } from 'lucide-react';
import { useTypewriter } from '../../hooks/useTypewriter';

interface AdminRegisterModalProps {
  onClose: () => void;
}

export const AdminRegisterModal: React.FC<AdminRegisterModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic Placeholders
  const namePlaceholder = useTypewriter(["DR. ANJALI SHARMA", "PROF. VIKRAM RAO", "MR. SURESH PATIL"]);
  const emailPlaceholder = useTypewriter(["PRINCIPAL@GAT.EDU", "HOD.CS@GAT.EDU", "ADMIN@GAT.EDU"]);
  const codePlaceholder = useTypewriter(["VTU-ADMIN-2024", "SECRET-CODE-HERE"]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await api.createAdminAccount(name, email, password, adminCode);
      alert("Admin account created! Please login.");
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpper = (setter: (val: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value.toUpperCase());
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="text-xl font-bold mb-4 dark:text-white flex items-center">
          <ShieldCheck className="mr-2" /> Admin Registration
        </h3>
        <form onSubmit={handleRegister} className="space-y-3">
          <input 
            required 
            placeholder={namePlaceholder} 
            value={name} 
            onChange={handleUpper(setName)} 
            className="login-input uppercase" 
          />
          <input 
            required 
            type="email" 
            placeholder={emailPlaceholder}
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="login-input" 
          />
          <input 
            required 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="login-input" 
          />
          <input 
            required 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            className="login-input" 
          />
          <input 
            required 
            placeholder={codePlaceholder}
            value={adminCode} 
            onChange={e => setAdminCode(e.target.value)} 
            className="login-input" 
          />
          <div className="flex gap-2 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-2 text-gray-600 dark:text-gray-400"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};