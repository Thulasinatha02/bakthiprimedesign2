'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import { DetailedPageSkeleton } from '@/components/LoadingSkeleton';
import { useLanguage } from '@/context/LanguageContext';

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  createdAt: string;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function NewsDetailPage({ params }: Props) {
  const { id } = use(params);
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(`/api/news/${id}`);
        const json = await res.json();
        if (json.success) {
          setNews(json.data);
        }
      } catch (error) {
        console.error('Error fetching news article:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [id]);

  if (loading) {
    return <DetailedPageSkeleton />;
  }

  if (!news) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white rounded-xl shadow border border-stone-200">
        <h2 className="text-xl font-bold text-amber-950 mb-2">{t('செய்தி காணப்படவில்லை')}</h2>
        <p className="text-sm text-stone-500 mb-4">{t('கோரப்பட்ட செய்தித் தொகுப்பு எதுவும் கிடைக்கவில்லை.')}</p>
        <Link href="/" className="text-sm font-bold text-orange-600 hover:underline">
          {t('← முகப்புக்குச் செல்லவும்')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
      
      {/* Back link */}
      <Link 
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-orange-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('முகப்புப் பக்கத்திற்கு')}</span>
      </Link>

      {/* Main Content Card */}
      <motion.article 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg border border-amber-100 overflow-hidden"
      >
        {/* Cover Image */}
        {news.image && (
          <div className="relative h-[250px] sm:h-[400px] w-full bg-stone-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={news.image} 
              alt={t(news.title)} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 sm:p-10 space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-sans tracking-wide leading-snug">
              {t(news.title)}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-500">
              <span className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
                <Tag className="w-3.5 h-3.5" />
                {t(news.category === 'Spiritual' ? 'ஆன்மிகம்' : news.category === 'Astrology' ? 'ஜோதிடம்' : news.category)}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>
                  {new Date(news.createdAt).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </span>
            </div>
          </div>

          {/* Full content */}
          <div className="border-t border-stone-100 pt-6">
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
              {t(news.content)}
            </p>
          </div>

        </div>
      </motion.article>

    </div>
  );
}
