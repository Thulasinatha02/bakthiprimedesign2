'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Play, Tag, Video } from 'lucide-react';
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

interface Props {
  category: 'Sports' | 'Politics' | 'Education' | 'Spiritual' | 'Videos';
}

export default function CategoryNewsSection({ category }: Props) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    async function fetchCategoryNews() {
      try {
        let url = '';
        if (category === 'Videos') {
          url = '/api/news?hasVideo=true&limit=4';
        } else {
          url = `/api/news?category=${category}&limit=4`;
        }
        const res = await fetch(url);
        const json = await res.json();
        if (json.success) {
          setNews(json.data);
        }
      } catch (error) {
        console.error(`Error fetching category news for ${category}:`, error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryNews();
  }, [category]);

  if (loading) {
    return (
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-6 w-48 bg-stone-200 rounded mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex flex-col gap-3 p-3 bg-white rounded-2xl border border-stone-100 animate-pulse">
              <div className="w-full aspect-video bg-stone-200 rounded-xl"></div>
              <div className="h-4 bg-stone-200 rounded w-3/4"></div>
              <div className="h-3 bg-stone-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  // Determine localized section title
  const getSectionTitle = () => {
    if (category === 'Videos') return t('YouTube News Videos');
    return t(`${category} செய்திகள்`);
  };

  const getSectionSubtitle = () => {
    if (category === 'Videos') return language === 'ta' ? 'வலைதளத்திலேயே நேரடியாக காணொளிகளைக் காணுங்கள்' : 'Watch news videos directly on our website';
    if (category === 'Spiritual') return language === 'ta' ? 'ஆன்மீக சிந்தனைகள் மற்றும் தெய்வீகக் கட்டுரைகள்' : 'Spiritual thoughts and divine articles';
    if (category === 'Sports') return language === 'ta' ? 'விளையாட்டு உலக நடப்புகள் மற்றும் சாதனைகள்' : 'Sports world happenings and achievements';
    if (category === 'Politics') return language === 'ta' ? 'அரசியல் மேடை நிகழ்வுகள் மற்றும் முக்கியச் செய்திகள்' : 'Political stage updates and key headlines';
    if (category === 'Education') return language === 'ta' ? 'கல்வி மற்றும் வேலைவாய்ப்புச் செய்திகள்' : 'Educational updates and career news';
    return '';
  };

  return (
    <section className="py-8 bg-white border-b border-amber-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-6 border-l-4 border-amber-600 pl-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950 font-sans tracking-wide">
              {getSectionTitle()}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5 font-semibold">
              {getSectionSubtitle()}
            </p>
          </div>
          <Link
            href={category === 'Videos' ? '/news?hasVideo=true' : `/news?category=${category}`}
            className="text-xs font-bold text-orange-650 hover:text-orange-500 transition flex items-center gap-0.5 shrink-0 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 hover:border-amber-250 shadow-sm"
          >
            <span>{t('View All')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((item) => {
            const title = language === 'ta' ? item.titleTamil : item.titleEnglish;
            const description = language === 'ta' ? item.descriptionTamil : item.descriptionEnglish;
            return (
              <Link key={item._id} href={`/news/${item._id}`}>
                <motion.article
                  whileHover={{ y: -4 }}
                  className="bg-gradient-to-b from-amber-50/10 to-white hover:from-amber-50/30 rounded-2xl border border-amber-100 hover:border-amber-250 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full group"
                >
                  {/* Thumbnail / Image */}
                  {item.image && (
                    <div className="relative aspect-video w-full overflow-hidden bg-stone-100 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      
                      {/* Video Play Overlay */}
                      {item.youtubeVideoId ? (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/45 transition">
                          <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg border border-red-500/30 group-hover:scale-110 transition duration-300">
                            <Play className="w-4.5 h-4.5 fill-current translate-x-0.5" />
                          </div>
                        </div>
                      ) : (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-500 text-amber-950 text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 shadow">
                          <Tag className="w-2.5 h-2.5" />
                          {t(item.category)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[9px] text-stone-400 font-bold uppercase">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(item.publishDate || item.createdAt).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-amber-950 text-sm leading-snug line-clamp-2 group-hover:text-orange-600 transition duration-200">
                        {title}
                      </h3>
                      <p className="text-stone-500 text-[11px] line-clamp-3 leading-relaxed font-semibold">
                        {description}
                      </p>
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-stone-50 flex justify-between items-center text-[10px] font-bold text-orange-600 group-hover:text-orange-500 transition">
                      <span className="flex items-center gap-0.5">
                        {item.youtubeVideoId && <Video className="w-3 h-3 text-red-500 mr-0.5" />}
                        {language === 'ta' ? 'மேலும் வாசிக்க' : 'Read More'}
                      </span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                </motion.article>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
