
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  Edit,
  Trash2,
  Plus,
  X,
} from 'lucide-react';

interface VideoItem {
  _id: string;
  title: string;
  youtubeUrl: string;
  description: string;
  thumbnail: string;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  // Extract YouTube Video ID
  const getVideoId = (url: string) => {
    if (!url) return '';

    // Handle embed URL
    if (url.includes('/embed/')) {
      return url.split('/embed/')[1]?.split('?')[0];
    }

    // Handle watch URL
    if (url.includes('v=')) {
      return url.split('v=')[1]?.split('&')[0];
    }

    return '';
  };

  // Generate Thumbnail
  const getThumbnail = (url: string) => {
    const videoId = getVideoId(url);

    if (!videoId) {
      return '/placeholder.jpg';
    }

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

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
    setThumbnail(item.thumbnail);

    setShowForm(true);
  };

  const handleCancel = () => {
    setEditId(null);

    setTitle('');
    setYoutubeUrl('');
    setDescription('');
    setThumbnail('');

    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
            YouTube ஆன்மிக வீடியோக்களை நிர்வகிக்கவும்.
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

            {/* YouTube URL */}
            <div>
              <label className="block mb-2 text-xs font-bold text-amber-200 uppercase">
                YouTube Embed URL
              </label>

              <input
                type="text"
                required
                value={youtubeUrl}
                onChange={(e) =>
                  setYoutubeUrl(e.target.value)
                }
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                className="w-full bg-black/40 text-amber-100 px-4 py-3 rounded-xl border border-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block mb-2 text-xs font-bold text-amber-200 uppercase">
                Thumbnail URL
              </label>

              <input
                type="text"
                value={thumbnail}
                onChange={(e) =>
                  setThumbnail(e.target.value)
                }
                placeholder="Optional"
                className="w-full bg-black/40 text-amber-100 px-4 py-3 rounded-xl border border-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-xs font-bold text-amber-200 uppercase">
                Description
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
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold"
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

          {videos.map((video) => (
            <motion.div
              key={video._id}
              className="glass-card rounded-2xl overflow-hidden border border-yellow-500/10"
            >

              {/* Thumbnail */}
              <div className="relative aspect-video bg-black overflow-hidden">

                <img
                  src={
                    video.thumbnail ||
                    getThumbnail(video.youtubeUrl)
                  }
                  alt={video.title}
                  className="w-full h-full object-cover"
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
          ))}
        </div>
      )}
    </div>
  );
}

