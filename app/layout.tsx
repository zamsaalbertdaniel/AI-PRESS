import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aipress.business";

export const metadata: Metadata = {
  title: {
    default: "AIPress | AI News · Warm Futurism",
    template: "%s | AIPress",
  },
  description:
    "The first AI-native bilingual news platform (RO/EN). Deep tech, artificial intelligence, and the future — curated through Warm Futurism.",
  keywords: [
    "AI news",
    "artificial intelligence",
    "deep tech",
    "machine learning",
    "neural networks",
    "știri AI",
    "inteligență artificială",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "AIPress | AI News · Warm Futurism",
    description:
      "The first AI-native bilingual news platform. Deep tech, AI, and the future.",
    url: siteUrl,
    siteName: "AIPress",
    locale: "en_US",
    alternateLocale: "ro_RO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIPress | AI News · Warm Futurism",
    description:
      "The first AI-native bilingual news platform. Deep tech, AI, and the future.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProgressBar from "@/components/layout/ProgressBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${fraunces.variable} antialiased`}>
        <LanguageProvider>
          <ProgressBar />
          <Header />
          <main style={{ paddingTop: "80px", minHeight: "100vh" }}>
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

