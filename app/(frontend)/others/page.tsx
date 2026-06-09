'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Tag } from 'lucide-react';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import { useLanguage } from '@/context/LanguageContext';

interface Article {
  _id: string;
  titleTamil: string;
  titleEnglish: string;
  descriptionTamil: string;
  descriptionEnglish: string;
  category: string;
  image: string;
  youtubeVideoId?: string;
  createdAt: string;
  publishDate?: string;
}

export default function OthersPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch('/api/news');
        const json = await res.json();
        if (json.success) {
          // Filter out Spiritual and Astrology to show general, sports, cinema etc.
          const others = json.data.filter((item: Article) => 
            item.category !== 'Spiritual' && item.category !== 'Astrology'
          );
          setArticles(others);
        }
      } catch (error) {
        console.error('Error fetching general articles:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-amber-900/10 pb-5 mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">
            {t('பொது மற்றும் பொழுதுபோக்கு')}
          </span>
          <h1 className="text-3xl font-extrabold text-amber-950 font-sans tracking-wide">
            {t('ஏனைய செய்திகள் (General News)')}
          </h1>
        </div>
        <p className="text-stone-500 text-sm">{t('விளையாட்டு, சினிமா மற்றும் பொதுவான உலகச் செய்திகள்')}</p>
      </div>

      {/* Grid List */}
      {loading ? (
        <GridSkeleton count={3} />
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center text-stone-500 border border-stone-100 max-w-md mx-auto">
          {t('தற்சமயம் ஏனைய செய்திகள் எதுவும் பதிவிடப்படவில்லை.')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((item) => {
            const title = language === 'ta' ? item.titleTamil : item.titleEnglish;
            const description = language === 'ta' ? item.descriptionTamil : item.descriptionEnglish;
            return (
              <Link key={item._id} href={`/news/${item._id}`}>
                <motion.article
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-sm border border-amber-100/60 overflow-hidden flex flex-col justify-between h-full cursor-pointer group transition-all duration-300 hover:shadow-md"
                >
                  <div>
                    {/* Image */}
                    {item.image && (
                      <div className="relative aspect-video overflow-hidden bg-stone-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-4 left-4 px-2 py-0.5 rounded bg-amber-500 text-amber-950 text-[10px] font-bold uppercase tracking-wider">
                          {t(item.category)}
                        </div>
                      </div>
                    )}

                    {/* Body */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-bold uppercase">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(item.publishDate || item.createdAt).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h2 className="font-extrabold text-amber-950 text-base leading-snug line-clamp-2 group-hover:text-orange-600 transition">
                        {title}
                      </h2>
                      <p className="text-stone-500 text-xs line-clamp-3 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>

                {/* Footer Link */}
                <div className="px-6 pb-6 pt-2 border-t border-stone-50/50 flex justify-between items-center text-xs font-bold text-orange-600">
                  <span>{t('முழு விபரம் வாசிக்க')}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
                </div>
              </motion.article>
            </Link>
          );
        })}
        </div>
      )}
    </div>
  );
}
