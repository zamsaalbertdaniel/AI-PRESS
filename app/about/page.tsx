import React from 'react';
import { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'AIPress is a professional AI-native journalistic platform, bridging deep tech research and market impact with clarity and depth. Bilingual RO/EN coverage.',
    openGraph: {
        title: 'About AIPress',
        description: 'The first AI-native bilingual news platform. Deep tech, AI, and the future — curated through Warm Futurism.',
        type: 'website',
    },
};

export default function AboutPage() {
    return <AboutContent />;
}
