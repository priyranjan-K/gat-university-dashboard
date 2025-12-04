import React, { useState } from 'react';
import { api } from '../../services/api';
import { Key } from 'lucide-react';
import { useTypewriter } from '../../hooks/useTypewriter';

interface StudentActivateModalProps {
  onClose: () => void;
}

export const StudentActivateModal: React.FC<StudentActivateModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [uniNo, setUniNo] = useState('');
  const [branch, setBranch] = useState('');
  const [section, setSection] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic Placeholders
  const idPlaceholder = useTypewriter(["1GA24CS001", "1GA23ME055"]);
  const namePlaceholder = useTypewriter(["JOHN DOE", "JANE SMITH"]);
  const emailPlaceholder = useTypewriter(["JOHN@VTU.EDU", "JANE@VTU.EDU"]);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uniNo.length > 10) {
      alert("University Number invalid (max 10 chars).");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await api.activateStudentAccount(uniNo, email, name, branch, section, password);
      alert("Account activated! You can now login with your University Number.");
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
          <Key className="mr-2" /> Activate Account
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Enter details exactly as provided by Admin to set your password.
        </p>
        <form onSubmit={handleActivate} className="space-y-3">
          <input 
            required 
            placeholder={idPlaceholder}
            maxLength={10} 
            value={uniNo} 
            onChange={handleUpper(setUniNo)} 
            className="login-input uppercase" 
          />
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
            onChange={handleUpper(setEmail)} 
            className="login-input uppercase" 
          />
          <div className="flex gap-2">
            <input 
              required 
              placeholder="BRANCH (e.g. CS)" 
              value={branch} 
              onChange={handleUpper(setBranch)} 
              className="login-input uppercase" 
            />
            <input 
              required 
              placeholder="SECTION (e.g. A)" 
              value={section} 
              onChange={handleUpper(setSection)} 
              className="login-input uppercase" 
            />
          </div>
          <input 
            required 
            type="password" 
            placeholder="Create New Password" 
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
              Activate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};