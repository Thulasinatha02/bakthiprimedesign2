'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, Award, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { DetailedPageSkeleton } from '@/components/LoadingSkeleton';
import { useLanguage } from '@/context/LanguageContext';

interface FestivalItem {
  _id: string;
  name: string;
  date: string;
  significance: string;
  rituals: string;
  image: string;
  createdAt: string;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function FestivalDetailPage({ params }: Props) {
  const { id } = use(params);
  const [festival, setFestival] = useState<FestivalItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchFestival() {
      try {
        const res = await fetch(`/api/festivals/${id}`);
        const json = await res.json();
        if (json.success) {
          setFestival(json.data);
        }
      } catch (error) {
        console.error('Error fetching festival:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFestival();
  }, [id]);

  if (loading) {
    return <DetailedPageSkeleton />;
  }

  if (!festival) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white rounded-xl shadow border border-stone-200">
        <h2 className="text-xl font-bold text-amber-950 mb-2">{t('பண்டிகை விபரங்கள் காணப்படவில்லை')}</h2>
        <p className="text-sm text-stone-500 mb-4">{t('கோரப்பட்ட திருவிழா விபரங்கள் எதுவும் கிடைக்கவில்லை.')}</p>
        <Link href="/festival" className="text-sm font-bold text-orange-600 hover:underline">
          {t('← திருவிழாக்கள் முகப்புக்குச் செல்லவும்')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
      
      {/* Back button */}
      <Link 
        href="/festival"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-orange-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('விழாக்கள் பட்டியலுக்கு')}</span>
      </Link>

      {/* Main Content Card */}
      <motion.article 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg border border-amber-100 overflow-hidden"
      >
        {/* Cover Image */}
        {festival.image && (
          <div className="relative h-[250px] sm:h-[400px] w-full bg-stone-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={festival.image} 
              alt={t(festival.name)} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 sm:p-10 space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-950 font-sans tracking-wide">
              {t(festival.name)}
            </h1>

            <div className="flex items-center gap-2 text-sm text-amber-950 font-bold bg-amber-50 px-3 py-1.5 rounded-full w-fit">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span>{t('மங்கள நாள் / விரத நாள்')}: {t(festival.date)}</span>
            </div>
          </div>

          {/* Significance */}
          <div className="space-y-3 pt-2">
            <h2 className="text-lg font-bold text-amber-950 border-l-4 border-orange-500 pl-3">
              {t('முக்கியத்துவம் & தல புராணம் (Significance)')}
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line font-normal">
              {t(festival.significance)}
            </p>
          </div>

          {/* Rituals */}
          {festival.rituals && (
            <div className="space-y-3 pt-2">
              <h2 className="text-lg font-bold text-amber-950 border-l-4 border-amber-600 pl-3">
                {t('விரத மற்றும் பூஜை முறைகள் (Rituals & Puja Methods)')}
              </h2>
              <div className="p-5 bg-amber-50/35 border border-amber-100/50 rounded-2xl text-stone-700 text-sm leading-relaxed whitespace-pre-line font-normal">
                {t(festival.rituals)}
              </div>
            </div>
          )}

        </div>
      </motion.article>

    </div>
  );
}
