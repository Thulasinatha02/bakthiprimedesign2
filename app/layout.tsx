import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bakthi Prime | பக்தி பிரைம் - ஆன்மிக செய்திகள் மற்றும் ஜோதிடம்",
  description: "பக்தி பிரைம் - தமிழ் ஆன்மிக செய்திகள், தினசரி ராசிபலன்கள், ஜோதிட ஆலோசனை, ஆன்மிக பரிகாரங்கள், கோவில் வரலாறுகள் மற்றும் முக்கிய திருவிழாக்கள்.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Bakthi Prime | பக்தி பிரைம்',
    description: 'தமிழ் ஆன்மிக செய்திகள் மற்றும் ஜோதிடம்',
    locale: 'ta_IN',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta" className={`${outfit.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#fdfbf7] text-[#292524]">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
