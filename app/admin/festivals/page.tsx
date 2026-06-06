'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Edit, Trash2, Plus, X, Heart } from 'lucide-react';

interface FestivalItem {
  _id: string;
  name: string;
  date: string;
  significance: string;
  rituals: string;
  image: string;
}

export default function AdminFestivalsPage() {
  const [festivals, setFestivals] = useState<FestivalItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [significance, setSignificance] = useState('');
  const [rituals, setRituals] = useState('');
  const [image, setImage] = useState('');

  const fetchFestivals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/festivals');
      const json = await res.json();
      if (json.success) {
        setFestivals(json.data);
      }
    } catch (error) {
      console.error('Error fetching festivals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, []);

  const handleEdit = (item: FestivalItem) => {
    setEditId(item._id);
    setName(item.name);
    setDate(item.date);
    setSignificance(item.significance);
    setRituals(item.rituals);
    setImage(item.image);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditId(null);
    setName('');
    setDate('');
    setSignificance('');
    setRituals('');
    setImage('');
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { name, date, significance, rituals, image };

    try {
      const url = editId ? `/api/festivals/${editId}` : '/api/festivals';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        fetchFestivals();
        handleCancel();
      } else {
        alert(json.error || 'தோல்வியடைந்தது.');
      }
    } catch (error) {
      alert('இணைப்புப் பிழை.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('இந்தத் திருவிழாத் தகவலை நீக்க வேண்டுமா?')) return;

    try {
      const res = await fetch(`/api/festivals/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchFestivals();
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
            திருவிழாக்கள் மேலாண்மை (Festival CRUD)
          </h1>
          <p className="text-stone-400 text-xs mt-1 font-semibold">
            விரத நாட்கள், பண்டிகைகள், வழிபாட்டு முறைகள் மற்றும் அவற்றின் சிறப்புகளை இங்கிருந்து நிர்வகிக்கலாம்.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>விழா சேர்</span>
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
              {editId ? 'விழா விபரங்களைத் தொகுக்கவும்' : 'புதிய திருவிழா சேர்க்கவும்'}
            </h2>
            <button onClick={handleCancel} className="text-stone-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-amber-200">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider">திருவிழா பெயர் (Festival Name)</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="எ.கா: மகா சிவராத்திரி விரதம்"
                className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Date & Image Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">நடைபெறும் காலம் / தேதி (Date)</label>
                <input
                  type="text"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="எ.கா: மாசி மாதம் (பிப்ரவரி/மார்ச்)"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">திருவிழா படம் URL (Image Link)</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/festival.jpg"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Significance */}
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider">விழாவின் முக்கியத்துவம் (Significance)</label>
              <textarea
                required
                rows={3}
                value={significance}
                onChange={(e) => setSignificance(e.target.value)}
                placeholder="விழாவின் ஆன்மிக தாத்பரியம் மற்றும் முக்கியத்துவத்தை எழுதவும்..."
                className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500 font-normal text-sm"
              />
            </div>

            {/* Rituals */}
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider">பூஜை முறைகள் & விரத நியமங்கள் (Rituals)</label>
              <textarea
                rows={3}
                value={rituals}
                onChange={(e) => setRituals(e.target.value)}
                placeholder="பூஜை செய்ய வேண்டிய முறைகள், அபிஷேகங்கள், விரத வழிபாடுகளை விவரிக்கவும்..."
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
                {editId ? 'இலக்கு புதுப்பி' : 'விழாவைச் சேர்'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Festivals List */}
      {loading ? (
        <div className="text-center py-12 text-stone-400 font-bold animate-pulse text-sm">
          விழாக்கள் விபரம் ஏற்றப்படுகிறது...
        </div>
      ) : festivals.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-stone-500 text-sm max-w-md">
          விழாக்கள் பட்டியல் காலியாக உள்ளது. புதிய விழா சேர்க்கவும்.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {festivals.map((festival) => (
            <motion.div
              key={festival._id}
              className="glass-card rounded-2xl overflow-hidden border border-yellow-500/10 hover:border-yellow-500/20 flex flex-col justify-between"
            >
              {/* Cover preview */}
              {festival.image && (
                <div className="relative aspect-video w-full bg-stone-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={festival.image}
                    alt={festival.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Data info */}
              <div className="p-5 space-y-3">
                <h3 className="text-white font-bold text-base leading-snug">{festival.name}</h3>
                
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>காலம்: {festival.date}</span>
                </div>

                <p className="text-stone-400 text-xs line-clamp-2 leading-relaxed font-semibold">
                  {festival.significance}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="px-5 pb-5 flex justify-end gap-2 border-t border-amber-900/20 pt-3">
                <button
                  onClick={() => handleEdit(festival)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-200 transition cursor-pointer"
                  title="தொகு"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(festival._id)}
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
