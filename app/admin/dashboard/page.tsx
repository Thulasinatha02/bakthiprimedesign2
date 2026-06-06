'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Video, Users, MapPin, Calendar, Sparkles, Server, Check } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    news: 0,
    videos: 0,
    astrologers: 0,
    temples: 0,
    festivals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState('');

  const fetchStats = async () => {
    try {
      // Execute parallel calls to fetch quantities
      const [newsRes, videosRes, astroRes, templesRes, festivalsRes] = await Promise.all([
        fetch('/api/news'),
        fetch('/api/videos'),
        fetch('/api/astrologers'),
        fetch('/api/temples'),
        fetch('/api/festivals')
      ]);

      const [news, videos, astro, temples, festivals] = await Promise.all([
        newsRes.json(),
        videosRes.json(),
        astroRes.json(),
        templesRes.json(),
        festivalsRes.json()
      ]);

      setStats({
        news: news.count || 0,
        videos: videos.count || 0,
        astrologers: astro.count || 0,
        temples: temples.count || 0,
        festivals: festivals.count || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedSuccess('');
    try {
      const res = await fetch('/api/seed');
      const json = await res.json();
      if (json.success) {
        setSeedSuccess('தரவுத்தளம் வெற்றிகரமாக சீரமைக்கப்பட்டது!');
        fetchStats();
      } else {
        setSeedSuccess('பிழை: ' + (json.error || 'சீடிங் செய்ய இயலவில்லை.'));
      }
    } catch (err) {
      setSeedSuccess('இணைப்புப் பிழை ஏற்பட்டது.');
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    { name: 'ஆன்மிக செய்திகள் (News)', value: stats.news, icon: Newspaper, color: 'text-orange-400 bg-orange-500/10' },
    { name: 'பக்தி வீடியோக்கள் (Videos)', value: stats.videos, icon: Video, color: 'text-yellow-400 bg-yellow-500/10' },
    { name: 'ராசிபலன்கள் (Horoscopes)', value: 12, icon: Sparkles, color: 'text-amber-400 bg-amber-500/10' },
    { name: 'ஜோதிடர்கள் (Astrologers)', value: stats.astrologers, icon: Users, color: 'text-rose-400 bg-rose-500/10' },
    { name: 'ஆலயங்கள் (Temples)', value: stats.temples, icon: MapPin, color: 'text-teal-400 bg-teal-500/10' },
    { name: 'விழாக்கள் (Festivals)', value: stats.festivals, icon: Calendar, color: 'text-purple-400 bg-purple-500/10' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-amber-900/30 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-200 tracking-wide font-sans gold-glow-text">
            வரவேற்கிறோம், நிருவாகி!
          </h1>
          <p className="text-stone-400 text-xs mt-1 font-semibold">
            பக்தி பிரைம் இணையதளத்தின் உள்ளடக்கங்களை இங்கிருந்து நிர்வகிக்கலாம்.
          </p>
        </div>

        {/* Seeding Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {seedSuccess && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-3.5 py-2 rounded-xl flex items-center gap-1.5 animate-pulse">
              <Check className="w-3.5 h-3.5" />
              {seedSuccess}
            </span>
          )}
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-amber-400 hover:bg-amber-300 text-amber-950 flex items-center justify-center gap-2 border border-amber-300 shadow-md cursor-pointer transition"
          >
            <Server className="w-4 h-4 shrink-0" />
            <span>{seeding ? 'ஏற்றப்படுகிறது...' : 'மாதிரித் தரவுகளைப் பதிவேற்று (Seed DB)'}</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-amber-200/60 uppercase tracking-wider">{card.name}</p>
                  <p className="text-3xl font-extrabold text-white">
                    {loading ? '...' : card.value}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${card.color} shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Admin Information Panel */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-amber-200 flex items-center gap-2 border-b border-amber-900/30 pb-3">
          <span>⚙️</span>
          <span>வலைதள நிர்வாக குறிப்புகள் (Quick Operations Guide)</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-stone-300 leading-relaxed font-semibold">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
            <h3 className="text-amber-400 font-bold">1. மாதிரி தரவுகளைப் பதிவேற்றல்:</h3>
            <p className="text-xs text-stone-400 font-medium">
              இணையதளம் முதன்முதலில் துவங்கப்படும்போது, வலதுபுறம் உள்ள "Seed DB" பொத்தானை அழுத்தி மாதிரித் தரவுகளை (முக்கிய செய்திகள், 12 ராசிபலன்கள், பக்திப் பாடல்கள், கோவில்கள் மற்றும் விழாக்கள்) பதிவேற்றிக் கொள்ளலாம்.
            </p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
            <h3 className="text-amber-400 font-bold">2. CRUD செயல்பாடுகள்:</h3>
            <p className="text-xs text-stone-400 font-medium">
              இடதுபுற மெனுவைப் பயன்படுத்தி செய்திகள், வீடியோக்கள் மற்றும் இதர உள்ளடக்கங்களை சேர்க்கலாம் (Add), தொகுக்கலாம் (Edit) அல்லது நீக்கலாம் (Delete).
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
