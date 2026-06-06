'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const rasis = [
  { name: 'மேஷம்', key: 'aries', symbol: '♈', subtitle: 'Aries', color: 'from-red-500 to-orange-500' },
  { name: 'ரிஷபம்', key: 'taurus', symbol: '♉', subtitle: 'Taurus', color: 'from-orange-500 to-amber-500' },
  { name: 'மிதுனம்', key: 'gemini', symbol: '♊', subtitle: 'Gemini', color: 'from-amber-500 to-yellow-500' },
  { name: 'கடகம்', key: 'cancer', symbol: '♋', subtitle: 'Cancer', color: 'from-teal-500 to-emerald-500' },
  { name: 'சிம்மம்', key: 'leo', symbol: '♌', subtitle: 'Leo', color: 'from-red-600 to-yellow-600' },
  { name: 'கன்னி', key: 'virgo', symbol: '♍', subtitle: 'Virgo', color: 'from-rose-500 to-amber-500' },
  { name: 'துலாம்', key: 'libra', symbol: '♎', subtitle: 'Libra', color: 'from-amber-500 to-teal-500' },
  { name: 'விருச்சிகம்', key: 'scorpio', symbol: '♏', subtitle: 'Scorpio', color: 'from-red-700 to-rose-700' },
  { name: 'தனுசு', key: 'sagittarius', symbol: '♐', subtitle: 'Sagittarius', color: 'from-indigo-500 to-purple-500' },
  { name: 'மகரம்', key: 'capricorn', symbol: '♑', subtitle: 'Capricorn', color: 'from-stone-600 to-amber-900' },
  { name: 'கும்பம்', key: 'aquarius', symbol: '♒', subtitle: 'Aquarius', color: 'from-sky-500 to-indigo-500' },
  { name: 'மீனம்', key: 'pisces', symbol: '♓', subtitle: 'Pisces', color: 'from-blue-500 to-teal-500' }
];

export default function RasiGrid() {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">
            {t('ராசி பலன்கள்')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-sans tracking-wide">
            {t('இன்றைய 12 ராசிபலன்கள் (Daily Horoscope)')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* 12 Rasis Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {rasis.map((rasi, index) => (
            <Link key={rasi.key} href={`/rasipalan/daily?rasi=${rasi.key}`}>
              <motion.div
                whileHover={{ scale: 1.04, y: -4 }}
                transition={{ duration: 0.2 }}
                className="relative bg-gradient-to-b from-amber-50/50 to-white hover:from-amber-50 border border-amber-100 hover:border-amber-300 rounded-2xl p-5 text-center flex flex-col items-center justify-between cursor-pointer group shadow-sm hover:shadow-md h-[180px]"
              >
                {/* Zodiac Image Container */}
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-200 shadow-md group-hover:rotate-12 transition duration-300 relative bg-amber-50">
                  <img
                    src={`/images/${index + 1}.jpg`}
                    alt={t(rasi.name)}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Names */}
                <div className="mt-3">
                  <h3 className="font-extrabold text-amber-950 text-base group-hover:text-orange-600 transition duration-200">
                    {t(rasi.name)}
                  </h3>
                  <p className="text-stone-400 text-[10px] tracking-wide uppercase font-semibold">
                    {rasi.subtitle}
                  </p>
                </div>

                {/* Preview CTA */}
                <span className="text-[10px] font-bold text-orange-600 group-hover:text-orange-500 transition flex items-center gap-1 mt-2">
                  {t('பலன்கள் காண்க →')}
                </span>
                
                {/* Number Badge */}
                <div className="absolute top-2 right-3 text-[9px] font-bold text-amber-900/20">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
