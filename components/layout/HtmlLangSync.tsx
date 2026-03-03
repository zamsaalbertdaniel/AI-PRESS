"use client";

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Updates the <html lang="..."> attribute when the user toggles RO/EN.
 * Renders nothing — purely a side-effect component.
 */
export default function HtmlLangSync() {
    const { language } = useLanguage();

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    return null;
}
