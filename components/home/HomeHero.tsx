"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "@/app/page.module.css";

export default function HomeHero() {
    const { language } = useLanguage();

    return (
        <header className={styles.hero}>
            <span className={styles.heroBadge}>
                {language === "ro" ? "Platformă neurală de știri · RO / EN" : "Neural news platform · RO / EN"}
            </span>
            <h1 className={styles.heroTitle}>
                {language === "ro" ? "Futurism Cald" : "Warm Futurism"}
                <span className={styles.dot}>.</span>
            </h1>
            <p className={styles.heroSubtitle}>
                {language === "ro"
                    ? "Instrumente pentru Revoluția AI. Scanăm, distilăm și livrăm inteligență tehnologică de impact — simultan în română și engleză."
                    : "Instrumentation for the AI Revolution. We scan, distill, and deliver high-impact tech intelligence — simultaneously in English and Romanian."}
            </p>
            <div className={styles.heroActions}>
                <a className={styles.heroPrimary} href="#pipeline">
                    {language === "ro" ? "Explorează fluxul" : "Explore the pipeline"}
                </a>
                <a className={styles.heroSecondary} href="/articles">
                    {language === "ro" ? "Vezi arhiva" : "View archive"}
                </a>
            </div>
            <div className={styles.heroStats}>
                <div className={styles.heroStat}>
                    <span className={styles.heroStatValue}>24/7</span>
                    <span className={styles.heroStatLabel}>{language === "ro" ? "Monitorizare" : "Monitoring"}</span>
                </div>
                <div className={styles.heroStat}>
                    <span className={styles.heroStatValue}>2</span>
                    <span className={styles.heroStatLabel}>{language === "ro" ? "Limbi" : "Languages"}</span>
                </div>
                <div className={styles.heroStat}>
                    <span className={styles.heroStatValue}>AI</span>
                    <span className={styles.heroStatLabel}>{language === "ro" ? "Curat nativ" : "Native curation"}</span>
                </div>
            </div>
        </header>
    );
}
