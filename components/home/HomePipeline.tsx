"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import SmartTabs from "@/components/home/SmartTabs";
import BentoGrid from "@/components/home/BentoGrid";
import styles from "@/app/page.module.css";

export default function HomePipeline() {
    const { language } = useLanguage();

    return (
        <section className={styles.contentSection} id="pipeline">
            <div className={styles.contentHeader}>
                <h2 className={styles.sectionTitle}>Neural Pipeline</h2>
                <div className={styles.tabsWrapper}>
                    <SmartTabs />
                </div>
            </div>
            <BentoGrid language={language} />
        </section>
    );
}
