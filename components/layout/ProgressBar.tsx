"use client";
import { useEffect, useState } from 'react';
import styles from './ProgressBar.module.css';

export default function ProgressBar() {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollTotal <= 0) return;
            const currentProgress = (window.scrollY / scrollTotal) * 100;
            setWidth(currentProgress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return <div className={styles.progress} style={{ width: `${width}%` }} />;
}
