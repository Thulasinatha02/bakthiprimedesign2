'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Edit, Trash2, Plus, X, Tag } from 'lucide-react';

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  image: string;
  category: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Spiritual');

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
    setTitle(item.title);
    setContent(item.content);
    setImage(item.image);
    setCategory(item.category);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditId(null);
    setTitle('');
    setContent('');
    setImage('');
    setCategory('Spiritual');
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { title, content, image, category };

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-amber-900/30 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-200 tracking-wide font-sans gold-glow-text">
            செய்திகள் மேலாண்மை (News CRUD)
          </h1>
          <p className="text-stone-400 text-xs mt-1 font-semibold">
            பக்தர்களுக்கான ஆன்மிக செய்திகளை இங்கிருந்து நிர்வகிக்கவும்.
          </p>
        </div>
        
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
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
          className="glass-panel rounded-3xl p-6 border border-yellow-500/20 max-w-2xl"
        >
          <div className="flex justify-between items-center border-b border-amber-900/20 pb-3 mb-5">
            <h2 className="text-lg font-bold text-amber-200">
              {editId ? 'செய்தியைத் தொகுக்கவும்' : 'புதிய செய்தி சேர்க்கவும்'}
            </h2>
            <button onClick={handleCancel} className="text-stone-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-amber-200">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider">செய்தித் தலைப்பு (Title)</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="எ.கா: வைகாசி விசாக பெருவிழா"
                className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Category & Image Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">வகை (Category)</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/40 text-amber-100 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                >
                  <option value="Spiritual">ஆன்மிகம் (Spiritual)</option>
                  <option value="Astrology">ஜோதிடம் (Astrology)</option>
                  <option value="News">பொதுச்செய்தி (General News)</option>
                  <option value="Sports">விளையாட்டு (Sports)</option>
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
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider">செய்தி விளக்கம் (Content)</label>
              <textarea
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="செய்தியின் முழு விவரத்தை இங்கு எழுதவும்..."
                className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500 font-normal text-sm"
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
                {editId ? 'இலக்கு புதுப்பி' : 'செய்தியைப் பதிவேற்று'}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news.map((item) => (
            <motion.div
              key={item._id}
              className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-yellow-500/10 hover:border-yellow-500/20 relative"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {item.category === 'Spiritual' ? 'ஆன்மிகம்' : item.category === 'Astrology' ? 'ஜோதிடம்' : item.category}
                  </span>
                </div>
                <h3 className="text-white font-bold text-base leading-snug line-clamp-1">{item.title}</h3>
                <p className="text-stone-400 text-xs line-clamp-3 leading-relaxed font-semibold">{item.content}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 border-t border-amber-900/30 mt-4 pt-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-200 transition cursor-pointer"
                  title="தொகு"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
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
