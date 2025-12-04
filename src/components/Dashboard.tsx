import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DashboardStats } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell 
} from 'recharts';
import { Users, BookOpen, Trophy, TrendingUp, Loader2 } from 'lucide-react';
import '../styles/Dashboard.css';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const dataEnrollment = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 550 },
  { name: 'Apr', value: 480 },
  { name: 'May', value: 600 },
  { name: 'Jun', value: 750 },
];

const dataDepartment = [
  { name: 'CS', value: 1200 },
  { name: 'Eng', value: 900 },
  { name: 'Biz', value: 600 },
  { name: 'Arts', value: 300 },
];

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="stat-card">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
      <span className="text-green-600 dark:text-green-400 font-medium">{trend}</span>
      <span className="text-gray-400 ml-1">vs last month</span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          {/* Enhanced text visibility for dark mode/image backgrounds */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white drop-shadow-sm">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 font-medium drop-shadow-sm">Real-time metrics and insights.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={stats?.totalStudents.toLocaleString()} 
          icon={Users} 
          color="bg-indigo-600"
          trend="+5.2%"
        />
        <StatCard 
          title="Total Faculty" 
          value={stats?.totalFaculty} 
          icon={BookOpen} 
          color="bg-emerald-500"
          trend="+1.8%"
        />
        <StatCard 
          title="Placement Rate" 
          value={`${stats?.placementRate}%`} 
          icon={Trophy} 
          color="bg-amber-500"
          trend="+0.5%"
        />
        <StatCard 
          title="Avg. Attendance" 
          value={`${stats?.avgAttendance}%`} 
          icon={TrendingUp} 
          color="bg-rose-500"
          trend="-0.2%"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="chart-title">Enrollment Trends</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataEnrollment}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#9ca3af" />
                <YAxis axisLine={false} tickLine={false} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Students per Department</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataDepartment}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.1} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#9ca3af" />
                 <YAxis axisLine={false} tickLine={false} stroke="#9ca3af" />
                 <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', color: '#000' }} />
                 <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                    {dataDepartment.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                 </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;