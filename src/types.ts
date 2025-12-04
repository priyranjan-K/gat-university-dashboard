export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
  avatar?: string;
  universityNo?: string; // For students
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface StudentPermissions {
  canRead: boolean;
  canWrite: boolean;
}

export interface Student {
  id: string;
  universityNo: string; // Unique ID for login
  name: string;
  email: string;
  password?: string; // Hashed in real backend
  isRegistered: boolean; // True only after student sets password
  branch: string; // Previously 'department'
  section: string;
  enrollmentNo: string; // Internal legacy number if needed, or same as UniNo
  status: 'Active' | 'Graduated' | 'Suspended';
  gpa: number;
  permissions: StudentPermissions;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

export interface DashboardStats {
  totalStudents: number;
  totalFaculty: number;
  placementRate: number;
  avgAttendance: number;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  likes: number;
  dislikes: number;
  comments: GalleryComment[];
  userReaction?: 'like' | 'dislike' | null;
}

export interface GalleryComment {
  id: string;
  user: string;
  text: string;
  date: string;
}

export interface Department {
  id: string;
  name: string;
  images: string[]; // Array of image URLs
}

export enum Page {
  DASHBOARD = 'dashboard',
  COLLEGE = 'college',
  STUDENTS = 'students',
  GALLERY = 'gallery',
  CAREER = 'career',
  ABOUT = 'about',
  SETTINGS = 'settings'
}