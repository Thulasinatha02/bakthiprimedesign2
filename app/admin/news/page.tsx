'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Edit, Trash2, Plus, X, Tag, Video, Sparkles, AlertCircle } from 'lucide-react';

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
  updatedAt?: string;
}

export default function AdminNewsPage() {
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
  const [image, setImage] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [isLatest, setIsLatest] = useState(false);
  const [publishDate, setPublishDate] = useState('');

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      const json = await res.json();
      if (json.success) {
        setNews(json.data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
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
    setImage(item.image || '');
    setYoutubeUrl(item.youtubeUrl || '');
    setIsImportant(!!item.isImportant);
    setIsLatest(!!item.isLatest);
    
    // Format publishDate to match datetime-local input format (YYYY-MM-DDThh:mm)
    const dateObj = item.publishDate ? new Date(item.publishDate) : new Date();
    // Offset for local timezone representation
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
    setImage('');
    setYoutubeUrl('');
    setIsImportant(false);
    setIsLatest(false);
    setPublishDate('');
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPublishDate = publishDate ? new Date(publishDate).toISOString() : new Date().toISOString();
    const body = { 
      titleTamil, 
      titleEnglish, 
      descriptionTamil, 
      descriptionEnglish, 
      category, 
      image, 
      youtubeUrl, 
      isImportant, 
      isLatest, 
      publishDate: formattedPublishDate 
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
    } catch (error) {
      alert('இணைப்புப் பிழை.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('இந்தச் செய்தியை நீக்க வேண்டுமா?')) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchNews();
      } else {
        alert(json.error || 'நீக்க முடியவில்லை.');
      }
    } catch (error) {
      alert('இணைப்புப் பிழை.');
    }
  };

  const openFormForNew = () => {
    // Set default publish date to local timezone YYYY-MM-DDThh:mm
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
            செய்திகள் மேலாண்மை (Bilingual News CRUD)
          </h1>
          <p className="text-stone-400 text-xs mt-1 font-semibold">
            பக்தர்களுக்கான தமிழ் மற்றும் ஆங்கிலச் செய்திகளை இங்கிருந்து நிர்வகிக்கவும்.
          </p>
        </div>
        
        {!showForm && (
          <button
            onClick={openFormForNew}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>புதிய செய்தி சேர்</span>
          </button>
        )}
      </div>

      {/* Input Form Card */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-6 border border-yellow-500/20 max-w-4xl"
        >
          <div className="flex justify-between items-center border-b border-amber-900/20 pb-3 mb-5">
            <h2 className="text-lg font-bold text-amber-200">
              {editId ? 'செய்தியைத் தொகுக்கவும் (Edit News)' : 'புதிய செய்தி சேர்க்கவும் (Add News)'}
            </h2>
            <button onClick={handleCancel} className="text-stone-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-amber-200">
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
                  placeholder="e.g. Vaikasi Visakam Festival Celebration"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Category, Image & YouTube */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <label className="block uppercase tracking-wider">படம் URL (Image Link)</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">YouTube URL</label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
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
                  rows={6}
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
                  rows={6}
                  value={descriptionEnglish}
                  onChange={(e) => setDescriptionEnglish(e.target.value)}
                  placeholder="Write the full description in English here..."
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500 font-normal text-sm"
                />
              </div>
            </div>

            {/* Flags & Publish Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-black/20 p-4 rounded-xl border border-yellow-500/5">
              <div className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="isImportant"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <label htmlFor="isImportant" className="uppercase tracking-wider select-none cursor-pointer">
                  முக்கிய செய்தி (Set as Important)
                </label>
              </div>

              <div className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="isLatest"
                  checked={isLatest}
                  onChange={(e) => setIsLatest(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <label htmlFor="isLatest" className="uppercase tracking-wider select-none cursor-pointer">
                  அண்மை செய்தி (Set as Latest)
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">வெளியீட்டு தேதி (Publish Date)</label>
                <input
                  type="datetime-local"
                  required
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full bg-black/40 text-amber-100 px-4 py-2 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                />
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
          செய்திகள் ஏற்றப்படுகின்றன...
        </div>
      ) : news.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-stone-500 text-sm max-w-md">
          செய்திகள் எதுவும் பதிவிடப்படவில்லை. புதிய செய்தி சேர்க்கவும்.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {news.map((item) => (
            <motion.div
              key={item._id}
              className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-yellow-500/10 hover:border-yellow-500/20 relative"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {item.category === 'Spiritual' ? 'ஆன்மீகம்' : item.category}
                  </span>
                  {item.isImportant && (
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      முக்கிய செய்தி
                    </span>
                  )}
                  {item.isLatest && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      அண்மைச் செய்தி
                    </span>
                  )}
                  {item.youtubeVideoId && (
                    <span className="px-2 py-0.5 rounded bg-red-650/20 text-red-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      வீடியோ
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h4 className="text-[10px] uppercase text-stone-500 font-bold">தமிழ் (Tamil)</h4>
                    <h3 className="text-white font-bold text-sm leading-snug line-clamp-1">{item.titleTamil || item.titleEnglish}</h3>
                    <p className="text-stone-400 text-[11px] line-clamp-2 leading-relaxed font-semibold">{item.descriptionTamil || item.descriptionEnglish}</p>
                  </div>
                  <div className="space-y-1 border-t md:border-t-0 md:border-l border-amber-900/20 pt-2 md:pt-0 md:pl-4">
                    <h4 className="text-[10px] uppercase text-stone-500 font-bold">English</h4>
                    <h3 className="text-amber-250 font-bold text-sm leading-snug line-clamp-1">{item.titleEnglish || item.titleTamil}</h3>
                    <p className="text-stone-450 text-[11px] line-clamp-2 leading-relaxed font-semibold">{item.descriptionEnglish || item.descriptionTamil}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center border-t border-amber-900/30 mt-4 pt-3">
                <span className="text-[10px] text-stone-500 font-semibold">
                  Publish Date: {new Date(item.publishDate || item.createdAt || '').toLocaleDateString()}
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
          ))}
        </div>
      )}
    </div>
  );
}
