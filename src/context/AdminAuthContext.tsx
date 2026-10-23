import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { apiRequest } from "../services/apiService"
import { toast } from "react-toastify";
import { getDeviceToken } from "../services/firebase";

interface AdminUser {
    email: string;
    name: string;
    role: string;
    profile: string;
}

interface AdminAuthContextType {
    adminUser: AdminUser | null;
    isAdminLoggedIn: boolean;
    adminLogin: (
        email: string,
        password: string,
        deviceToken?: string | null
    ) => Promise<{
        success: boolean;
        error?: string;
    }>;
    adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);


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

    const [accessToken, setAccessToken] = useState<any | null>(() => {
        return localStorage.getItem('admin_token');
    });

    useEffect(() => {
        if (adminUser) {
            localStorage.setItem("nehdo_admin", JSON.stringify(adminUser));
            localStorage.setItem('admin_token', accessToken);
        } else {
            localStorage.removeItem("nehdo_admin");
            localStorage.removeItem("admin_token");
        }
    }, [adminUser, accessToken]);

    const adminLogin = useCallback(async (email: string, password: string, deviceToken?: string | null) => {
        try {
            let token = deviceToken;
            if (!token) {
                try {
                    token = await getDeviceToken();
                } catch (e) {
                    console.error("Device token retrieval error:", e);
                }
            }

            const payload: any = { email, password };
            if (token) {
                payload.deviceToken = token;
            }

            const data = await apiRequest('/user/api/v1/auth/login', "POST", payload, {});
        
            if (data.user.role !== "admin") {
                return { success: false, error: "Invalid email or password. Please try again." };
            }
            setAdminUser(data.user);
            setAccessToken(data.accesstoken);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error?.message || "Invalid email or password. Please try again." };
        }
    }, []);

    const adminLogout = useCallback(async() => {
        await apiRequest('/user/api/v1/auth/logout','POST')
        setAdminUser(null);
        setAccessToken(null)
        localStorage.removeItem("nehdo_admin");
        localStorage.removeItem("admin_token");
        toast.warning("logout")
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
