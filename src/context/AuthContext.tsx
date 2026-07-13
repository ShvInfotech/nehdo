import React, { createContext, useContext, useState, useCallback } from "react";

export interface User {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    address: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (email: string, password: string) => boolean;
    signup: (name: string, email: string, password: string) => boolean;
    logout: () => void;
    updateProfile: (data: Partial<User>) => void;
    authModalMode: 'login' | 'signup' | null;
    openAuthModal: (mode?: 'login' | 'signup') => void;
    closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
    name: "Arjun Patel",
    email: "arjun@example.com",
    phone: "+91 98765 43210",
    avatar: "",
    address: "123 Fashion Street, Mumbai, Maharashtra 400001",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(null);

    const login = useCallback((email: string, _password: string) => {
        setUser({ ...mockUser, email });
        setAuthModalMode(null);
        return true;
    }, []);

    const signup = useCallback((name: string, email: string, _password: string) => {
        setUser({ ...mockUser, name, email });
        setAuthModalMode(null);
        return true;
    }, []);

    const logout = useCallback(() => setUser(null), []);

    const updateProfile = useCallback((data: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...data } : null);
    }, []);
    
    const openAuthModal = useCallback((mode: 'login' | 'signup' = 'login') => {
        setAuthModalMode(mode);
    }, []);
    
    const closeAuthModal = useCallback(() => {
        setAuthModalMode(null);
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user, isLoggedIn: !!user, login, signup, logout, updateProfile,
            authModalMode, openAuthModal, closeAuthModal
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
