import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';

import { userapiRequest,setUnauthorizedHandler } from '../services/apiService';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profile: string;
  address: any[];
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: FormData) => Promise<void>
  authModalMode: 'login' | 'signup' | null;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // Load user from localStorage on app start
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(null);

  // Keep localStorage synced
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
  setUnauthorizedHandler(() => {
    setUser(null);
    setAuthModalMode('login');
  });
}, []);

  const login = useCallback(async (email: string, _password: string) => {
    try {
      const payload = {
        email,
        password: _password,
      };

      const res: any = await userapiRequest(
        '/user/api/v1/auth/login',
        'POST',
        payload
      );


      const loggedInUser: User = {
        _id:res.user?._id || "",
        name: res.user?.name || '',
        email: res.user?.email || '',
        phone: res.user?.phone || '',
        profile: res.user?.profile || '',
        address: res.user?.address || '',
      };

  

      setUser(loggedInUser);

      // Save token if backend returns it
      if (res.accesstoken) {
        localStorage.setItem('accessToken', res.accesstoken);
      }

      setAuthModalMode(null);

      return true;
    } catch (error: any) {
       console.error(error);
  throw error;
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, _password: string) => {
    try {
      const payload = {
        name,
        email,
        password: _password,
        deviceToken: ''
      };

      const res: any = await userapiRequest(
        '/user/api/v1/auth/register',
        'POST',
        payload
      );

      console.log('signup call', res);

      const registeredUser: User = {
         _id: res.user?._id || '',
        name: res.user?.name || name,
        email: res.user?.email || email,
        phone: res.user?.phone || '',
        profile: res.user?.profile || '',
        address: res.user?.address || '',
      };

      setUser(registeredUser);

      if (res.accesstoken) {
        localStorage.setItem('accessToken', res.accesstoken);
      }

      setAuthModalMode(null);

      return true;
    } catch (error: any) {
       console.error(error);
  throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  }, []);

  const updateProfile = useCallback(async (data: FormData) => {
    const res = await userapiRequest(`/user/api/v1/auth/updateprofile/${user?._id}`,"POST",data)
  
    setUser({...res.user});
  }, []);

  const openAuthModal = useCallback((mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalMode(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        signup,
        logout,
        updateProfile,
        authModalMode,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
};