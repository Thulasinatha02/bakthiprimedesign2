'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-b from-amber-950 to-stone-950 text-stone-200 border-t border-amber-800/40">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* About Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 overflow-hidden rounded-full border border-amber-700/50 shadow-md bg-amber-950">
                <img
                  src="/images/logo.jpg"
                  alt="Bakthi Prime Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-extrabold text-xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-amber-100 to-yellow-300">
                Bakthi Prime
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              {t('பக்தி பிரைம் தமிழ் ஆன்மிக செய்தி தளம். தினசரி ராசிபலன்கள், ஜோதிட பலன்கள், திருமணப் பொருத்தம், கோவில் தல வரலாற்று விவரங்கள் மற்றும் முக்கிய விழாக்களைத் உடனுக்குடன் வழங்கும் ஆன்மிகத் துணையாகச் செயல்படுகிறது.')}
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-4">{t('உள்ளடக்கங்கள்')}</h3>
            <ul className="space-y-2 text-sm text-stone-400 font-semibold">
              <li>
                <Link href="/" className="hover:text-amber-300 transition duration-150">{t('முகப்பு')} (Home)</Link>
              </li>
              <li>
                <Link href="/astrologers" className="hover:text-amber-300 transition duration-150">{t('ஜோதிடர்கள்')} (Astrologers)</Link>
              </li>
              <li>
                <Link href="/porutham" className="hover:text-amber-300 transition duration-150">{t('திருமணப் பொருத்தம்')}</Link>
              </li>
              <li>
                <Link href="/temple" className="hover:text-amber-300 transition duration-150">{t('கோவில்')} (Temples)</Link>
              </li>
              <li>
                <Link href="/festival" className="hover:text-amber-300 transition duration-150">{t('திருவிழா')} (Festivals)</Link>
              </li>
            </ul>
          </div>

          {/* Rasi Palan Links Column */}
          <div>
            <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-4">{t('ராசிபலன்')}</h3>
            <ul className="space-y-2 text-sm text-stone-400 font-semibold">
              <li>
                <Link href="/rasipalan/daily" className="hover:text-amber-300 transition duration-150">{t('தினசரி ராசிபலன்')}</Link>
              </li>
              <li>
                <Link href="/rasipalan/weekly" className="hover:text-amber-300 transition duration-150">{t('வாராந்திர ராசிபலன்')}</Link>
              </li>
              <li>
                <Link href="/rasipalan/monthly" className="hover:text-amber-300 transition duration-150">{t('மாதாந்திர ராசிபலன்')}</Link>
              </li>
              <li>
                <Link href="/rasipalan/peyarchi/guru" className="hover:text-amber-300 transition duration-150">{t('குரு பெயர்ச்சி')}</Link>
              </li>
              <li>
                <Link href="/rasipalan/peyarchi/sani" className="hover:text-amber-300 transition duration-150">{t('சனி பெயர்ச்சி')}</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Subamuhurtham */}
          <div>
            <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-4">{t('சுப நாட்கள் & ஏனையவை')}</h3>
            <ul className="space-y-2 text-sm text-stone-400 font-semibold">
              <li>
                <Link href="/rasipalan/subamuhurtha-natkal" className="hover:text-amber-300 transition duration-150">{t('சுபமுகூர்த்த நாட்கள்')}</Link>
              </li>
              <li>
                <Link href="/rasipalan/puthandu/tamil" className="hover:text-amber-300 transition duration-150">{t('தமிழ்ப் புத்தாண்டு')}</Link>
              </li>
              <li>
                <Link href="/spiritual" className="hover:text-amber-300 transition duration-150">{t('ஆன்மிகம்')} (Spiritual)</Link>
              </li>
              <li>
                <Link href="/astrology" className="hover:text-amber-300 transition duration-150">{t('ஜோதிடம்')} (Astrology)</Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-amber-900/60 mt-12 pt-8 text-center text-xs text-stone-500 font-bold">
          <p>© {new Date().getFullYear()} Bakthi Prime. All rights reserved. {t('வடிவமைக்கப்பட்டது பக்தி பிரைம் குழுவினரால்.')}</p>
        </div>
      </div>
    </footer>
  );
}
