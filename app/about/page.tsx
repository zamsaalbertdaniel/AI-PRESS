import React from 'react';
import styles from './page.module.css';
import GlassCard from '@/components/ui/GlassCard';

export default function AboutPage() {
    return (
        <div className={styles.about}>
            <div className="container-custom">
                <header className={styles.hero}>
                    <div className={styles.bananaBadge}>🍌 NANO-NATURE TECH</div>
                    <h1 className={styles.title}>Welcome to the Future of Intel</h1>
                    <p className={styles.subtitle}>
                        AIPress is the world's first AI-native, bilingual news platform designed to bridge
                        the gap between the bleeding edge of technology and human understanding.
                    </p>
                </header>

                <div className={styles.visual}>
                    <div className={styles.neuralPulse}></div>
                    <span className={styles.neuralBanana}>🍌</span>
                    <div style={{ position: 'absolute', bottom: '20px', color: 'rgba(255,215,0,0.4)', fontSize: '12px', fontWeight: 600, letterSpacing: '4px' }}>
                        NEURAL INTERFACE ACTIVED
                    </div>
                </div>

                <div className={styles.grid}>
                    <GlassCard className={styles.contentBlock}>
                        <h2>Misiunea Noastră</h2>
                        <p>
                            Într-o lume inundată de zgomot informațional, AIPress extrage esența. Folosim cele mai avansate
                            modele neurale pentru a scana, traduce și analiza cele mai importante știri din tech, AI și robotică.
                        </p>
                        <p>
                            Vrem să democratizăm accesul la informație tehnică de nivel înalt, oferind-o simultan în
                            Română și Engleză, fără a pierde profunzimea analizei.
                        </p>
                    </GlassCard>

                    <GlassCard className={styles.contentBlock}>
                        <h2>Warm Futurism</h2>
                        <p>
                            Filozofia noastră de design și editorială. Credem că viitorul nu trebuie să fie rece sau distant.
                            Prin culori vibrante, estetică organică (Nano Banana) și un ton jurnalistic empatic,
                            humanizăm complexitatea codului.
                        </p>
                        <p>
                            Nu suntem doar un feed de știri; suntem un filtru neural care îți oferă avantajul competitiv
                            de care ai nevoie în secolul AI.
                        </p>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
