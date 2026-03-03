"use client";

import React from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
            textAlign: 'center',
            padding: '40px 24px',
        }}>
            <div style={{
                fontSize: 'clamp(4rem, 12vw, 7rem)',
                fontWeight: 800,
                fontFamily: 'var(--font-outfit), sans-serif',
                background: 'linear-gradient(135deg, #FF8C00 0%, #FFD700 50%, #00D1FF 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
                marginBottom: '16px',
            }}>
                ⚡
            </div>
            <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                marginBottom: '12px',
            }}>
                System Glitch
            </h1>
            <p style={{
                fontSize: '1rem',
                color: 'var(--text-muted)',
                maxWidth: '420px',
                lineHeight: 1.6,
                marginBottom: '32px',
            }}>
                A temporary malfunction occurred in the neural network.
                {error.digest && (
                    <span style={{ display: 'block', marginTop: '8px', fontSize: '0.8rem', opacity: 0.5 }}>
                        Digest: {error.digest}
                    </span>
                )}
            </p>
            <button
                onClick={reset}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 28px',
                    background: 'linear-gradient(135deg, #FF8C00, #e07800)',
                    color: '#000',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 140, 0, 0.3)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                ↻ Retry Connection
            </button>
        </div>
    );
}
