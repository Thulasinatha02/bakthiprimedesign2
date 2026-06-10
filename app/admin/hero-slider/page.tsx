'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Image as ImageIcon,
  Edit,
  Trash2,
  Plus,
  X,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  GripVertical,
  Eye,
  EyeOff,
} from 'lucide-react';

interface HeroSlideItem {
  _id: string;
  title: string;
  description: string;
  badge: string;
  image: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
}

const getVideoId = (url: string): string => {
  if (!url) return '';
  const embedMatch = url.match(/youtube\.com\/embed\/([^?&#]+)/);
  if (embedMatch) return embedMatch[1];
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&#]+)/);
  if (shortsMatch) return shortsMatch[1];
  const liveMatch = url.match(/youtube\.com\/live\/([^?&#]+)/);
  if (liveMatch) return liveMatch[1];
  const watchMatch = url.match(/[?&]v=([^&#]+)/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = url.match(/youtu\.be\/([^?&#]+)/);
  if (shortMatch) return shortMatch[1];
  const mobileMatch = url.match(/m\.youtube\.com\/watch\?v=([^&#]+)/);
  if (mobileMatch) return mobileMatch[1];
  return '';
};

const getAutoThumbnail = (url: string): string => {
  const videoId = getVideoId(url);
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export default function AdminHeroSliderPage() {
  const [slides, setSlides] = useState<HeroSlideItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const detectedVideoId = useMemo(() => getVideoId(youtubeUrl), [youtubeUrl]);
  const previewThumbnail = useMemo(() => {
    if (imageUrl) return imageUrl;
    return getAutoThumbnail(youtubeUrl);
  }, [youtubeUrl, imageUrl]);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hero-slides');
      const json = await res.json();
      if (json.success) {
        setSlides(json.data);
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleEdit = (item: HeroSlideItem) => {
    setEditId(item._id);
    setTitle(item.title || '');
    setDescription(item.description || '');
    setBadge(item.badge || '');
    setYoutubeUrl(item.youtubeUrl || '');
    setImageUrl(item.image && !item.image.includes('img.youtube.com') ? item.image : '');
    setOrder(item.order || 0);
    setIsActive(item.isActive !== false);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
    setBadge('');
    setYoutubeUrl('');
    setImageUrl('');
    setOrder(0);
    setIsActive(true);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body: any = {
      title,
      description,
      badge,
      youtubeUrl,
      order,
      isActive,
    };

    // If user provided a direct image URL, use it. Otherwise API auto-generates from YouTube.
    if (imageUrl) {
      body.image = imageUrl;
    }

    try {
      const url = editId ? `/api/hero-slides/${editId}` : '/api/hero-slides';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        fetchSlides();
        handleCancel();
      } else {
        alert(json.error || 'தோல்வியடைந்தது.');
      }
    } catch {
      alert('இணைப்புப் பிழை.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('இந்த ஸ்லைடை நீக்க வேண்டுமா?')) return;

    try {
      const res = await fetch(`/api/hero-slides/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchSlides();
      } else {
        alert(json.error || 'நீக்க முடியவில்லை.');
      }
    } catch {
      alert('இணைப்புப் பிழை.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-amber-900/30 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-200 tracking-wide font-sans gold-glow-text">
            ஹீரோ ஸ்லைடர் மேலாண்மை (Hero Slider)
          </h1>
          <p className="text-stone-400 text-xs mt-1 font-semibold">
            முகப்புப் பக்கத்தின் ஸ்லைடர் படங்களை நிர்வகிக்கவும். YouTube லிங்க் ஒட்டினால் Thumbnail தானாக வரும்.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>புதிய ஸ்லைடு</span>
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-6 border border-yellow-500/20 max-w-3xl"
        >
          <div className="flex justify-between items-center border-b border-amber-900/20 pb-3 mb-5">
            <h2 className="text-lg font-bold text-amber-200">
              {editId ? 'ஸ்லைடைத் தொகுக்கவும் (Edit Slide)' : 'புதிய ஸ்லைடு சேர்க்கவும் (Add Slide)'}
            </h2>
            <button onClick={handleCancel} className="text-stone-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-amber-200">
            {/* YouTube URL — PRIMARY INPUT */}
            <div>
              <label className="block uppercase tracking-wider mb-1.5">
                <LinkIcon className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />
                YouTube வீடியோ லிங்க்
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=xxxxx  அல்லது  https://youtu.be/xxxxx"
                className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewThumbnail}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
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

            {/* Title & Badge */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="block uppercase tracking-wider">ஸ்லைடு தலைப்பு (Title)</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="எ.கா: தெய்வீக அருள் பெருகும் பக்தி மார்க்கம்"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">பேட்ஜ் (Badge)</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="எ.கா: ஆன்மீகம்"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider">விளக்கம் (Description)</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ஸ்லைடின் சுருக்க விளக்கம்..."
                className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500 font-normal text-sm"
              />
            </div>

            {/* Image URL Override (optional) */}
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider text-stone-400">
                <ImageIcon className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />
                நேரடி படம் URL (விருப்பத்தேர்வு — YouTube இல்லாமல் படம் பயன்படுத்த)
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[10px] text-stone-500 font-normal">YouTube URL கொடுத்தால் இது தேவையில்லை — Thumbnail தானாகவே வரும்.</p>
            </div>

            {/* Order & Active */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-black/20 p-4 rounded-xl border border-yellow-500/5">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">
                  <GripVertical className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />
                  வரிசை எண் (Order)
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  className="w-full bg-black/40 text-amber-100 px-4 py-2.5 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <label htmlFor="isActive" className="uppercase tracking-wider select-none cursor-pointer">
                  செயலில் உள்ளது (Active)
                </label>
              </div>
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
                {editId ? 'சேமி (Save)' : 'ஸ்லைடைப் பதிவேற்று (Upload)'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Slides Grid */}
      {loading ? (
        <div className="text-center py-12 text-stone-400 font-bold animate-pulse text-sm">
          ஸ்லைடுகள் ஏற்றப்படுகின்றன...
        </div>
      ) : slides.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-stone-500 text-sm max-w-md">
          ஸ்லைடுகள் எதுவும் இல்லை. புதிய ஸ்லைடு சேர்க்கவும்.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => {
            const thumb = slide.image || getAutoThumbnail(slide.youtubeUrl);
            return (
              <motion.div
                key={slide._id}
                className="glass-card rounded-2xl overflow-hidden border border-yellow-500/10 hover:border-yellow-500/20 transition-all"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  {thumb ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const id = getVideoId(slide.youtubeUrl);
                          if (id && !target.src.includes('mqdefault')) {
                            target.src = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
                          }
                        }}
                      />
                      {slide.badge && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-500 text-amber-950 text-[10px] font-bold uppercase tracking-wider shadow">
                          {slide.badge}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-600">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}

                  {/* Active/Inactive indicator */}
                  <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow ${
                    slide.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {slide.isActive ? (
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Active</span>
                    ) : (
                      <span className="flex items-center gap-1"><EyeOff className="w-3 h-3" /> Hidden</span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-sm line-clamp-1 flex-grow">{slide.title}</h3>
                    <span className="text-[10px] text-stone-500 font-bold ml-2 shrink-0">#{slide.order}</span>
                  </div>
                  {slide.description && (
                    <p className="text-stone-400 text-xs line-clamp-2">{slide.description}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="px-4 pb-4 flex justify-end gap-2 border-t border-amber-900/20 pt-3">
                  <button
                    onClick={() => handleEdit(slide)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-200 transition cursor-pointer"
                    title="தொகு (Edit)"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400 transition cursor-pointer"
                    title="நீக்கு (Delete)"
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
