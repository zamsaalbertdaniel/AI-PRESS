"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AdminContextType {
    isAuthenticated: boolean;
    login: (password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    // Mock persistence
    useEffect(() => {
        const stored = document.cookie.split('; ').find(row => row.startsWith('aipress_auth='));
        if (stored?.split('=')[1] === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (password: string) => {
        const { loginAdminAction } = await import("@/app/actions/auth");
        const result = await loginAdminAction(password);

        if (result.success) {
            setIsAuthenticated(true);
            localStorage.setItem("aipress_admin_auth", "true");
        }
        return result;
    };

    const logout = async () => {
        const { logoutAdminAction } = await import("@/app/actions/auth");
        await logoutAdminAction();
        setIsAuthenticated(false);
        localStorage.removeItem("aipress_admin_auth");
        router.push("/admin/login");
    };

    return (
        <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
};
