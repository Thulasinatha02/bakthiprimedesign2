
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  Edit,
  Trash2,
  Plus,
  X,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

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

  // Embed URL
  const embedMatch = url.match(/youtube\.com\/embed\/([^?&#]+)/);
  if (embedMatch) return embedMatch[1];

  // Shorts URL
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&#]+)/);
  if (shortsMatch) return shortsMatch[1];

  // Standard watch URL
  const watchMatch = url.match(/[?&]v=([^&#]+)/);
  if (watchMatch) return watchMatch[1];

  // Short URL: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&#]+)/);
  if (shortMatch) return shortMatch[1];

  // Mobile URL
  const mobileMatch = url.match(/m\.youtube\.com\/watch\?v=([^&#]+)/);
  if (mobileMatch) return mobileMatch[1];

  return '';
};

/** Auto-generate YouTube thumbnail from any YouTube URL */
const getAutoThumbnail = (url: string): string => {
  const videoId = getVideoId(url);
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [description, setDescription] = useState('');

  // Derived: live preview of detected video ID + thumbnail
  const detectedVideoId = useMemo(() => getVideoId(youtubeUrl), [youtubeUrl]);
  const previewThumbnail = useMemo(() => getAutoThumbnail(youtubeUrl), [youtubeUrl]);

  const fetchVideos = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/videos');
      const json = await res.json();

      if (json.success) {
        setVideos(json.data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleEdit = (item: VideoItem) => {
    setEditId(item._id);

    setTitle(item.title);
    setYoutubeUrl(item.youtubeUrl);
    setDescription(item.description);

    setShowForm(true);
  };

  const handleCancel = () => {
    setEditId(null);

    setTitle('');
    setYoutubeUrl('');
    setDescription('');

    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-generate thumbnail from the YouTube URL
    const thumbnail = getAutoThumbnail(youtubeUrl);

    const body = {
      title,
      youtubeUrl,
      description,
      thumbnail,
    };

    try {
      const url = editId
        ? `/api/videos/${editId}`
        : '/api/videos';

      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (json.success) {
        fetchVideos();
        handleCancel();
      } else {
        alert(json.error || 'தோல்வியடைந்தது.');
      }
    } catch (error) {
      alert('இணைப்புப் பிழை.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('இந்த வீடியோவை நீக்க வேண்டுமா?')) {
      return;
    }

    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
      });

      const json = await res.json();

      if (json.success) {
        fetchVideos();
      } else {
        alert(json.error || 'நீக்க முடியவில்லை.');
      }
    } catch (error) {
      alert('இணைப்புப் பிழை.');
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center border-b border-amber-900/30 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-200 tracking-wide">
            பக்தி வீடியோக்கள் மேலாண்மை
          </h1>

          <p className="text-stone-400 text-xs mt-1 font-semibold">
            YouTube லிங்கை மட்டும் ஒட்டவும் — Thumbnail தானாக வரும்.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            புதிய வீடியோ
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-6 border border-yellow-500/20 max-w-2xl"
        >
          <div className="flex justify-between items-center mb-5 border-b border-amber-900/20 pb-3">
            <h2 className="text-lg font-bold text-amber-200">
              {editId
                ? 'வீடியோவைத் தொகுக்கவும்'
                : 'புதிய வீடியோ சேர்க்கவும்'}
            </h2>

            <button
              onClick={handleCancel}
              className="text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* YouTube URL — PRIMARY INPUT */}
            <div>
              <label className="block mb-2 text-xs font-bold text-amber-200 uppercase">
                <LinkIcon className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />
                YouTube வீடியோ லிங்க்
              </label>

              <input
                type="text"
                required
                value={youtubeUrl}
                onChange={(e) =>
                  setYoutubeUrl(e.target.value)
                }
                placeholder="https://www.youtube.com/watch?v=xxxxx  அல்லது  https://youtu.be/xxxxx"
                className="w-full bg-black/40 text-amber-100 px-4 py-3 rounded-xl border border-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              {/* Live URL validation indicator */}
              {youtubeUrl && (
                <div className="flex items-center gap-2 mt-2">
                  {detectedVideoId ? (
                    <span className="text-emerald-400 text-xs flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Video ID கண்டறியப்பட்டது: <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300">{detectedVideoId}</code>
                    </span>
                  ) : (
                    <span className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      சரியான YouTube லிங்கை உள்ளிடவும்
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Auto Thumbnail Preview */}
            {previewThumbnail && (
              <div>
                <label className="block mb-2 text-xs font-bold text-stone-400 uppercase">
                  தானியங்கு Thumbnail முன்னோட்டம்
                </label>
                <div className="relative aspect-video w-full max-w-sm rounded-xl overflow-hidden border border-yellow-500/20 bg-black">
                  <img
                    src={previewThumbnail}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Fallback to medium quality if hqdefault fails
                      if (detectedVideoId && !target.src.includes('mqdefault')) {
                        target.src = `https://img.youtube.com/vi/${detectedVideoId}/mqdefault.jpg`;
                      }
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md">
                    ✓ Auto-fetched
                  </div>
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block mb-2 text-xs font-bold text-amber-200 uppercase">
                வீடியோ தலைப்பு
              </label>

              <input
                type="text"
                required
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="கந்த சஷ்டி கவசம்"
                className="w-full bg-black/40 text-amber-100 px-4 py-3 rounded-xl border border-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Description (optional) */}
            <div>
              <label className="block mb-2 text-xs font-bold text-amber-200 uppercase">
                Description (விருப்பத்தேர்வு)
              </label>

              <textarea
                rows={3}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="வீடியோ விளக்கம்..."
                className="w-full bg-black/40 text-amber-100 px-4 py-3 rounded-xl border border-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl border border-amber-700 text-amber-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!detectedVideoId}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {editId
                  ? 'Update Video'
                  : 'Add Video'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Videos Grid */}
      {loading ? (
        <div className="text-center py-12 text-stone-400 font-bold animate-pulse">
          காணொளிகள் ஏற்றப்படுகின்றன...
        </div>
      ) : videos.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-stone-500">
          காணொளிகள் இல்லை.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {videos.map((video) => {
            const thumb = video.thumbnail || getAutoThumbnail(video.youtubeUrl);

            return (
              <motion.div
                key={video._id}
                className="glass-card rounded-2xl overflow-hidden border border-yellow-500/10"
              >

                {/* Thumbnail */}
                <div className="relative aspect-video bg-black overflow-hidden">

                  <img
                    src={thumb}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const id = getVideoId(video.youtubeUrl);
                      if (id && !target.src.includes('mqdefault')) {
                        target.src = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
                      }
                    }}
                  />

                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Video className="w-10 h-10 text-yellow-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">

                  <h3 className="text-white font-bold text-sm line-clamp-1">
                    {video.title}
                  </h3>

                  <p className="text-stone-400 text-xs line-clamp-2">
                    {video.description ||
                      'விளக்கம் இல்லை'}
                  </p>
                </div>

                {/* Buttons */}
                <div className="px-4 pb-4 flex justify-end gap-2 border-t border-amber-900/20 pt-3">

                  <button
                    onClick={() => handleEdit(video)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(video._id)
                    }
                    className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
