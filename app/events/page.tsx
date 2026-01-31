import React from 'react';
import EventTimeline from '@/components/events/EventTimeline';
import styles from './page.module.css';

export default function EventsPage() {
    return (
        <div className={`container-custom ${styles.page}`}>
            <h1 className={styles.title}>Upcoming Events</h1>
            <p className={styles.subtitle}>Key conferences shaping the future.</p>
            <EventTimeline />
        </div>
    );
}
