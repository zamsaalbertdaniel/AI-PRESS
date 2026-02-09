"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "@/app/page.module.css";

export default function HomeHero() {
    const { language } = useLanguage();

    return (
        <header className={styles.hero}>
            <h1 className={styles.heroTitle}>
                {language === "ro" ? "Futurism Cald" : "Warm Futurism"}
                <span className={styles.dot}>.</span>
            </h1>
            <p className={styles.heroSubtitle}>
                {language === "ro"
                    ? "Instrumente pentru Revoluția AI. O platformă de știri neurale de înaltă fidelitate."
                    : "Instrumentation for the AI Revolution. A high-fidelity neural news platform."}
            </p>
            <div className={styles.heroActions}>
                <a className={styles.heroPrimary} href="#pipeline">
                    {language === "ro" ? "Explorează fluxul" : "Explore the pipeline"}
                </a>
                <a className={styles.heroSecondary} href="/articles">
                    {language === "ro" ? "Vezi arhiva" : "View archive"}
                </a>
            </div>
        </header>
    );
}
