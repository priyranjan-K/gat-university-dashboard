import { Student, GalleryItem, Department, Page } from '../types';

// Mock Database Structure
// NOTE: All Identifiers (Email, UniNo) are stored in UPPERCASE as per requirement.
export const MOCK_DB = {
  ADMINS: [
    {
      id: "admin-1",
      name: "DR. ADMIN USER",
      email: "ADMIN@VTU.EDU",
      password: "password123", // Passwords remain case sensitive
      role: "admin" as const,
      avatar: "https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff"
    }
  ],
  STUDENTS: [
    {
      id: "st-1",
      universityNo: "1VTU24CS01",
      name: "JOHN STUDENT",
      email: "STUDENT@VTU.EDU",
      password: "password123",
      isRegistered: true,
      branch: "CS",
      section: "A",
      enrollmentNo: "20241001",
      status: "Active",
      gpa: 3.8,
      permissions: { canRead: true, canWrite: false },
      createdAt: "2024-01-15T09:00:00Z",
      updatedAt: "2024-09-10T14:30:00Z"
    },
    {
      id: "st-2",
      universityNo: "1VTU24ME05",
      name: "SARAH MECHANICAL",
      email: "SARAH@VTU.EDU",
      password: "",
      isRegistered: false, // Needs to activate account
      branch: "ME",
      section: "B",
      enrollmentNo: "20241005",
      status: "Active",
      gpa: 3.5,
      permissions: { canRead: true, canWrite: true },
      createdAt: "2024-02-20T10:15:00Z",
      updatedAt: "2024-02-20T10:15:00Z"
    }
  ] as Student[],
  GALLERY: [
    {
      id: 'g1',
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80',
      title: 'Graduation Day 2024',
      likes: 120,
      dislikes: 2,
      comments: [{ id: 'c1', user: 'Sarah', text: 'Amazing day!', date: '2h ago' }],
      userReaction: null
    },
    {
      id: 'g2',
      url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80',
      title: 'New Science Lab',
      likes: 45,
      dislikes: 0,
      comments: [],
      userReaction: null
    },
    {
      id: 'g3',
      url: 'https://images.unsplash.com/photo-1592280771800-bcf291d16296?auto=format&fit=crop&q=80',
      title: 'Sports Week Finals',
      likes: 89,
      dislikes: 5,
      comments: [],
      userReaction: null
    }
  ] as GalleryItem[],
  DEPARTMENTS: [
    {
      id: 'd1',
      name: 'COMPUTER SCIENCE',
      images: [
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581092921461-eab62e97a783?auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'd2',
      name: 'ELECTRONICS',
      images: [
        'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80'
      ]
    }
  ] as Department[],
  SETTINGS: {
    BACKGROUNDS: {
      [Page.DASHBOARD]: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80',
      [Page.COLLEGE]: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80',
      [Page.STUDENTS]: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80',
      [Page.GALLERY]: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&q=80',
      [Page.CAREER]: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80',
      [Page.ABOUT]: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80',
      [Page.SETTINGS]: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80',
    } as Record<string, string>
  }
};