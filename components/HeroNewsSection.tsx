'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSlider from './HeroSlider';
import { Calendar, Tag } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  createdAt: string;
}

export default function HeroNewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const categories = [
    { label: t('அனைத்தும்'), value: 'all' },
    { label: t('ஆன்மிகம்'), value: 'Spiritual' },
    { label: t('ஜோதிடம்'), value: 'Astrology' },
    { label: t('பொதுச்செய்தி'), value: 'News' },
    { label: t('விளையாட்டு'), value: 'Sports' },
    { label: t('சினிமா'), value: 'Cinema' }
  ];

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const url = selectedCategory === 'all' 
          ? '/api/news?limit=6' 
          : `/api/news?category=${selectedCategory}&limit=6`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.success) {
          setNews(json.data);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [selectedCategory]);

  return (
    <section className="py-8 bg-amber-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Devotional Slider */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-lg border border-amber-900/10">
            <HeroSlider />
          </div>

          {/* Right Column: Important News Feed with Categories */}
          <div className="lg:col-span-5 space-y-5">
            <div className="border-b border-amber-900/10 pb-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950 font-sans tracking-wide">
                {t('முக்கிய செய்திகள் (Important News)')}
              </h2>
            </div>

            {/* Category Filter Pills - Re-aligned with proper vertical spacing and borders */}
            <div className="flex flex-wrap gap-2 items-center pb-4 border-b border-amber-900/5">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition duration-200 cursor-pointer shadow-sm ${
                    selectedCategory === cat.value
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-white text-stone-600 hover:bg-amber-100 border border-amber-900/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* News Cards List */}
            <div className="space-y-4 min-h-[300px]">
              <AnimatePresence mode="wait">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="flex gap-4 p-3 bg-white rounded-xl border border-stone-100 animate-pulse">
                        <div className="w-24 h-20 bg-stone-200 rounded-lg shrink-0"></div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                          <div className="h-3 bg-stone-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : news.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 border border-stone-100 text-center text-stone-500 text-sm">
                    {t('இந்தப் பிரிவில் தற்சமயம் செய்திகள் ஏதுமில்லை.')}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {news.map((item) => (
                      <Link key={item._id} href={`/news/${item._id}`}>
                        <motion.div
                          whileHover={{ x: 4 }}
                          className="flex gap-4 p-3 bg-white hover:bg-amber-50/35 rounded-xl border border-amber-100/50 hover:border-amber-200 shadow-sm hover:shadow-md transition duration-200 cursor-pointer group mb-3"
                        >
                          {/* Image Thumbnail */}
                          {item.image && (
                            <div className="w-24 h-20 relative overflow-hidden rounded-lg bg-stone-100 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                              />
                            </div>
                          )}

                          {/* Text Info */}
                          <div className="flex flex-col justify-between flex-grow">
                            <h3 className="font-bold text-sm text-stone-800 leading-snug line-clamp-2 group-hover:text-orange-600 transition">
                              {item.title}
                            </h3>
                            
                            <div className="flex items-center gap-3 text-[10px] text-stone-400 font-semibold mt-1">
                              <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                                <Tag className="w-3 h-3" />
                                {item.category === 'Spiritual' ? t('ஆன்மிகம்') : item.category === 'Astrology' ? t('ஜோதிடம்') : item.category}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.createdAt).toLocaleDateString(t('locale') === 'ta_IN' ? 'ta-IN' : 'en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
