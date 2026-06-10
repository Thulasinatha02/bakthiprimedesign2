'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';

interface VideoItem {
  _id: string;
  title: string;
  youtubeUrl: string;
  description: string;
  thumbnail: string;
}

/**
 * Extracts a YouTube video ID from ANY valid YouTube URL format:
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://youtu.be/VIDEO_ID
 *  - https://m.youtube.com/watch?v=VIDEO_ID
 *  - https://www.youtube.com/embed/VIDEO_ID
 *  - https://youtube.com/shorts/VIDEO_ID
 */
const getVideoId = (url: string): string => {
  if (!url) return '';

  const embedMatch = url.match(/youtube\.com\/embed\/([^?&#]+)/);
  if (embedMatch) return embedMatch[1];

  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&#]+)/);
  if (shortsMatch) return shortsMatch[1];

  const watchMatch = url.match(/[?&]v=([^&#]+)/);
  if (watchMatch) return watchMatch[1];

  const shortMatch = url.match(/youtu\.be\/([^?&#]+)/);
  if (shortMatch) return shortMatch[1];

  const mobileMatch = url.match(/m\.youtube\.com\/watch\?v=([^&#]+)/);
  if (mobileMatch) return mobileMatch[1];

  return '';
};

/**
 * Builds a proper YouTube embed URL with privacy-enhanced mode
 * for reliable inline playback.
 */
const getEmbedUrl = (url: string): string => {
  const id = getVideoId(url);
  if (!id) return '';
  // Use youtube-nocookie.com for better privacy & fewer blocked embeds
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
};

/** Auto-generate thumbnail from any YouTube URL */
const getThumbnail = (url: string, fallback: string): string => {
  const id = getVideoId(url);
  if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  return fallback || '';
};

/** Build a standard watch URL for "open in YouTube" */
const getWatchUrl = (url: string): string => {
  const id = getVideoId(url);
  return id ? `https://www.youtube.com/watch?v=${id}` : url;
};

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
          {videos.map((video) => {
            const embedUrl = getEmbedUrl(video.youtubeUrl);
            const thumbnail = getThumbnail(video.youtubeUrl, video.thumbnail);
            const watchUrl = getWatchUrl(video.youtubeUrl);
            const isActive = activeVideoId === video._id;

            return (
              <motion.div
                key={video._id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100/60 flex flex-col h-full group transition-all duration-300"
              >
                {/* Media Player Container */}
                <div className="relative aspect-video w-full bg-black overflow-hidden">
                  {isActive && embedUrl ? (
                    <iframe
                      src={`${embedUrl}&autoplay=1`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      loading="lazy"
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      {/* Thumbnail */}
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500 brightness-90"
                          onError={(e) => {
                            // Fallback to lower quality if hqdefault fails
                            const target = e.target as HTMLImageElement;
                            const id = getVideoId(video.youtubeUrl);
                            if (id && !target.src.includes('mqdefault')) {
                              target.src = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
                            }
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-amber-950 to-black flex items-center justify-center">
                          <span className="text-amber-400/40 text-sm">No Preview</span>
                        </div>
                      )}

                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition duration-300" />

                      {/* Play button — opens embed inline */}
                      <button
                        onClick={() => setActiveVideoId(video._id)}
                        className="absolute inset-0 w-full h-full flex items-center justify-center z-10 cursor-pointer"
                        aria-label={`Play ${video.title}`}
                      >
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg border border-amber-300/40 text-white"
                        >
                          <Play className="w-6 h-6 fill-current translate-x-0.5" />
                        </motion.div>
                      </button>

                      {/* Open in YouTube button */}
                      <a
                        href={watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-2 right-2 z-20 flex items-center gap-1 px-2 py-1 bg-black/70 hover:bg-red-600 text-white text-[10px] font-semibold rounded-md transition duration-200"
                      >
                        <ExternalLink className="w-3 h-3" />
                        YouTube
                      </a>
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
            );
          })}
        </div>
      </div>
    </section>
  );
}