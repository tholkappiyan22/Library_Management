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
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storedRegisteredUsers = localStorage.getItem('library-registered-users');
    const currentRegisteredUsers = storedRegisteredUsers ? JSON.parse(storedRegisteredUsers) : [];
    const storedCredentials = localStorage.getItem('library-user-credentials');
    const credentials: StoredCredentials = storedCredentials ? JSON.parse(storedCredentials) : {};
    
    const allUsers = [...mockUsers, ...currentRegisteredUsers];
    const foundUser = allUsers.find(u => u.email === email);
    
    if (foundUser) {
      if ((mockUsers.some(u => u.email === email) && password === 'password123') || (credentials[email] === password)) {
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
    await new Promise(resolve => setTimeout(resolve, 500));

    const storedRegisteredUsers = localStorage.getItem('library-registered-users');
    const currentRegisteredUsers = storedRegisteredUsers ? JSON.parse(storedRegisteredUsers) : [];
    const allUsers = [...mockUsers, ...currentRegisteredUsers];
    if (allUsers.some(u => u.email === data.email)) {
        setIsLoading(false);
        return false;
    }

    const newUser: User = { id: Date.now().toString(), ...data };
    const updatedRegisteredUsers = [...currentRegisteredUsers, newUser];

    const storedCredentials = localStorage.getItem('library-user-credentials');
    const credentials: StoredCredentials = storedCredentials ? JSON.parse(storedCredentials) : {};
    const updatedCredentials = { ...credentials, [data.email]: data.password };

    localStorage.setItem('library-registered-users', JSON.stringify(updatedRegisteredUsers));
    localStorage.setItem('library-user-credentials', JSON.stringify(updatedCredentials));
    
    setUser(newUser);
    localStorage.setItem('library-user', JSON.stringify(newUser));
    
    setIsLoading(false);
    return true;
  };

  const sendPasswordResetEmail = async (email: string): Promise<void> => {
    setIsLoading(true);
    console.log(`Password reset for ${email}. In a real app, you would send an email with a link like /reset-password?token=some-secret-token`);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    console.log(`Resetting password with token ${token} to ${newPassword}`);
    // In a real app, you would verify the token, find the user, and update their password in the database.
    // For this mock, we'll just assume it's successful.
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('library-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, sendPasswordResetEmail, resetPassword, isLoading }}>
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
