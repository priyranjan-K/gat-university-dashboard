import { AuthResponse, DashboardStats, Student, User, GalleryItem, Department, Page } from '../types';
import { MOCK_DB } from './mockData';
import { ADMIN_REGISTRATION_CODE, UNI_NO_REGEX } from '../constants';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  private token: string | null = localStorage.getItem('auth_token');
  
  // State is maintained in memory for this session (simulating a DB connection)
  private db = { ...MOCK_DB };

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': this.token ? `Bearer ${this.token}` : '',
    };
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // --- AUTHENTICATION ---

  async login(identifier: string, password: string, role: 'admin' | 'student'): Promise<AuthResponse> {
    await delay(800);
    
    // CASE INSENSITIVE LOGIN
    const upperId = identifier.toUpperCase();
    
    let user: User | null = null;

    if (role === 'admin') {
      const admin = this.db.ADMINS.find(a => a.email === upperId && a.password === password);
      if (admin) {
        user = { ...admin };
      }
    } else {
      // Student login via University Number
      const student = this.db.STUDENTS.find(s => s.universityNo === upperId && s.password === password);
      if (student) {
        if (!student.isRegistered) {
           throw new Error("Account not activated. Please set your password first.");
        }
        user = { 
          id: student.id, 
          name: student.name, 
          email: student.email, 
          role: 'student', 
          universityNo: student.universityNo,
          avatar: `https://ui-avatars.com/api/?name=${student.name}&background=10b981&color=fff`
        };
      }
    }

    if (user) {
      const mockResponse: AuthResponse = {
        token: "mock-jwt-token-" + Date.now(),
        user: user
      };
      this.setToken(mockResponse.token);
      return mockResponse;
    }
    
    throw new Error("Invalid credentials");
  }

  async createAdminAccount(name: string, email: string, password: string, adminCode: string): Promise<void> {
    await delay(1000);
    const upperEmail = email.toUpperCase();
    const upperName = name.toUpperCase();

    if (adminCode !== ADMIN_REGISTRATION_CODE) {
      throw new Error("Invalid Admin Code.");
    }
    if (this.db.ADMINS.find(a => a.email === upperEmail)) {
      throw new Error("Admin email already exists.");
    }

    this.db.ADMINS.push({
      id: `admin-${Date.now()}`,
      name: upperName,
      email: upperEmail,
      password,
      role: 'admin',
      avatar: `https://ui-avatars.com/api/?name=${upperName}&background=4f46e5&color=fff`
    });
  }

  async activateStudentAccount(universityNo: string, email: string, name: string, branch: string, section: string, newPassword: string): Promise<void> {
    await delay(1200);
    
    // Normalize Input
    const uUniNo = universityNo.toUpperCase();
    const uEmail = email.toUpperCase();
    const uName = name.toUpperCase();
    const uBranch = branch.toUpperCase();
    const uSection = section.toUpperCase();

    const student = this.db.STUDENTS.find(s => s.universityNo === uUniNo);

    if (!student) throw new Error("University Number not found.");
    if (student.isRegistered) throw new Error("Account already active. Please login.");

    // Strict validation
    if (
      student.email !== uEmail ||
      student.name !== uName ||
      student.branch !== uBranch ||
      student.section !== uSection
    ) {
      throw new Error("Details do not match our records. Contact Admin.");
    }

    // Activate
    student.password = newPassword;
    student.isRegistered = true;
    student.updatedAt = new Date().toISOString();
  }

  async logout(): Promise<void> {
    await delay(500);
    this.clearToken();
  }

  // --- DATA ---

  async getDashboardStats(): Promise<DashboardStats> {
    await delay(800);
    return {
      totalStudents: this.db.STUDENTS.length,
      totalFaculty: 85,
      placementRate: 94.5,
      avgAttendance: 88,
    };
  }

  // --- STUDENTS ---

  async getStudents(): Promise<Student[]> {
    await delay(600);
    return [...this.db.STUDENTS];
  }

  async createStudent(studentData: Partial<Student>): Promise<Student> {
    await delay(800);
    
    const uUniNo = studentData.universityNo?.toUpperCase() || '';
    
    // STRICT VALIDATION
    if (!UNI_NO_REGEX.test(uUniNo)) {
      throw new Error(`Invalid University No format. Expected 10 chars (e.g., 1GA14EC092). Got: ${uUniNo}`);
    }
    
    if (this.db.STUDENTS.find(s => s.universityNo === uUniNo)) {
      throw new Error("University Number already exists.");
    }

    const now = new Date().toISOString();

    const newStudent: Student = {
      id: `st-${Date.now()}`,
      name: studentData.name?.toUpperCase() || 'STUDENT',
      email: studentData.email?.toUpperCase() || '',
      universityNo: uUniNo,
      branch: studentData.branch?.toUpperCase() || 'GENERAL',
      section: studentData.section?.toUpperCase() || 'A',
      enrollmentNo: `2024${Math.floor(Math.random() * 9000) + 1000}`,
      status: 'Active',
      gpa: 0.0,
      isRegistered: false, // Default false, must activate
      password: '', // Empty initially
      permissions: { canRead: true, canWrite: false },
      createdAt: now,
      updatedAt: now,
      ...studentData
    } as Student;
    
    this.db.STUDENTS.unshift(newStudent);
    return newStudent;
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<void> {
    await delay(500);
    const index = this.db.STUDENTS.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Student not found");
    
    this.db.STUDENTS[index] = { 
      ...this.db.STUDENTS[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
  }

  async deleteStudent(id: string): Promise<void> {
    await delay(500);
    this.db.STUDENTS = this.db.STUDENTS.filter(s => s.id !== id);
  }

  async updatePermissions(id: string, permissions: { canRead: boolean; canWrite: boolean }): Promise<void> {
    await delay(300);
    const student = this.db.STUDENTS.find(s => s.id === id);
    if (student) {
      student.permissions = permissions;
      student.updatedAt = new Date().toISOString();
    }
  }

  // --- GALLERY ---

  async getGallery(): Promise<GalleryItem[]> {
    await delay(500);
    return [...this.db.GALLERY];
  }

  async interactGallery(id: string, action: 'like' | 'dislike'): Promise<void> {
    await delay(200);
    const item = this.db.GALLERY.find(g => g.id === id);
    if (item) {
      if (item.userReaction === action) {
        // Toggle off
        item.userReaction = null;
        if (action === 'like') item.likes--;
        if (action === 'dislike') item.dislikes--;
      } else {
        // Switch reaction
        if (item.userReaction === 'like') item.likes--;
        if (item.userReaction === 'dislike') item.dislikes--;
        
        item.userReaction = action;
        if (action === 'like') item.likes++;
        if (action === 'dislike') item.dislikes++;
      }
    }
  }

  async commentGallery(id: string, text: string, userName: string): Promise<GalleryItem> {
    await delay(300);
    const item = this.db.GALLERY.find(g => g.id === id);
    if (!item) throw new Error("Not found");
    
    const newComment = {
      id: `c-${Date.now()}`,
      user: userName,
      text,
      date: 'Just now'
    };
    item.comments.push(newComment);
    return item;
  }

  // --- SETTINGS & DEPARTMENTS ---

  async getSettings(): Promise<any> {
    await delay(400);
    return {
      backgrounds: { ...this.db.SETTINGS.BACKGROUNDS },
      departments: [...this.db.DEPARTMENTS],
      galleryImages: [...this.db.GALLERY]
    };
  }

  async saveSettings(settings: { backgrounds: Record<string, string>, departments: Department[], galleryImages: GalleryItem[] }): Promise<void> {
    await delay(1000);
    
    // Simulate updating DB
    this.db.SETTINGS.BACKGROUNDS = settings.backgrounds;
    this.db.DEPARTMENTS = settings.departments;
    
    // Merge gallery changes (simple overwrite for demo)
    this.db.GALLERY = settings.galleryImages;

    console.log("Settings Saved to Backend:", settings);
  }
}

export const api = new ApiService();