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
        "about.title": { en: "About Us", ro: "Despre Noi" },
        "about.desc.en": {
            en: "At AIPress, we believe the future shouldn't be cold or intimidating. We are the bridge between complex algorithms and human curiosity.",
            ro: "La AIPress, credem că viitorul nu ar trebui să fie rece sau intimidant. Suntem puntea de legătură între algoritmii complecși și curiozitatea umană."
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
