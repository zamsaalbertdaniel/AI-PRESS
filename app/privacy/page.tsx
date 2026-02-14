import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'AIPress privacy policy — how we handle your data.',
};

export default function PrivacyPage() {
    return (
        <div className="container-custom" style={{ padding: '60px 24px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '32px', color: 'var(--neon-orange)' }}>
                Privacy Policy
            </h1>
            <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                <p style={{ marginBottom: '20px' }}>
                    <strong style={{ color: 'var(--text-main)' }}>Last updated:</strong> February 2026
                </p>

                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '32px 0 12px' }}>1. Information We Collect</h2>
                <p style={{ marginBottom: '16px' }}>
                    AIPress is a news platform that does not require user registration. We collect minimal data:
                </p>
                <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
                    <li>Standard web server logs (IP address, browser type, pages visited)</li>
                    <li>Analytics data through Vercel Analytics (anonymized)</li>
                </ul>

                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '32px 0 12px' }}>2. How We Use Information</h2>
                <p style={{ marginBottom: '16px' }}>
                    We use collected information solely to improve the platform, monitor performance,
                    and ensure security. We do not sell or share personal data with third parties.
                </p>

                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '32px 0 12px' }}>3. Cookies</h2>
                <p style={{ marginBottom: '16px' }}>
                    We use essential cookies for admin authentication. No third-party tracking cookies are used
                    unless explicitly stated.
                </p>

                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '32px 0 12px' }}>4. AI-Generated Content</h2>
                <p style={{ marginBottom: '16px' }}>
                    AIPress uses artificial intelligence (Google Gemini) to assist in content creation,
                    translation, and editorial analysis. AI-generated content is always reviewed and
                    labeled appropriately.
                </p>

                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '32px 0 12px' }}>5. Contact</h2>
                <p style={{ marginBottom: '16px' }}>
                    For privacy-related inquiries, contact us at{' '}
                    <a href="mailto:contact@aipress.business" style={{ color: 'var(--neon-orange)' }}>
                        contact@aipress.business
                    </a>.
                </p>
            </div>
        </div>
    );
}
