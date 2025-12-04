import React, { useState, useEffect } from 'react';
import { Page, User, Department, GalleryItem } from '../types';
import { Upload, Image as ImageIcon, Plus, Trash2, Save, Layers, Grid, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useTypewriter } from '../hooks/useTypewriter';

interface SettingsProps {
  backgrounds: Record<Page, string>;
  onBackgroundChange: (page: Page, url: string) => void;
  currentUser: User;
}

const Settings: React.FC<SettingsProps> = ({ backgrounds, onBackgroundChange, currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  
  const [newDeptName, setNewDeptName] = useState('');
  
  // Load initial data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getSettings();
        setDepartments(data.departments);
        setGalleryItems(data.galleryImages);
      } catch (e) {
        console.error("Failed to load settings");
      }
    };
    fetchData();
  }, []);

  const uploadPlaceholder = useTypewriter(["Upload image...", "Select file..."]);

  // --- HANDLERS ---

  // 1. Dashboard Background (Single)
  const handleDashboardUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onBackgroundChange(Page.DASHBOARD, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Campus Gallery (Multiple)
  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
           const newItem: GalleryItem = {
             id: `new-g-${Date.now()}-${Math.random()}`,
             url: reader.result as string,
             title: 'New Upload',
             likes: 0,
             dislikes: 0,
             comments: [],
             userReaction: null
           };
           setGalleryItems(prev => [newItem, ...prev]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const deleteGalleryItem = (id: string) => {
    setGalleryItems(prev => prev.filter(i => i.id !== id));
  };

  // 3. Departments (Dynamic Sections)
  const handleAddDepartment = () => {
    if (!newDeptName.trim()) return;
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name: newDeptName.toUpperCase(),
      images: []
    };
    setDepartments([...departments, newDept]);
    setNewDeptName('');
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  const handleDeptImageUpload = (deptId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
           setDepartments(prev => prev.map(d => {
             if (d.id === deptId) {
               return { ...d, images: [...d.images, reader.result as string] };
             }
             return d;
           }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const deleteDeptImage = (deptId: string, imgIndex: number) => {
    setDepartments(prev => prev.map(d => {
      if (d.id === deptId) {
        const newImages = [...d.images];
        newImages.splice(imgIndex, 1);
        return { ...d, images: newImages };
      }
      return d;
    }));
  };

  // --- SAVE ---
  const handleSaveChanges = async () => {
    if (!window.confirm("Are you sure you want to save these changes? This will persist all backgrounds and gallery updates.")) {
      return;
    }

    setLoading(true);
    try {
      await api.saveSettings({
        backgrounds: backgrounds,
        departments: departments,
        galleryImages: galleryItems
      });
      alert("Settings Saved Successfully!");
    } catch (e) {
      alert("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  if (currentUser.role !== 'admin') {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">Access Restricted</h2>
        <p className="text-gray-500">Only administrators can modify system settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Configuration</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage portal appearance and content.</p>
        </div>
      </div>

      {/* SECTION 1: DASHBOARD BACKGROUND */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Layers className="w-5 h-5 mr-2 text-indigo-500" />
          Dashboard Background
        </h2>
        <div className="flex flex-col md:flex-row gap-6 items-start">
           <div className="relative w-full md:w-1/2 h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600">
             <img src={backgrounds[Page.DASHBOARD]} alt="Dashboard Bg" className="w-full h-full object-cover" />
           </div>
           <div className="w-full md:w-1/2">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload New Image</label>
             <label className="flex items-center justify-center w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-500 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <Upload className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{uploadPlaceholder}</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleDashboardUpload} />
             </label>
             <p className="text-xs text-gray-500 mt-2">Recommended size: 1920x1080. Supported formats: JPG, PNG.</p>
           </div>
        </div>
      </div>

      {/* SECTION 2: CAMPUS GALLERY */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Grid className="w-5 h-5 mr-2 text-pink-500" />
            Campus Gallery Images
          </h2>
          <label className="flex items-center px-4 py-2 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-lg cursor-pointer hover:bg-pink-200 text-sm font-medium">
             <Plus className="w-4 h-4 mr-2" /> Add Images
             <input type="file" multiple className="hidden" accept="image/*" onChange={handleGalleryUpload} />
          </label>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {galleryItems.map(item => (
             <div key={item.id} className="relative group rounded-lg overflow-hidden h-32 bg-gray-100 border border-gray-200 dark:border-gray-700">
               <img src={item.url} alt="Gallery" className="w-full h-full object-cover" />
               <button 
                 onClick={() => deleteGalleryItem(item.id)}
                 className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
               >
                 <Trash2 className="w-3 h-3" />
               </button>
             </div>
           ))}
           {galleryItems.length === 0 && (
             <p className="col-span-4 text-center text-gray-400 py-8 text-sm italic">No images in gallery.</p>
           )}
        </div>
      </div>

      {/* SECTION 3: DEPARTMENTS */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Layers className="w-5 h-5 mr-2 text-emerald-500" />
          Department Sections
        </h2>
        
        {/* Add New Dept */}
        <div className="flex gap-2 mb-6">
           <input 
             value={newDeptName}
             onChange={(e) => setNewDeptName(e.target.value)}
             placeholder="New Department Name (e.g. CIVIL)"
             className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white uppercase"
           />
           <button 
             onClick={handleAddDepartment}
             disabled={!newDeptName.trim()}
             className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
           >
             Add Section
           </button>
        </div>

        {/* List Depts */}
        <div className="space-y-6">
           {departments.map((dept) => (
             <div key={dept.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/30">
                <div className="flex justify-between items-center mb-3">
                   <h3 className="font-bold text-gray-800 dark:text-gray-200">{dept.name}</h3>
                   <button 
                     onClick={() => handleDeleteDepartment(dept.id)}
                     className="text-red-500 hover:text-red-700 text-sm flex items-center"
                   >
                     <Trash2 className="w-4 h-4 mr-1" /> Remove Section
                   </button>
                </div>
                
                {/* Images for Dept */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-3">
                  {dept.images.map((img, idx) => (
                    <div key={idx} className="relative group h-20 rounded-md overflow-hidden bg-white">
                       <img src={img} alt="Dept" className="w-full h-full object-cover" />
                       <button 
                         onClick={() => deleteDeptImage(dept.id, idx)}
                         className="absolute top-0 right-0 p-0.5 bg-red-600 text-white rounded-bl opacity-0 group-hover:opacity-100"
                       >
                         <Trash2 className="w-3 h-3" />
                       </button>
                    </div>
                  ))}
                  <label className="h-20 flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                     <Plus className="w-5 h-5 text-gray-400" />
                     <span className="text-[10px] text-gray-500">Add</span>
                     <input type="file" multiple className="hidden" accept="image/*" onChange={handleDeptImageUpload(dept.id)} />
                  </label>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* FLOATING SAVE BUTTON */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={handleSaveChanges}
          disabled={loading}
          className="flex items-center px-6 py-4 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 hover:shadow-2xl hover:-translate-y-1 transition-all"
        >
           {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 mr-2" />}
           <span className="font-bold text-lg">Save Changes</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;