"use client";

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import styles from './page.module.css';

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAdmin();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await login(password);

            if (result.success) {
                router.push('/admin/dashboard');
            } else {
                setError(result.error || "Invalid Access Key");
            }
        } catch {
            setError("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <GlassCard className={styles.loginCard}>
                <h1 className={styles.title}>Admin Gate</h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="password"
                        placeholder="Secure Access Key"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        autoFocus
                    />
                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? "Authenticating..." : "Authenticate"}
                    </button>
                </form>

                {error && <p className={styles.error}>{error}</p>}
            </GlassCard>
        </div>
    );
}
