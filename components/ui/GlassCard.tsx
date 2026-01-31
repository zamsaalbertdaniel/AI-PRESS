import React from "react";
import styles from "./GlassCard.module.css";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string; // Allow appending custom classes
    hoverEffect?: boolean;
}

export default function GlassCard({
    children,
    className = "",
    hoverEffect = false,
    ...props
}: GlassCardProps) {
    return (
        <div
            className={`${styles.card} ${hoverEffect ? styles.hover : ""} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
