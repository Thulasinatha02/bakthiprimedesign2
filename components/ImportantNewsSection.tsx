'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Tag, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface NewsItem {
  _id: string;
  titleTamil: string;
  titleEnglish: string;
  descriptionTamil: string;
  descriptionEnglish: string;
  category: string;
  image: string;
  createdAt: string;
  publishDate: string;
}

export default function ImportantNewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  const categories = [
    { label: t('All'), value: 'all' },
    { label: t('Spiritual'), value: 'Spiritual' },
    { label: t('Politics'), value: 'Politics' },
    { label: t('Education'), value: 'Education' },
    { label: t('Sports'), value: 'Sports' },
    { label: t('Technology'), value: 'Technology' },
    { label: t('Cinema'), value: 'Cinema' }
  ];

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        let url = '/api/news?isImportant=true&limit=6';
        if (selectedCategory !== 'all') {
          url += `&category=${selectedCategory}`;
        }
        const res = await fetch(url);
        const json = await res.json();
        if (json.success) {
          setNews(json.data);
        }
      } catch (error) {
        console.error('Error fetching important news:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [selectedCategory]);

  return (
    <section className="py-10 bg-amber-50/15 border-t border-b border-amber-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 border-b border-amber-900/10 pb-4">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">
              {language === 'ta' ? 'முக்கிய அறிவிப்புகள்' : 'Key Highlights'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-sans tracking-wide">
              {t('Important News')}
            </h2>
          </div>
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 items-center mt-4 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition duration-200 cursor-pointer shadow-sm ${
                  selectedCategory === cat.value
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-white text-stone-600 hover:bg-amber-100 border border-amber-900/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="min-h-[250px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex flex-col gap-3 p-4 bg-white rounded-2xl border border-stone-100 animate-pulse">
                    <div className="w-full aspect-video bg-stone-200 rounded-xl"></div>
                    <div className="h-4 bg-stone-200 rounded w-3/4 mt-2"></div>
                    <div className="h-3 bg-stone-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : news.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-stone-100 text-center text-stone-500 text-sm max-w-md mx-auto flex flex-col items-center justify-center space-y-2">
                <AlertCircle className="w-8 h-8 text-stone-300" />
                <p className="font-bold">{language === 'ta' ? 'இந்தப் பிரிவில் தற்சமயம் செய்திகள் ஏதுமில்லை.' : 'No important news in this category at the moment.'}</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {news.map((item) => {
                  const title = language === 'ta' ? item.titleTamil : item.titleEnglish;
                  const description = language === 'ta' ? item.descriptionTamil : item.descriptionEnglish;
                  return (
                    <Link key={item._id} href={`/news/${item._id}`}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-white hover:bg-amber-50/15 rounded-2xl border border-amber-100 hover:border-amber-250 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full group"
                      >
                        {/* Image */}
                        {item.image && (
                          <div className="relative aspect-video w-full overflow-hidden bg-stone-150 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                            <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-amber-500 text-amber-950 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
                              <Tag className="w-3 h-3" />
                              {t(item.category)}
                            </div>
                          </div>
                        )}

                        {/* Text Content */}
                        <div className="p-5 flex flex-col justify-between flex-grow">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-bold">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                {new Date(item.publishDate || item.createdAt).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <h3 className="font-extrabold text-amber-950 text-base leading-snug line-clamp-2 group-hover:text-orange-600 transition duration-200">
                              {title}
                            </h3>
                            <p className="text-stone-500 text-xs line-clamp-3 leading-relaxed font-semibold">
                              {description}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-stone-50 flex items-center text-xs font-bold text-orange-600 group-hover:text-orange-500 transition">
                            {language === 'ta' ? 'மேலும் வாசிக்க →' : 'Read More →'}
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
