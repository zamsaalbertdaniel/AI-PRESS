import React from 'react';
import { Metadata } from 'next';
import EventTimeline from '@/components/events/EventTimeline';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Events',
    description: 'Key AI and deep tech conferences shaping the future. Stay updated with the most important events in artificial intelligence, machine learning, and technology.',
    openGraph: {
        title: 'AI & Tech Events | AIPress',
        description: 'Key conferences and events shaping the future of artificial intelligence and deep tech.',
        type: 'website',
    },
};

export default function EventsPage() {
    return (
        <div className={`container-custom ${styles.page}`}>
            <h1 className={styles.title}>Upcoming Events</h1>
            <p className={styles.subtitle}>Key conferences shaping the future.</p>
            <EventTimeline />
        </div>
    );
}
