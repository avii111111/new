import { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  login: () => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  appUser: any | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  loginAsDemoAdmin: async () => {},
  logout: async () => {},
  token: null,
  appUser: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [appUser, setAppUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        const idToken = await fbUser.getIdToken();
        setToken(idToken);
        
        // Sync with backend
        try {
          const res = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ email: fbUser.email, name: fbUser.displayName }),
          });
          if (res.ok) {
            const data = await res.json();
            setAppUser(data.user);
          }
        } catch (e) {
          console.error("Failed to sync user", e);
        }
      } else {
        const demoToken = localStorage.getItem('demo_token');
        if (demoToken) {
          try {
            setUser(JSON.parse(localStorage.getItem('demo_user') || 'null'));
            setAppUser(JSON.parse(localStorage.getItem('demo_app_user') || 'null'));
          } catch(e) {}
          setToken(demoToken);
        } else {
          setToken(null);
          setAppUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      googleAuthProvider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  const loginAsDemoAdmin = async () => {
    const idToken = 'demo-admin-token';
    const mockUser = {
      uid: 'demo-admin',
      email: 'admin@ai-solutions.co.uk',
      displayName: 'Admin',
      photoURL: null,
    } as any;
    
    // Sync with backend before setting state to avoid premature fetchStats
    try {
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email: mockUser.email, name: mockUser.displayName }),
      });
      if (res.ok) {
        const data = await res.json();
        
        // Auto-configure admin role and seed data on Cloud SQL database
        try {
          await fetch('/api/admin/setup', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${idToken}` }
          });
        } catch (setupErr) {
          console.error("Auto-setup failed", setupErr);
        }
        
        const adminUser = { ...data.user, role: 'admin' };
        
        // Set state after setup
        setUser(mockUser);
        setToken(idToken);
        localStorage.setItem('demo_token', idToken);
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        setAppUser(adminUser);
        localStorage.setItem('demo_app_user', JSON.stringify(adminUser));
      } else {
        // Fallback setting state if sync fails
        setUser(mockUser);
        setToken(idToken);
      }
    } catch (e) {
      console.error("Failed to sync user", e);
      setUser(mockUser);
      setToken(idToken);
    }
  };

  const logout = async () => {
    localStorage.removeItem('demo_token');
    localStorage.removeItem('demo_user');
    localStorage.removeItem('demo_app_user');
    setUser(null);
    setToken(null);
    setAppUser(null);
    try {
      await signOut(auth);
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAsDemoAdmin, logout, token, appUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
