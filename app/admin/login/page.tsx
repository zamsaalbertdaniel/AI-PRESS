"use client";

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import styles from './page.module.css';

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [code, setCode] = useState(""); // 2FA Code
    const [step, setStep] = useState<'password' | '2fa'>('password');
    const [error, setError] = useState("");
    const { login } = useAdmin();
    const router = useRouter();

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Use the context login (which now calls the server action)
        const success = await login(password);

        if (success) {
            setStep('2fa');
        } else {
            setError("Invalid Access Key");
        }
    };

    const handle2FASubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Still mock 2FA for now
        if (code === "123456") {
            router.push('/admin/dashboard');
        } else {
            setError("Invalid 2FA Code");
        }
    };

    return (
        <div className={styles.container}>
            <GlassCard className={styles.loginCard}>
                <h1 className={styles.title}>Admin Gate</h1>

                {step === 'password' ? (
                    <form onSubmit={handlePasswordSubmit} className={styles.form}>
                        <input
                            type="password"
                            placeholder="Secure Access Key"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className={styles.button}>Authenticate</button>
                    </form>
                ) : (
                    <form onSubmit={handle2FASubmit} className={styles.form}>
                        <div className={styles.twoFaNote}>
                            Enter 2FA Code (Mock: 123456)
                        </div>
                        <input
                            type="text"
                            placeholder="000000"
                            className={styles.input}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength={6}
                            autoFocus
                        />
                        <button type="submit" className={styles.button}>Verify Identity</button>
                    </form>
                )}

                {error && <p className={styles.error}>{error}</p>}
            </GlassCard>
        </div>
    );
}
