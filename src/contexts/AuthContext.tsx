import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result after Google sign-in redirect
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        const user = result.user;
        if (user.email && !user.email.endsWith('@vnu.edu.vn')) {
          firebaseSignOut(auth);
          alert('Chỉ cho phép đăng nhập với email @vnu.edu.vn');
        }
      }
    }).catch((error) => {
      console.error('Redirect sign-in error:', error);
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Verify that the user's email ends with @vnu.edu.vn
      if (user && user.email && !user.email.endsWith('@vnu.edu.vn')) {
        firebaseSignOut(auth);
        setUser(null);
        alert('Chỉ cho phép đăng nhập với email @vnu.edu.vn');
      } else {
        setUser(user);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      // Fallback to popup if redirect fails
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        if (user.email && !user.email.endsWith('@vnu.edu.vn')) {
          await firebaseSignOut(auth);
          throw new Error('Chỉ cho phép đăng nhập với email @vnu.edu.vn');
        }
      } catch (popupError) {
        console.error('Popup sign-in also failed:', popupError);
        throw popupError;
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
