import React from 'react';

export default function Loading() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '24px',
        }}>
            {/* Pulsing ring loader */}
            <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '3px solid rgba(255, 140, 0, 0.15)',
                borderTopColor: '#FF8C00',
                animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                fontWeight: 500,
                letterSpacing: '2px',
                textTransform: 'uppercase',
            }}>
                Loading Neural Feed...
            </p>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
