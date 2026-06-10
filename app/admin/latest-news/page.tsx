'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Edit,
  Trash2,
  Plus,
  X,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Tag,
  Video,
  Sparkles,
} from 'lucide-react';

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
  isImportant: boolean;
  isLatest: boolean;
  publishDate: string;
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

export default function AdminLatestNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [titleTamil, setTitleTamil] = useState('');
  const [titleEnglish, setTitleEnglish] = useState('');
  const [descriptionTamil, setDescriptionTamil] = useState('');
  const [descriptionEnglish, setDescriptionEnglish] = useState('');
  const [category, setCategory] = useState('Spiritual');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [publishDate, setPublishDate] = useState('');

  const detectedVideoId = useMemo(() => getVideoId(youtubeUrl), [youtubeUrl]);
  const previewThumbnail = useMemo(() => getAutoThumbnail(youtubeUrl), [youtubeUrl]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news?isLatest=true');
      const json = await res.json();
      if (json.success) {
        setNews(json.data);
      }
    } catch (error) {
      console.error('Error fetching latest news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleEdit = (item: NewsItem) => {
    setEditId(item._id);
    setTitleTamil(item.titleTamil || '');
    setTitleEnglish(item.titleEnglish || '');
    setDescriptionTamil(item.descriptionTamil || '');
    setDescriptionEnglish(item.descriptionEnglish || '');
    setCategory(item.category || 'Spiritual');
    setYoutubeUrl(item.youtubeUrl || '');
    setIsImportant(!!item.isImportant);

    const dateObj = item.publishDate ? new Date(item.publishDate) : new Date();
    const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000);
    setPublishDate(localDate.toISOString().slice(0, 16));

    setShowForm(true);
  };

  const handleCancel = () => {
    setEditId(null);
    setTitleTamil('');
    setTitleEnglish('');
    setDescriptionTamil('');
    setDescriptionEnglish('');
    setCategory('Spiritual');
    setYoutubeUrl('');
    setIsImportant(false);
    setPublishDate('');
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPublishDate = publishDate ? new Date(publishDate).toISOString() : new Date().toISOString();

    // Auto-generate image from YouTube thumbnail
    const image = getAutoThumbnail(youtubeUrl);

    const body = {
      titleTamil,
      titleEnglish,
      descriptionTamil,
      descriptionEnglish,
      category,
      image,
      youtubeUrl,
      isImportant,
      isLatest: true, // Always true — this is the Latest/Current News page
      publishDate: formattedPublishDate,
    };

    try {
      const url = editId ? `/api/news/${editId}` : '/api/news';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        fetchNews();
        handleCancel();
      } else {
        alert(json.error || 'தோல்வியடைந்தது.');
      }
    } catch {
      alert('இணைப்புப் பிழை.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('இந்த அண்மைச் செய்தியை நீக்க வேண்டுமா?')) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchNews();
      } else {
        alert(json.error || 'நீக்க முடியவில்லை.');
      }
    } catch {
      alert('இணைப்புப் பிழை.');
    }
  };

  const openFormForNew = () => {
    const dateObj = new Date();
    const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000);
    setPublishDate(localDate.toISOString().slice(0, 16));
    setShowForm(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-amber-900/30 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-200 tracking-wide font-sans gold-glow-text">
            அண்மைச் செய்திகள் மேலாண்மை (Current / Latest News)
          </h1>
          <p className="text-stone-400 text-xs mt-1 font-semibold">
            YouTube லிங்கை மட்டும் ஒட்டவும் — Thumbnail தானாக வரும். isLatest தானாகவே அமைக்கப்படும்.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={openFormForNew}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>புதிய அண்மைச் செய்தி</span>
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-6 border border-yellow-500/20 max-w-4xl"
        >
          <div className="flex justify-between items-center border-b border-amber-900/20 pb-3 mb-5">
            <h2 className="text-lg font-bold text-amber-200">
              {editId ? 'அண்மைச் செய்தியைத் தொகுக்கவும் (Edit)' : 'புதிய அண்மைச் செய்தி (Add Latest News)'}
            </h2>
            <button onClick={handleCancel} className="text-stone-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Auto isLatest Badge */}
          <div className="mb-4 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300">isLatest = true — இந்தப் பக்கத்தில் சேர்க்கும் அனைத்து செய்திகளும் &quot;அண்மைச் செய்தி&quot; ஆக அமைக்கப்படும்.</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-amber-200">
            {/* YouTube URL — PRIMARY INPUT */}
            <div>
              <label className="block uppercase tracking-wider mb-1.5">
                <LinkIcon className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />
                YouTube வீடியோ லிங்க் (Paste YouTube Link)
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
                    ✓ Auto-fetched from YouTube
                  </div>
                </div>
              </div>
            )}

            {/* Title Bilingual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">செய்தித் தலைப்பு - தமிழ் (Title Tamil)</label>
                <input
                  type="text"
                  required
                  value={titleTamil}
                  onChange={(e) => setTitleTamil(e.target.value)}
                  placeholder="எ.கா: வைகாசி விசாக பெருவிழா"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">News Title - English</label>
                <input
                  type="text"
                  required
                  value={titleEnglish}
                  onChange={(e) => setTitleEnglish(e.target.value)}
                  placeholder="e.g. Vaikasi Visakam Festival"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Description Bilingual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">செய்தி விளக்கம் - தமிழ் (Content Tamil)</label>
                <textarea
                  required
                  rows={5}
                  value={descriptionTamil}
                  onChange={(e) => setDescriptionTamil(e.target.value)}
                  placeholder="செய்தியின் முழு விவரத்தை இங்கு எழுதவும்..."
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500 font-normal text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">News Description - English</label>
                <textarea
                  required
                  rows={5}
                  value={descriptionEnglish}
                  onChange={(e) => setDescriptionEnglish(e.target.value)}
                  placeholder="Write the full description in English here..."
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500 font-normal text-sm"
                />
              </div>
            </div>

            {/* Category & Publish Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">வகை (Category)</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/40 text-amber-100 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                >
                  <option value="Spiritual">ஆன்மீகம் (Spiritual)</option>
                  <option value="Sports">விளையாட்டு (Sports)</option>
                  <option value="Politics">அரசியல் (Politics)</option>
                  <option value="Education">கல்வி (Education)</option>
                  <option value="Technology">தொழில்நுட்பம் (Technology)</option>
                  <option value="Cinema">சினிமா (Cinema)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">வெளியீட்டு தேதி (Publish Date)</label>
                <input
                  type="datetime-local"
                  required
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full bg-black/40 text-amber-100 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                />
              </div>
            </div>

            {/* isImportant toggle */}
            <div className="bg-black/20 p-4 rounded-xl border border-yellow-500/5">
              <div className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="isImportant"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <label htmlFor="isImportant" className="uppercase tracking-wider select-none cursor-pointer">
                  முக்கிய செய்தியாகவும் அமை (Also set as Important News)
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
                {editId ? 'சேமி (Save)' : 'செய்தியைப் பதிவேற்று (Upload)'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* News List */}
      {loading ? (
        <div className="text-center py-12 text-stone-400 font-bold animate-pulse text-sm">
          அண்மைச் செய்திகள் ஏற்றப்படுகின்றன...
        </div>
      ) : news.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-stone-500 text-sm max-w-md">
          அண்மைச் செய்திகள் எதுவும் இல்லை. புதிய செய்தி சேர்க்கவும்.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {news.map((item) => {
            const thumb = item.image || getAutoThumbnail(item.youtubeUrl);
            return (
              <motion.div
                key={item._id}
                className="glass-card rounded-2xl overflow-hidden border border-yellow-500/10 hover:border-yellow-500/20 flex flex-col"
              >
                {/* Thumbnail */}
                {thumb && (
                  <div className="relative aspect-video bg-black overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumb}
                      alt={item.titleTamil}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const id = getVideoId(item.youtubeUrl);
                        if (id && !target.src.includes('mqdefault')) {
                          target.src = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
                        }
                      }}
                    />
                    {item.youtubeVideoId && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Video className="w-10 h-10 text-yellow-400 opacity-80" />
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-5 space-y-3 flex-grow">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {item.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      அண்மைச் செய்தி
                    </span>
                    {item.isImportant && (
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        முக்கியம்
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <h4 className="text-[10px] uppercase text-stone-500 font-bold">தமிழ்</h4>
                      <h3 className="text-white font-bold text-sm leading-snug line-clamp-1">{item.titleTamil}</h3>
                      <p className="text-stone-400 text-[11px] line-clamp-2 leading-relaxed font-semibold">{item.descriptionTamil}</p>
                    </div>
                    <div className="space-y-1 border-t md:border-t-0 md:border-l border-amber-900/20 pt-2 md:pt-0 md:pl-3">
                      <h4 className="text-[10px] uppercase text-stone-500 font-bold">English</h4>
                      <h3 className="text-amber-250 font-bold text-sm leading-snug line-clamp-1">{item.titleEnglish}</h3>
                      <p className="text-stone-450 text-[11px] line-clamp-2 leading-relaxed font-semibold">{item.descriptionEnglish}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center border-t border-amber-900/30 px-5 py-3">
                  <span className="text-[10px] text-stone-500 font-semibold">
                    {new Date(item.publishDate || item.createdAt || '').toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-200 transition cursor-pointer"
                      title="தொகு (Edit)"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400 transition cursor-pointer"
                      title="நீக்கு (Delete)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
