"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ro";

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>("en");

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "ro" : "en"));
    };

    // Simple translation dictionary for demo purposes
    // In a real app, this might fetch from a file
    const dictionary: Record<string, Record<Language, string>> = {
        "nav.about": { en: "About Us", ro: "Despre Noi" },
        "nav.events": { en: "Events", ro: "Evenimente" },
        "hero.title": { en: "Warm Futurism", ro: "Futurism Cald" },
        "about.badge": { en: "PRO AI NEWSFEED", ro: "FEED ȘTIRI PRO AI" },
        "about.title": { en: "Deciphering the Artificial Core", ro: "Descifrarea Nucleului Artificial" },
        "about.subtitle": {
            en: "AIPress is a professional AI-native journalistic platform, bridging deep tech research and market impact with clarity and depth.",
            ro: "AIPress este o platformă jurnalistică nativă AI, care îmbină cercetarea tehnologică profundă și impactul în piață cu claritate și profunzime."
        },
        "about.mission.title": { en: "Our Mission", ro: "Misiunea Noastră" },
        "about.mission.p1": {
            en: "In a world flooded with technical noise, we extract the signal. Using high-end neural logic, we scan, distill, and deliver high-impact tech intelligence.",
            ro: "Într-o lume inundată de zgomot tehnic, noi extragem semnalul. Folosind logică neurală avansată, scanăm, distilăm și livrăm inteligență tehnologică de impact."
        },
        "about.mission.p2": {
            en: "We democratize access to deep tech insights by providing simultaneous RO/EN coverage without sacrificing technical complexity.",
            ro: "Democratizăm accesul la informație tehnică profundă prin acoperire simultană RO/EN, fără a sacrifica complexitatea tehnică."
        },
        "about.vision.title": { en: "Warm Futurism Philosophy", ro: "Filozofia Warm Futurism" },
        "about.vision.p1": {
            en: "Technology doesn't have to be cold. Warm Futurism is our design and editorial North Star—humanizing digital complexity with professional empathy.",
            ro: "Tehnologia nu trebuie să fie rece. Warm Futurism este steaua noastră polară de design și editorială — umanizăm complexitatea digitală cu empatie profesională."
        },
        "about.vision.p2": {
            en: "We aren't just a news feed; we are your neural filter, providing the competitive edge required in the AI century.",
            ro: "Nu suntem doar un feed de știri; suntem filtrul tău neural, oferind avantajul competitiv necesar în secolul AI."
        },
        // We can map the specific prompt text
    };

    const t = (key: string) => {
        if (dictionary[key]) {
            return dictionary[key][language];
        }
        return key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
