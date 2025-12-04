import React, { useState } from 'react';
import { api } from '../../services/api';
import { BRANCH_CODES, SECTION_CODES, UNI_NO_REGEX } from '../../constants';
import { useTypewriter } from '../../hooks/useTypewriter';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface AddStudentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  // Fields
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [universityNo, setUniversityNo] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(BRANCH_CODES[0]);
  const [selectedSection, setSelectedSection] = useState(SECTION_CODES[0]);
  
  // Validation State
  const isValidUniNo = UNI_NO_REGEX.test(universityNo);
  const isTouched = universityNo.length > 0;

  // Typewriter placeholders
  const namePlaceholder = useTypewriter(["JOHN DOE", "SARAH SMITH", "RAJESH KUMAR"]);
  const emailPlaceholder = useTypewriter(["JOHN@VTU.EDU", "SARAH@VTU.EDU", "RAJ@VTU.EDU"]);
  const idPlaceholder = useTypewriter(["1GA24CS001", "1GA23ME099", "1GA24EC050"]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidUniNo) {
      alert("Invalid University Number format. Must match pattern like 1GA24CS001");
      return;
    }

    setLoading(true);
    try {
      await api.createStudent({ 
        name: newStudentName, 
        email: newStudentEmail,
        universityNo: universityNo,
        branch: selectedBranch,
        section: selectedSection
      });
      onSuccess();
    } catch (e: any) {
      alert(e.message || "Failed to create student");
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
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Create Student Record</h3>
        <form onSubmit={handleAddStudent} className="space-y-4">
          
          {/* Single Field University No */}
          <div>
             <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">UNIVERSITY NUMBER</label>
             <div className="relative">
               <input 
                 required 
                 value={universityNo} 
                 onChange={handleUpper(setUniversityNo)} 
                 placeholder={idPlaceholder}
                 maxLength={10}
                 className={`login-input uppercase ${isTouched ? (isValidUniNo ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : 'border-red-500 focus:border-red-500 focus:ring-red-500') : ''}`} 
               />
               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                 {isTouched && isValidUniNo && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                 {isTouched && !isValidUniNo && <AlertCircle className="h-5 w-5 text-red-500" />}
               </div>
             </div>
             <p className="text-[10px] text-gray-500 mt-1">
               Format: <span className="font-mono">1GA-YY-BRANCH-XXX</span> (e.g., 1GA24CS092)
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input 
                  required 
                  value={newStudentName} 
                  onChange={handleUpper(setNewStudentName)} 
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white uppercase" 
                  placeholder={namePlaceholder} 
                />
             </div>
             <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input 
                  required 
                  type="email" 
                  value={newStudentEmail} 
                  onChange={handleUpper(setNewStudentEmail)} 
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white uppercase" 
                  placeholder={emailPlaceholder} 
                />
             </div>
             <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Branch</label>
                <select 
                  value={selectedBranch} 
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {BRANCH_CODES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
                <select 
                  value={selectedSection} 
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {SECTION_CODES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
             </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Cancel</button>
            <button 
              type="submit" 
              disabled={loading || !isValidUniNo} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};