import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Corrected: Using relative path
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    sendPasswordResetEmail as firebaseSendPasswordResetEmail,
    updateProfile,
    User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// The User interface for our application.
// The `role` property is now an array to support multiple roles.
export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: ('student' | 'faculty' | 'librarian' | 'admin')[];
  studentId?: string;
  department?: string;
  phone?: string;
}

// Data needed during the registration process.
interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'faculty' | 'librarian' | 'admin';
  studentId?: string;
  department?: string;
  phone?: string;
}

// The shape of our authentication context.
interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setIsLoading(true);
        if (currentUser) {
            setFirebaseUser(currentUser);
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setUser(userDoc.data() as AppUser);
            }
        } else {
            setFirebaseUser(null);
            setUser(null);
        }
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Error signing in:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const newUser = userCredential.user;

      await updateProfile(newUser, { displayName: data.name });

      // ** SPECIAL LOGIC FOR YOUR EMAIL **
      // If the email is tholkappiyan017@gmail.com, assign both admin and librarian roles.
      // Otherwise, assign the single role selected in the form.
      const userRoles: ('student' | 'faculty' | 'librarian' | 'admin')[] = 
          data.email.toLowerCase() === 'tholkappiyan017@gmail.com'
          ? ['admin', 'librarian']
          : [data.role];

      const userProfile: AppUser = {
        uid: newUser.uid,
        name: data.name,
        email: data.email,
        role: userRoles, // Assign the roles array
        studentId: data.studentId || '',
        department: data.department || '',
        phone: data.phone || '',
      };
      
      await setDoc(doc(db, "users", newUser.uid), userProfile);
      
      return true;
    } catch (error) {
      console.error("Error registering:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendPasswordResetEmail = async (email: string): Promise<void> => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, login, register, logout, sendPasswordResetEmail, isLoading }}>
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