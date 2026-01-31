import React from 'react';
import styles from './StatusBadge.module.css';

type Status = 'draft' | 'ai-processed' | 'published' | 'review';

interface StatusBadgeProps {
    status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const getLabel = (s: Status) => {
        switch (s) {
            case 'draft': return 'Raw Draft';
            case 'ai-processed': return 'AI Processed';
            case 'published': return 'Published';
            case 'review': return 'Needs Review';
            default: return s;
        }
    };

    return (
        <span className={`${styles.badge} ${styles[status]}`}>
            {getLabel(status)}
        </span>
    );
}
