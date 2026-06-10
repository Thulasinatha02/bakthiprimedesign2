'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Edit, Trash2, Plus, X, Compass, Clock } from 'lucide-react';

interface TempleItem {
  _id: string;
  name: string;
  location: string;
  deity: string;
  history: string;
  image: string;
  timings: string;
}

export default function AdminTemplesPage() {
  const [temples, setTemples] = useState<TempleItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [deity, setDeity] = useState('');
  const [history, setHistory] = useState('');
  const [image, setImage] = useState('');
  const [imageError, setImageError] = useState(false);
  const [timings, setTimings] = useState('');

  const fetchTemples = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/temples');
      const json = await res.json();
      if (json.success) {
        setTemples(json.data);
      }
    } catch (error) {
      console.error('Error fetching temples:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemples();
  }, []);

  const handleEdit = (item: TempleItem) => {
    setEditId(item._id);
    setName(item.name);
    setLocation(item.location);
    setDeity(item.deity);
    setHistory(item.history);
    setImage(item.image);
    setTimings(item.timings);
    setShowForm(true);
  };

  const isGoogleImageUrl = (url: string) =>
    /lh\d\.googleusercontent\.com|google\.com\/imgres|gstatic\.com/.test(url);

  const handleCancel = () => {
    setEditId(null);
    setName('');
    setLocation('');
    setDeity('');
    setHistory('');
    setImage('');
    setImageError(false);
    setTimings('');
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { name, location, deity, history, image, timings };

    try {
      const url = editId ? `/api/temples/${editId}` : '/api/temples';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        fetchTemples();
        handleCancel();
      } else {
        alert(json.error || 'தோல்வியடைந்தது.');
      }
    } catch (error) {
      alert('இணைப்புப் பிழை.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('இந்த ஆலயத் தகவலை நீக்க வேண்டுமா?')) return;

    try {
      const res = await fetch(`/api/temples/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchTemples();
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
            கோவில்கள் மேலாண்மை (Temple CRUD)
          </h1>
          <p className="text-stone-400 text-xs mt-1 font-semibold">
            புண்ணிய திருத்தலங்கள், அவற்றின் வரலாறு மற்றும் தரிசன நேரங்களை இங்கு பதிவிடலாம்.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>கோவில் சேர்</span>
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
              {editId ? 'ஆலயத் தகவலைத் தொகுக்கவும்' : 'புதிய ஆலயத் தகவல் சேர்க்கவும்'}
            </h2>
            <button onClick={handleCancel} className="text-stone-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-amber-200">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider">கோவில் பெயர் (Temple Name)</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="எ.கா: மதுரை மீனாட்சி சுந்தரேஸ்வரர் திருக்கோவில்"
                className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Location & Deity Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">அமைவிடம் (Location)</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="எ.கா: மதுரை, தமிழ்நாடு"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">மூலவர் தெய்வம் (Deity)</label>
                <input
                  type="text"
                  required
                  value={deity}
                  onChange={(e) => setDeity(e.target.value)}
                  placeholder="எ.கா: மீனாட்சி அம்மன், சுந்தரேஸ்வரர்"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Timings & Image Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">தரிசன நேரம் (Timings)</label>
                <input
                  type="text"
                  value={timings}
                  onChange={(e) => setTimings(e.target.value)}
                  placeholder="எ.கா: காலை 5.00 - மதியம் 12.30, மாலை 4.00 - இரவு 9.30"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">கோவில் படம் URL (Image Link)</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => { setImage(e.target.value); setImageError(false); }}
                  placeholder="https://example.com/temple.jpg"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                {/* Live Preview */}
                {image.trim() && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-yellow-500/20 bg-black/30">
                    {isGoogleImageUrl(image) ? (
                      <div className="px-4 py-3 text-[11px] text-amber-300 font-semibold flex items-start gap-2">
                        <span className="text-lg leading-none">⚠️</span>
                        <span>
                          Google படங்கள் direct link ஆக வேலை செய்யாது (CORS தடை).<br />
                          <span className="text-white/60">Please upload to </span>
                          <a href="https://imgbb.com" target="_blank" rel="noreferrer" className="underline text-amber-400">imgbb.com</a>
                          <span className="text-white/60"> or </span>
                          <a href="https://postimages.org" target="_blank" rel="noreferrer" className="underline text-amber-400">postimages.org</a>
                          <span className="text-white/60"> and paste that URL instead.</span>
                        </span>
                      </div>
                    ) : imageError ? (
                      <div className="px-4 py-3 text-[11px] text-red-400 font-semibold flex items-center gap-2">
                        <span>❌</span> இந்த URL-ல் படம் ஏற்றப்படவில்லை. சரியான link பயன்படுத்தவும்.
                      </div>
                    ) : (
                      <div className="relative aspect-video w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt="Preview"
                          onError={() => setImageError(true)}
                          onLoad={() => setImageError(false)}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/60 text-[10px] text-amber-200 px-2 py-0.5 rounded font-bold">Preview</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* History */}
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider">தல வரலாறு மற்றும் புராண சிறப்புகள் (History)</label>
              <textarea
                required
                rows={5}
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                placeholder="கோவிலின் வரலாறு மற்றும் புராணப் பெருமைகளை விரிவாக எழுதவும்..."
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
                {editId ? 'இலக்கு புதுப்பி' : 'கோவில் பதிவேற்று'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Temples List */}
      {loading ? (
        <div className="text-center py-12 text-stone-400 font-bold animate-pulse text-sm">
          ஆலயங்கள் விவரம் ஏற்றப்படுகிறது...
        </div>
      ) : temples.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-stone-500 text-sm max-w-md">
          ஆலயங்கள் பட்டியல் காலியாக உள்ளது. புதிய கோவில் சேர்க்கவும்.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {temples.map((temple) => (
            <motion.div
              key={temple._id}
              className="glass-card rounded-2xl overflow-hidden border border-yellow-500/10 hover:border-yellow-500/20 flex flex-col justify-between"
            >
              {/* Cover preview */}
              {temple.image && (
                <div className="relative aspect-video w-full bg-stone-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={temple.image}
                    alt={temple.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Data info */}
              <div className="p-5 space-y-3">
                <h3 className="text-white font-bold text-base leading-snug">{temple.name}</h3>
                
                <div className="space-y-1 text-xs text-stone-400 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{temple.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>மூலவர்: {temple.deity}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{temple.timings || 'தரிசன நேரம் விபரம் இல்லை'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-5 pb-5 flex justify-end gap-2 border-t border-amber-900/20 pt-3">
                <button
                  onClick={() => handleEdit(temple)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-200 transition cursor-pointer"
                  title="தொகு"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(temple._id)}
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
