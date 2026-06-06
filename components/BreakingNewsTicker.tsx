'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface NewsItem {
  _id: string;
  title: string;
}

export default function BreakingNewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/news?limit=5');
        const json = await res.json();
        if (json.success) {
          setNews(json.data);
        }
      } catch (error) {
        console.error('Error fetching breaking news:', error);
      }
    }
    fetchNews();
  }, []);

  if (news.length === 0) return null;

  return (
    <div className="bg-amber-100 border-b border-amber-200 text-amber-950 text-xs sm:text-sm h-10 flex items-center shadow-inner overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold px-4 py-2 z-10 shadow-md flex items-center h-full gap-2 shrink-0">
        <span className="animate-pulse w-2 h-2 rounded-full bg-yellow-300"></span>
        <span>{t('முக்கிய செய்திகள்')}</span>
      </div>
      <div className="marquee-container w-full relative h-full flex items-center">
        <div className="marquee-content hover:[animation-play-state:paused] flex items-center gap-12 whitespace-nowrap cursor-pointer">
          {/* Double the list to ensure smooth looping */}
          {[...news, ...news].map((item, index) => (
            <Link 
              key={`${item._id}-${index}`} 
              href={`/news/${item._id}`}
              className="hover:text-red-700 hover:underline font-medium flex items-center gap-2"
            >
              <span>✦</span>
              <span>{t(item.title)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
