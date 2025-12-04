import React, { useState } from 'react';
import { api } from '../../services/api';
import { Student } from '../../types';
import { BRANCH_CODES, SECTION_CODES } from '../../constants';
import { Loader2 } from 'lucide-react';
import { useTypewriter } from '../../hooks/useTypewriter';

interface EditStudentModalProps {
  student: Student;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({ student, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [branch, setBranch] = useState(student.branch);
  const [section, setSection] = useState(student.section);
  const [status, setStatus] = useState(student.status);

  // Placeholders
  const namePlaceholder = useTypewriter(["FULL NAME", "STUDENT NAME"]);
  const emailPlaceholder = useTypewriter(["EMAIL@VTU.EDU", "STUDENT@VTU.EDU"]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateStudent(student.id, {
        name,
        email,
        branch,
        section,
        status
      });
      onSuccess();
    } catch (e: any) {
      alert(e.message || "Failed to update");
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
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Edit Student: {student.universityNo}</h3>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input 
              required 
              value={name} 
              onChange={handleUpper(setName)} 
              className="login-input uppercase" 
              placeholder={namePlaceholder}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input 
              required 
              type="email" 
              value={email} 
              onChange={handleUpper(setEmail)} 
              className="login-input uppercase" 
              placeholder={emailPlaceholder}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Branch</label>
                <select 
                  value={branch} 
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {BRANCH_CODES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
                <select 
                  value={section} 
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {SECTION_CODES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
             </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select 
              value={status} 
              onChange={(e: any) => setStatus(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="Graduated">Graduated</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 flex items-center">
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />} Update Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};