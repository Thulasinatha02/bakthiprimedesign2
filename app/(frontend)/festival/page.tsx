'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, BookOpen } from 'lucide-react';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import { useLanguage } from '@/context/LanguageContext';

interface FestivalItem {
  _id: string;
  name: string;
  date: string;
  significance: string;
  rituals: string;
  image: string;
}

export default function FestivalsPage() {
  const [festivals, setFestivals] = useState<FestivalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchFestivals() {
      try {
        const res = await fetch('/api/festivals');
        const json = await res.json();
        if (json.success) {
          setFestivals(json.data);
        }
      } catch (error) {
        console.error('Error fetching festivals:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFestivals();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-amber-900/10 pb-5 mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">
            {t('விரதங்களும் விழாக்களும்')}
          </span>
          <h1 className="text-3xl font-extrabold text-amber-950 font-sans tracking-wide">
            {t('முக்கிய திருவிழாக்கள் & மங்கள நாட்கள் (Festivals)')}
          </h1>
        </div>
        <p className="text-stone-500 text-sm">{t('விரத முறைகள், வழிபாட்டு பலன்கள் மற்றும் பண்டிகை விவரங்கள்')}</p>
      </div>

      {/* Grid */}
      {loading ? (
        <GridSkeleton count={3} />
      ) : festivals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center text-stone-500 border border-stone-100 max-w-md mx-auto">
          {t('தற்சமயம் விழாக்கள் எதுவும் பதிவிடப்படவில்லை.')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {festivals.map((festival) => (
            <Link key={festival._id} href={`/festival/${festival._id}`}>
              <motion.article
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-sm border border-amber-100/60 overflow-hidden flex flex-col justify-between h-full cursor-pointer group transition-all duration-300 hover:shadow-md"
              >
                <div>
                  {/* Image */}
                  {festival.image && (
                    <div className="relative aspect-video overflow-hidden bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={festival.image}
                        alt={t(festival.name)}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-6 space-y-3">
                    <h2 className="font-extrabold text-amber-950 text-base leading-snug group-hover:text-orange-600 transition">
                      {t(festival.name)}
                    </h2>
                    
                    <div className="flex items-center gap-1.5 text-xs text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-full w-fit">
                      <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{t(festival.date)}</span>
                    </div>

                    <p className="text-stone-500 text-xs line-clamp-3 leading-relaxed pt-2">
                      {t(festival.significance)}
                    </p>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="px-6 pb-6 pt-2 border-t border-stone-50/50 flex justify-between items-center text-xs font-bold text-orange-600">
                  <span>{t('முழு விபரம் & பூஜை முறைகள்')}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
