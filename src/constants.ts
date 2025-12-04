import { Page } from './types';
import { 
  LayoutDashboard, 
  School, 
  Users, 
  Briefcase, 
  Info,
  Image as ImageIcon,
  Settings
} from 'lucide-react';

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.vtu.edu/v1', 
  TIMEOUT: 5000,
};

// Security Constants
export const ADMIN_REGISTRATION_CODE = "VTU-ADMIN-2024";

// University Configuration
export const COLLEGE_CODE = "GA"; // Configurable College Code (GAT)
export const BRANCH_CODES = ["CS", "EC", "ME"]; // Configurable Branches
export const SECTION_CODES = ["A", "B", "C", "D"]; // Configurable Sections
export const UNI_NO_REGEX = /^1[A-Z]{2}[0-9]{2}(CS|EC|ME)[0-9]{3}$/; // Pattern: 1GA14EC092

// Login Configuration
// Using a white column building similar to GAT campus
export const LOGIN_BG_URL = "https://images.unsplash.com/photo-1592280771800-bcf291d16296?auto=format&fit=crop&q=80";

// API Endpoints Map
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER_ADMIN: '/auth/register/admin',
    ACTIVATE_STUDENT: '/auth/activate/student',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
  },
  STUDENTS: {
    LIST: '/students',
    CREATE: '/students',
    DELETE: (id: string) => `/students/${id}`,
    UPDATE: (id: string) => `/students/${id}`,
    UPDATE_PERMISSIONS: (id: string) => `/students/${id}/permissions`,
  },
  GALLERY: {
    LIST: '/gallery',
    INTERACT: (id: string) => `/gallery/${id}/interact`,
    COMMENT: (id: string) => `/gallery/${id}/comment`,
  }
};

// Navigation Configuration
export const NAVIGATION_ITEMS = [
  { id: Page.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { id: Page.COLLEGE, label: 'College Info', icon: School },
  { id: Page.STUDENTS, label: 'Students', icon: Users },
  { id: Page.GALLERY, label: 'Campus Gallery', icon: ImageIcon },
  { id: Page.CAREER, label: 'Career Center', icon: Briefcase },
  { id: Page.ABOUT, label: 'About', icon: Info },
  { id: Page.SETTINGS, label: 'Settings', icon: Settings },
];

export const DEFAULT_BACKGROUNDS: Record<Page, string> = {
  [Page.DASHBOARD]: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80',
  [Page.COLLEGE]: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80',
  [Page.STUDENTS]: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80',
  [Page.GALLERY]: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&q=80',
  [Page.CAREER]: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80',
  [Page.ABOUT]: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80',
  [Page.SETTINGS]: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80',
};

// App Strings
export const APP_NAME = "GAT University";
export const COPYRIGHT_TEXT = "© 2024 GAT University. All rights reserved.";