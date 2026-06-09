'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Tag, Search, AlertCircle, Play } from 'lucide-react';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import { useLanguage } from '@/context/LanguageContext';

interface NewsItem {
  _id: string;
  titleTamil: string;
  titleEnglish: string;
  descriptionTamil: string;
  descriptionEnglish: string;
  category: string;
  image: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  createdAt: string;
  publishDate: string;
}

function NewsListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialHasVideo = searchParams.get('hasVideo') === 'true';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [hasVideo, setHasVideo] = useState(initialHasVideo);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { label: t('All'), value: 'all' },
    { label: t('Spiritual'), value: 'Spiritual' },
    { label: t('Politics'), value: 'Politics' },
    { label: t('Education'), value: 'Education' },
    { label: t('Sports'), value: 'Sports' },
    { label: t('Technology'), value: 'Technology' },
    { label: t('Cinema'), value: 'Cinema' }
  ];

  const fetchNews = async () => {
    setLoading(true);
    try {
      let url = '/api/news?';
      if (selectedCategory !== 'all') {
        url += `category=${selectedCategory}&`;
      }
      if (searchQuery.trim()) {
        url += `search=${encodeURIComponent(searchQuery.trim())}&`;
      }
      if (hasVideo) {
        url += 'hasVideo=true&';
      }
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
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, searchQuery, hasVideo]);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'all');
    setHasVideo(searchParams.get('hasVideo') === 'true');
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = `/news?search=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`;
    if (hasVideo) {
      url += '&hasVideo=true';
    }
    router.push(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Header and Search Aligned */}
      <div className="border-b border-amber-900/10 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">
            {t('செய்தித் தொகுப்பு')}
          </span>
          <h1 className="text-3xl font-extrabold text-amber-950 font-sans tracking-wide">
            {language === 'ta' ? 'தமிழ் & ஆங்கில செய்திகள்' : 'Bakthi Prime News Feed'}
          </h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder={t('தேடுக...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-stone-800 placeholder-stone-400 pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm text-sm font-semibold"
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
        </form>
      </div>

      {/* Filter and Categories Aligned */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-50/30 p-4 rounded-2xl border border-amber-100/50">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">{language === 'ta' ? 'வடிகட்டு:' : 'Filter:'}</span>
          
          {/* Has Video Filter Checkbox */}
          <label className="flex items-center gap-2 text-xs font-bold text-stone-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasVideo}
              onChange={(e) => setHasVideo(e.target.checked)}
              className="w-4 h-4 accent-amber-600"
            />
            <span>{language === 'ta' ? 'வீடியோ செய்திகள் மட்டும்' : 'Video news only'}</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
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
      </div>

      {/* Grid List */}
      {loading ? (
        <GridSkeleton count={6} />
      ) : news.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center text-stone-400 border border-stone-100 max-w-md mx-auto flex flex-col items-center justify-center space-y-3">
          <AlertCircle className="w-8 h-8 text-stone-300 animate-bounce" />
          <p className="font-bold text-stone-500">{t('செய்திகள் எதுவும் கிடைக்கவில்லை.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => {
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
                        <img
                          src={item.image}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-4 left-4 px-2 py-0.5 rounded bg-amber-500 text-amber-950 text-[10px] font-bold uppercase tracking-wider shadow">
                          {t(item.category)}
                        </div>
                        {item.youtubeVideoId && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-red-650 text-white flex items-center justify-center shadow">
                              <Play className="w-4 h-4 fill-current translate-x-0.5" />
                            </div>
                          </div>
                        )}
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
                      <p className="text-stone-500 text-xs line-clamp-3 leading-relaxed font-semibold">
                        {description}
                      </p>
                    </div>
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

export default function NewsPage() {
  return (
    <Suspense fallback={<GridSkeleton count={3} />}>
      <NewsListContent />
    </Suspense>
  );
}
