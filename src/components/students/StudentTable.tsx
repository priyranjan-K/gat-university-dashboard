import React, { useState, useRef, useEffect } from 'react';
import { Student } from '../../types';
import { UserCircle, MoreHorizontal, Edit2, Trash2, Shield } from 'lucide-react';

interface StudentTableProps {
  students: Student[];
  isAdmin: boolean;
  onTogglePermission: (id: string, type: 'read' | 'write', currentValue: boolean) => void;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({ 
  students, 
  isAdmin, 
  onTogglePermission,
  onEdit,
  onDelete
}) => {
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenActionId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Graduated': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="table-container min-h-[400px]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="table-header-cell">Student</th>
              <th className="table-header-cell">Uni No.</th>
              <th className="table-header-cell">Branch/Sec</th>
              <th className="table-header-cell">Joined</th>
              <th className="table-header-cell">Modified</th>
              <th className="table-header-cell">Status</th>
              {isAdmin && <th className="table-header-cell">Permissions</th>}
              <th className="table-header-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {students.map((student) => (
              <tr key={student.id} className="table-row relative">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                      <UserCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{student.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400 font-mono">{student.universityNo}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{student.branch} - {student.section}</td>
                <td className="p-4 text-xs text-gray-500 dark:text-gray-400">{formatDate(student.createdAt)}</td>
                <td className="p-4 text-xs text-gray-500 dark:text-gray-400">{formatDate(student.updatedAt)}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className={`status-badge ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                    {!student.isRegistered && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Pending Activation</span>
                    )}
                  </div>
                </td>
                {isAdmin && (
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onTogglePermission(student.id, 'read', student.permissions.canRead)}
                        className={`p-1.5 rounded ${student.permissions.canRead ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-400 dark:bg-gray-700'}`}
                        title="Toggle Read Access"
                      >
                        <span className="text-xs font-bold">R</span>
                      </button>
                      <button 
                        onClick={() => onTogglePermission(student.id, 'write', student.permissions.canWrite)}
                        className={`p-1.5 rounded ${student.permissions.canWrite ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-400 dark:bg-gray-700'}`}
                        title="Toggle Write Access"
                      >
                        <span className="text-xs font-bold">W</span>
                      </button>
                    </div>
                  </td>
                )}
                <td className="p-4 text-right relative">
                  <button 
                    onClick={() => setOpenActionId(openActionId === student.id ? null : student.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>

                  {/* Dropdown Menu */}
                  {openActionId === student.id && (
                    <div ref={actionMenuRef} className="dropdown-menu">
                       <button onClick={() => { onEdit(student); setOpenActionId(null); }} className="dropdown-item">
                          <Edit2 className="w-4 h-4 mr-2" /> Modify
                       </button>
                       {isAdmin && (
                         <button onClick={() => { onDelete(student.id); setOpenActionId(null); }} className="dropdown-item dropdown-item-danger">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                         </button>
                       )}
                       {!isAdmin && (
                         <div className="p-2 text-xs text-center text-gray-400">Read Only</div>
                       )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};