import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface AdminUser {
    email: string;
    name: string;
    role: string;
}

interface AdminAuthContextType {
    adminUser: AdminUser | null;
    isAdminLoggedIn: boolean;
    adminLogin: (email: string, password: string) => { success: boolean; error?: string };
    adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Default admin credentials
const ADMIN_CREDENTIALS = {
    email: "admin@nehdo.com",
    password: "admin123",
    name: "Admin User",
    role: "Super Admin",
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
        const stored = localStorage.getItem("nehdo_admin");
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                return null;
            }
        }
        return null;
    });

    useEffect(() => {
        if (adminUser) {
            localStorage.setItem("nehdo_admin", JSON.stringify(adminUser));
        } else {
            localStorage.removeItem("nehdo_admin");
        }
    }, [adminUser]);

    const adminLogin = useCallback((email: string, password: string) => {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            const user: AdminUser = {
                email: ADMIN_CREDENTIALS.email,
                name: ADMIN_CREDENTIALS.name,
                role: ADMIN_CREDENTIALS.role,
            };
            setAdminUser(user);
            return { success: true };
        }
        return { success: false, error: "Invalid email or password. Please try again." };
    }, []);

    const adminLogout = useCallback(() => {
        setAdminUser(null);
        localStorage.removeItem("nehdo_admin");
    }, []);

    return (
        <AdminAuthContext.Provider value={{ adminUser, isAdminLoggedIn: !!adminUser, adminLogin, adminLogout }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const ctx = useContext(AdminAuthContext);
    if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
    return ctx;
};
