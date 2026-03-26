import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { AuthContext } from '@/contexts/auth-context';

function isAllowedVnuEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return /^[^@\s]+@([a-z0-9-]+\.)*vnu\.edu\.vn$/i.test(email);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRedirectResult(auth).catch((error) => {
      console.error('Error getting redirect result:', error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && !isAllowedVnuEmail(firebaseUser.email)) {
        await firebaseSignOut(auth);
        setUser(null);
        alert('Chỉ cho phép đăng nhập với email VNU (@vnu.edu.vn hoặc subdomain).');
      } else {
        setUser(firebaseUser);
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
      throw error;
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
