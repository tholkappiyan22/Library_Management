import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'librarian' | 'admin';
  studentId?: string;
  department?: string;
  phone?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'faculty' | 'librarian' | 'admin';
  studentId?: string;
  department?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'student@college.edu',
    role: 'student',
    studentId: 'STU001',
    department: 'Computer Science',
    phone: '+1234567890'
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    email: 'faculty@college.edu',
    role: 'faculty',
    department: 'Mathematics',
    phone: '+1234567891'
  },
  {
    id: '3',
    name: 'Alice Brown',
    email: 'librarian@college.edu',
    role: 'librarian',
    department: 'Library Services',
    phone: '+1234567892'
  },
  {
    id: '4',
    name: 'Robert Wilson',
    email: 'admin@college.edu',
    role: 'admin',
    department: 'Administration',
    phone: '+1234567893'
  }
];

// Store registered user credentials separately
interface StoredCredentials {
  [email: string]: string; // email -> password mapping
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  useEffect(() => {
    // Check for stored user on app start
    const storedUser = localStorage.getItem('library-user');
    const storedRegisteredUsers = localStorage.getItem('library-registered-users');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedRegisteredUsers) {
      setRegisteredUsers(JSON.parse(storedRegisteredUsers));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get fresh registered users from localStorage
    const storedRegisteredUsers = localStorage.getItem('library-registered-users');
    const currentRegisteredUsers = storedRegisteredUsers ? JSON.parse(storedRegisteredUsers) : [];
    
    // Get stored credentials
    const storedCredentials = localStorage.getItem('library-user-credentials');
    const credentials: StoredCredentials = storedCredentials ? JSON.parse(storedCredentials) : {};
    
    // Check both mock users and registered users
    const allUsers = [...mockUsers, ...currentRegisteredUsers];
    const foundUser = allUsers.find(u => u.email === email);
    
    if (foundUser) {
      // For mock users, use default password
      if (mockUsers.find(u => u.email === email) && password === 'password123') {
        setUser(foundUser);
        localStorage.setItem('library-user', JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      }
      
      // For registered users, check stored credentials
      if (credentials[email] && credentials[email] === password) {
        setUser(foundUser);
        localStorage.setItem('library-user', JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      }
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get current data from localStorage
    const storedRegisteredUsers = localStorage.getItem('library-registered-users');
    const storedCredentials = localStorage.getItem('library-user-credentials');
    
    const currentRegisteredUsers = storedRegisteredUsers ? JSON.parse(storedRegisteredUsers) : [];
    const credentials: StoredCredentials = storedCredentials ? JSON.parse(storedCredentials) : {};
    
    // Check if user already exists
    const allUsers = [...mockUsers, ...currentRegisteredUsers];
    const existingUser = allUsers.find(u => u.email === data.email);
    
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: data.role,
      studentId: data.studentId,
      department: data.department,
      phone: data.phone
    };
    
    const updatedRegisteredUsers = [...currentRegisteredUsers, newUser];
    const updatedCredentials = { ...credentials, [data.email]: data.password };
    
    // Store both user data and credentials
    setRegisteredUsers(updatedRegisteredUsers);
    localStorage.setItem('library-registered-users', JSON.stringify(updatedRegisteredUsers));
    localStorage.setItem('library-user-credentials', JSON.stringify(updatedCredentials));
    
    // Auto login after registration
    setUser(newUser);
    localStorage.setItem('library-user', JSON.stringify(newUser));
    
    setIsLoading(false);
    return true;
  };

  const sendPasswordResetEmail = async (email: string): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Password reset email sent to ${email}`);
    setIsLoading(false);
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('library-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, sendPasswordResetEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
