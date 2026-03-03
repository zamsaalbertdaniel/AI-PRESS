import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AIPress — AI News · Warm Futurism';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #080707 0%, #0F1115 40%, #1A0B2E 100%)',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Ambient glow effects */}
                <div style={{
                    position: 'absolute', top: '-100px', right: '-100px',
                    width: '400px', height: '400px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0,209,255,0.15) 0%, transparent 70%)',
                    display: 'flex',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-80px', left: '-80px',
                    width: '350px', height: '350px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,140,0,0.12) 0%, transparent 70%)',
                    display: 'flex',
                }} />

                {/* Logo */}
                <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    fontSize: '72px',
                    fontWeight: 800,
                    letterSpacing: '-2px',
                }}>
                    <span style={{ color: '#F5F0E6' }}>AI</span>
                    <span style={{ color: '#FF8C00' }}>Press</span>
                </div>

                {/* Tagline */}
                <div style={{
                    display: 'flex',
                    fontSize: '24px',
                    color: '#94A3B8',
                    marginTop: '16px',
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                }}>
                    AI News · Warm Futurism
                </div>

                {/* Accent line */}
                <div style={{
                    display: 'flex',
                    width: '120px',
                    height: '3px',
                    marginTop: '24px',
                    background: 'linear-gradient(90deg, #FF8C00, #00D1FF)',
                    borderRadius: '2px',
                }} />

                {/* Bottom info */}
                <div style={{
                    display: 'flex',
                    position: 'absolute',
                    bottom: '32px',
                    fontSize: '16px',
                    color: 'rgba(148, 163, 184, 0.6)',
                    letterSpacing: '2px',
                }}>
                    aipress.business
                </div>
            </div>
        ),
        { ...size }
    );
}
