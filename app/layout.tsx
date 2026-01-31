import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google"; // Fraunces for that elegant editorial feel
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

export const metadata: Metadata = {
  title: "AIPress | Warm Futurism AI News",
  description: "Bilingual AI News Platform (RO/EN)",
};

import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/layout/Header";
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
          <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
