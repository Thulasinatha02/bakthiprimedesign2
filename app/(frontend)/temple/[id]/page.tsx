'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, Compass, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DetailedPageSkeleton } from '@/components/LoadingSkeleton';
import { useLanguage } from '@/context/LanguageContext';

interface TempleItem {
  _id: string;
  name: string;
  location: string;
  deity: string;
  history: string;
  image: string;
  timings: string;
  createdAt: string;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function TempleDetailPage({ params }: Props) {
  const { id } = use(params);
  const [temple, setTemple] = useState<TempleItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchTemple() {
      try {
        const res = await fetch(`/api/temples/${id}`);
        const json = await res.json();
        if (json.success) {
          setTemple(json.data);
        }
      } catch (error) {
        console.error('Error fetching temple:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTemple();
  }, [id]);

  if (loading) {
    return <DetailedPageSkeleton />;
  }

  if (!temple) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white rounded-xl shadow border border-stone-200">
        <h2 className="text-xl font-bold text-amber-950 mb-2">{t('தகவல் காணப்படவில்லை')}</h2>
        <p className="text-sm text-stone-500 mb-4">{t('கோரப்பட்ட ஆலயத் தகவல்கள் எதுவும் கிடைக்கவில்லை.')}</p>
        <Link href="/temple" className="text-sm font-bold text-orange-600 hover:underline">
          {t('← ஆலயங்கள் முகப்புக்குச் செல்லவும்')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
      
      {/* Back button */}
      <Link 
        href="/temple"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-orange-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('ஆலயங்கள் பட்டியலுக்கு')}</span>
      </Link>

      {/* Main Content Card */}
      <motion.article 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg border border-amber-100 overflow-hidden"
      >
        {/* Cover Image */}
        {temple.image && (
          <div className="relative h-[250px] sm:h-[400px] w-full bg-stone-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={temple.image} 
              alt={t(temple.name)} 
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 sm:p-10 space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-950 font-sans tracking-wide">
              {t(temple.name)}
            </h1>

            {/* Quick stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-y border-stone-100 py-4 text-xs sm:text-sm font-medium text-stone-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
                <span>{t(temple.location)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-600 shrink-0" />
                <span>{t('மூலவர்')}: {t(temple.deity)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                <span>{temple.timings ? t(temple.timings) : t('நேரம் விபரங்கள் இல்லை')}</span>
              </div>
            </div>
          </div>

          {/* History / Description */}
          <div className="space-y-4 pt-2">
            <h2 className="text-lg font-bold text-amber-950 border-l-4 border-orange-500 pl-3">
              {t('தல வரலாறு மற்றும் ஆன்மிக சிறப்புகள் (History & Importance)')}
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line font-normal">
              {t(temple.history)}
            </p>
          </div>

        </div>
      </motion.article>

    </div>
  );
}
