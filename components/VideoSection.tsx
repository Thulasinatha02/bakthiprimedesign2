'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface VideoItem {
  _id: string;
  title: string;
  youtubeUrl: string;
  description: string;
  thumbnail: string;
}

export default function VideoSection() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch('/api/videos?limit=6');
        const json = await res.json();
        if (json.success) {
          setVideos(json.data);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    }
    fetchVideos();
  }, []);

  if (videos.length === 0) return null;

  return (
    <section className="py-12 bg-stone-50 border-t border-b border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-amber-900/10 pb-4">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">
              பக்தி கானங்கள்
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-sans tracking-wide">
              பக்தி வீடியோக்கள் (Devotional Videos)
            </h2>
          </div>
          <p className="text-stone-500 text-sm mt-2 md:mt-0">
            இணையதளத்திலேயே நேரடியாக கண்டுகளியுங்கள்
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <motion.div
              key={video._id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100/60 flex flex-col h-full group transition-all duration-300"
            >
              {/* Media Player Container */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                {activeVideoId === video._id ? (
                  <iframe
                    src={`${video.youtubeUrl}?autoplay=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                ) : (
                  <div 
                    onClick={() => setActiveVideoId(video._id)}
                    className="relative w-full h-full cursor-pointer flex items-center justify-center group"
                  >
                    {/* Thumbnail */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeUrl.split('/').pop()}/0.jpg`}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500 brightness-90"
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition duration-300"></div>

                    {/* Glowing Play Button */}
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className="relative z-10 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg border border-amber-300/40 text-white"
                    >
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Text Area */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-amber-950 text-base line-clamp-1 group-hover:text-orange-600 transition duration-200">
                    {video.title}
                  </h3>
                  <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
                    {video.description || 'தெய்வீக அருள் வழங்கும் பக்தி பாடல் தொகுப்பு.'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
