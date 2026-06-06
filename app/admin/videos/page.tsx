'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Edit, Trash2, Plus, X, Link as LinkIcon } from 'lucide-react';

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
    const body = { title, youtubeUrl, description, thumbnail };

    try {
      const url = editId ? `/api/videos/${editId}` : '/api/videos';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
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
    if (!confirm('இந்த வீடியோவை நீக்க வேண்டுமா?')) return;

    try {
      const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-200 tracking-wide font-sans gold-glow-text">
            பக்தி வீடியோக்கள் மேலாண்மை (Video CRUD)
          </h1>
          <p className="text-stone-400 text-xs mt-1 font-semibold">
            YouTube ஆன்மிகக் காணொளிகளை இங்கு பதிவேற்றி நிர்வகிக்கவும்.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>புதிய வீடியோ சேர்</span>
          </button>
        )}
      </div>

      {/* Input Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-6 border border-yellow-500/20 max-w-2xl"
        >
          <div className="flex justify-between items-center border-b border-amber-900/20 pb-3 mb-5">
            <h2 className="text-lg font-bold text-amber-200">
              {editId ? 'வீடியோவைத் தொகுக்கவும்' : 'புதிய வீடியோ சேர்க்கவும்'}
            </h2>
            <button onClick={handleCancel} className="text-stone-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-amber-200">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider">வீடியோ தலைப்பு (Title)</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="எ.கா: கந்த சஷ்டி கவசம் வரிகளுடன்"
                className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Link & Thumbnail Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">YouTube Embed Link</label>
                <input
                  type="text"
                  required
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/XXXXXX"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">முகப்பு படம் URL (Thumbnail Link)</label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://img.youtube.com/vi/XXXXXX/0.jpg"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider">சிறுகுறிப்பு (Description)</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="காணொளியின் விளக்கத்தை இங்கு எழுதவும்..."
                className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-xs"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2.5 rounded-xl border border-amber-900/30 hover:bg-white/5 text-amber-100 cursor-pointer"
              >
                ரத்து செய்க (Cancel)
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 cursor-pointer shadow-md font-extrabold"
              >
                {editId ? 'இலக்கு புதுப்பி' : 'வீடியோவைச் சேர்'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Videos List */}
      {loading ? (
        <div className="text-center py-12 text-stone-400 font-bold animate-pulse text-sm">
          காணொளிகள் ஏற்றப்படுகின்றன...
        </div>
      ) : videos.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-stone-500 text-sm max-w-md">
          காணொளிகள் எதுவும் பதிவிடப்படவில்லை. புதிய வீடியோ சேர்க்கவும்.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <motion.div
              key={video._id}
              className="glass-card rounded-2xl overflow-hidden border border-yellow-500/10 hover:border-yellow-500/20 flex flex-col justify-between"
            >
              {/* Thumbnail preview */}
              <div className="relative aspect-video w-full bg-stone-900 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeUrl.split('/').pop()}/0.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Video className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              {/* Title & Desc */}
              <div className="p-4 space-y-2">
                <h3 className="text-white font-bold text-sm line-clamp-1">{video.title}</h3>
                <p className="text-stone-400 text-xs line-clamp-2 leading-relaxed font-semibold">
                  {video.description || 'விளக்கம் ஏதுமில்லை.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="px-4 pb-4 flex justify-end gap-2 border-t border-amber-900/20 pt-3">
                <button
                  onClick={() => handleEdit(video)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-200 transition cursor-pointer"
                  title="தொகு"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(video._id)}
                  className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400 transition cursor-pointer"
                  title="நீக்கு"
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
