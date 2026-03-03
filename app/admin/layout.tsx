"use client";
import { AdminProvider, useAdmin } from "@/context/AdminContext";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";
import Link from "next/link";

// Inner component to use the hook
function AdminGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAdmin();
    const pathname = usePathname();

    // If on login page, just show children (the login form)
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    // Middleware handles the redirect, but we still check isAuthenticated 
    // to prevent a flash of unauthenticated content during hydration
    if (!isAuthenticated) {
        return null;
    }

    // Otherwise show the Dashboard Layout (Sidebar + Content)
    return (
        <div className={styles.adminLayout}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>AI<span className={styles.highlight}>Admin</span></div>
                <nav className={styles.nav}>
                    <Link href="/admin/dashboard" className={styles.link}>Mission Control</Link>
                    <Link href="/admin/sources" className={styles.link}>Source Manager</Link>
                    <Link href="/admin/pipeline" className={styles.link}>Content Pipeline</Link>
                    <Link href="/admin/settings" className={styles.link}>System Settings</Link>
                </nav>
                <div className={styles.footer}>
                    <span className={styles.status}>● Secure</span>
                </div>
            </aside>
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminProvider>
            <AdminGuard>{children}</AdminGuard>
        </AdminProvider>
    );
}
