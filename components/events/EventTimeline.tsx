import React from 'react';
import styles from './EventTimeline.module.css';

interface Event {
    id: number;
    date: string;
    title: string;
    location: string;
}

const EVENTS: Event[] = [
    { id: 1, date: "MAR 15, 2026", title: "AI World Congress", location: "London, UK" },
    { id: 2, date: "APR 02, 2026", title: "OpenAI DevDay", location: "San Francisco, USA" },
    { id: 3, date: "MAY 10, 2026", title: "Robotics Summit", location: "Boston, USA" },
    { id: 4, date: "JUN 20, 2026", title: "DeepMind Alpha Conference", location: "Paris, France" },
];

export default function EventTimeline() {
    return (
        <div className={styles.timeline}>
            {EVENTS.map((event) => (
                <div key={event.id} className={styles.event}>
                    <div className={styles.dateCol}>
                        <span className={styles.date}>{event.date}</span>
                    </div>
                    <div className={styles.markerCol}>
                        <div className={styles.marker}></div>
                        <div className={styles.line}></div>
                    </div>
                    <div className={styles.contentCol}>
                        <h3 className={styles.title}>{event.title}</h3>
                        <p className={styles.location}>{event.location}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
