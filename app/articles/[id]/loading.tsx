import React from 'react';

export default function ArticleLoading() {
    return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '60px 24px',
        }}>
            {/* Category skeleton */}
            <div style={{
                width: '100px',
                height: '14px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '4px',
                marginBottom: '16px',
            }} />
            {/* Title skeleton */}
            <div style={{
                width: '85%',
                height: '28px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '6px',
                marginBottom: '12px',
            }} />
            <div style={{
                width: '60%',
                height: '28px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '6px',
                marginBottom: '24px',
            }} />
            {/* Meta skeleton */}
            <div style={{
                width: '200px',
                height: '14px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '4px',
                marginBottom: '48px',
            }} />
            {/* Content skeleton lines */}
            {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                    width: `${90 - i * 5}%`,
                    height: '14px',
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '4px',
                    marginBottom: '16px',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: `${i * 0.1}s`,
                }} />
            ))}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>
        </div>
    );
}
