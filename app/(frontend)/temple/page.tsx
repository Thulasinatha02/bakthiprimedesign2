'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Clock, ChevronRight } from 'lucide-react';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import { useLanguage } from '@/context/LanguageContext';

interface TempleItem {
  _id: string;
  name: string;
  location: string;
  deity: string;
  history: string;
  image: string;
  timings: string;
}

export default function TemplesPage() {
  const [temples, setTemples] = useState<TempleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchTemples() {
      try {
        const res = await fetch('/api/temples');
        const json = await res.json();
        if (json.success) {
          setTemples(json.data);
        }
      } catch (error) {
        console.error('Error fetching temples:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTemples();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-amber-900/10 pb-5 mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">
            {t('புண்ணிய திருத்தலங்கள்')}
          </span>
          <h1 className="text-3xl font-extrabold text-amber-950 font-sans tracking-wide">
            {t('ஆலய வரலாற்றுத் தொகுப்பு (Temple Directory)')}
          </h1>
        </div>
        <p className="text-stone-500 text-sm">{t('ஆலயங்களின் சிறப்புகள், வரலாறு மற்றும் தரிசன நேரங்கள்')}</p>
      </div>

      {/* Grid */}
      {loading ? (
        <GridSkeleton count={3} />
      ) : temples.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center text-stone-500 border border-stone-100 max-w-md mx-auto">
          {t('தற்சமயம் ஆலயங்கள் எதுவும் பதிவிடப்படவில்லை.')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {temples.map((temple) => (
            <Link key={temple._id} href={`/temple/${temple._id}`}>
              <motion.article
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-sm border border-amber-100/60 overflow-hidden flex flex-col justify-between h-full cursor-pointer group transition-all duration-300 hover:shadow-md"
              >
                <div>
                  {/* Image */}
                  {temple.image && (
                    <div className="relative aspect-video overflow-hidden bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={temple.image}
                        alt={t(temple.name)}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-6 space-y-3">
                    <h2 className="font-extrabold text-amber-950 text-base leading-snug group-hover:text-orange-600 transition">
                      {t(temple.name)}
                    </h2>
                    
                    <div className="space-y-1.5 text-xs text-stone-600 font-medium pt-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="line-clamp-1">{t(temple.location)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="line-clamp-1">
                          {temple.timings ? t(temple.timings) : t('நேரம் குறிப்பிடப்படவில்லை')}
                        </span>
                      </div>
                    </div>

                    <p className="text-stone-500 text-xs line-clamp-3 leading-relaxed pt-2">
                      {t(temple.history)}
                    </p>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="px-6 pb-6 pt-2 border-t border-stone-50/50 flex justify-between items-center text-xs font-bold text-orange-600">
                  <span>{t('முழு விபரம் & தல புராணம் வாசிக்க')}</span>
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
