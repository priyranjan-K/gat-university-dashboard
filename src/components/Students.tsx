import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Student, User } from '../types';
import { Search, Filter, Download, Plus, Loader2 } from 'lucide-react';
import '../styles/Students.css';

// Sub Components
import { AddStudentModal } from './students/AddStudentModal';
import { EditStudentModal } from './students/EditStudentModal';
import { StudentTable } from './students/StudentTable';

interface StudentsProps {
  currentUser: User;
}

const Students: React.FC<StudentsProps> = ({ currentUser }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  const isAdmin = currentUser.role === 'admin';

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await api.getStudents();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionSuccess = async () => {
    setShowAddModal(false);
    setEditingStudent(null);
    setLoading(true); // Show loading state briefly while refreshing
    await fetchStudents();
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      alert("Only admins can delete records.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this student record? This cannot be undone.")) {
      try {
        await api.deleteStudent(id);
        await fetchStudents(); // Refresh list immediately
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  const togglePermission = async (id: string, type: 'read' | 'write', currentValue: boolean) => {
    if (!isAdmin) return;
    const student = students.find(s => s.id === id);
    if (!student) return;

    const newPermissions = { ...student.permissions, [type === 'read' ? 'canRead' : 'canWrite']: !currentValue };
    
    // Optimistic update
    setStudents(students.map(s => s.id === id ? { ...s, permissions: newPermissions } : s));
    
    try {
      await api.updatePermissions(id, newPermissions);
    } catch (e) {
      // Revert if failed
      fetchStudents();
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students Directory</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage student records and permissions.</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Student
          </button>
        )}
      </div>

      {showAddModal && (
        <AddStudentModal onClose={() => setShowAddModal(false)} onSuccess={handleActionSuccess} />
      )}

      {editingStudent && (
        <EditStudentModal 
          student={editingStudent} 
          onClose={() => setEditingStudent(null)} 
          onSuccess={handleActionSuccess} 
        />
      )}

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by Name or University No..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
           <div className="flex p-10 justify-center text-gray-500 dark:text-gray-400">
             <Loader2 className="animate-spin mr-2"/> Loading students...
           </div>
        ) : (
          <StudentTable 
            students={students} 
            isAdmin={isAdmin} 
            onTogglePermission={togglePermission}
            onEdit={(student) => setEditingStudent(student)}
            onDelete={handleDelete}
          />
      )}
    </div>
  );
};

export default Students;