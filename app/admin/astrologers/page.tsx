'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Edit, Trash2, Plus, X, Award } from 'lucide-react';

interface AstrologerItem {
  _id: string;
  name: string;
  image: string;
  specialty: string;
  experience: number;
  phone: string;
  email: string;
}

export default function AdminAstrologersPage() {
  const [astrologers, setAstrologers] = useState<AstrologerItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState(5);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const fetchAstrologers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/astrologers');
      const json = await res.json();
      if (json.success) {
        setAstrologers(json.data);
      }
    } catch (error) {
      console.error('Error fetching astrologers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAstrologers();
  }, []);

  const handleEdit = (item: AstrologerItem) => {
    setEditId(item._id);
    setName(item.name);
    setImage(item.image);
    setSpecialty(item.specialty);
    setExperience(item.experience);
    setPhone(item.phone);
    setEmail(item.email);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditId(null);
    setName('');
    setImage('');
    setSpecialty('');
    setExperience(5);
    setPhone('');
    setEmail('');
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { name, image, specialty, experience, phone, email };

    try {
      const url = editId ? `/api/astrologers/${editId}` : '/api/astrologers';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        fetchAstrologers();
        handleCancel();
      } else {
        alert(json.error || 'தோல்வியடைந்தது.');
      }
    } catch (error) {
      alert('இணைப்புப் பிழை.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('இந்த ஜோதிடரை நீக்க வேண்டுமா?')) return;

    try {
      const res = await fetch(`/api/astrologers/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchAstrologers();
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
            ஜோதிடர்கள் மேலாண்மை (Astrologer CRUD)
          </h1>
          <p className="text-stone-400 text-xs mt-1 font-semibold">
            இணையதளத்தில் ஆலோசனை வழங்கும் ஜோதிட நிபுணர் குழுவை இங்கு நிர்வகிக்கலாம்.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>ஜோதிடரைச் சேர்</span>
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
              {editId ? 'ஜோதிடரைத் தொகுக்கவும்' : 'புதிய ஜோதிடரைச் சேர்க்கவும்'}
            </h2>
            <button onClick={handleCancel} className="text-stone-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-amber-200">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider">ஜோதிடர் பெயர் (Astrologer Name)</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="எ.கா: ஜோதிட ரத்னா சுப்பிரமணியம்"
                className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Specialty & Experience Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">சிறப்புத் துறை (Specialty)</label>
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="எ.கா: வேத ஜோதிடம் & கைரேகை"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">அனுபவம் (Experience in Years)</label>
                <input
                  type="number"
                  required
                  value={experience}
                  onChange={(e) => setExperience(parseInt(e.target.value))}
                  placeholder="எ.கா: 15"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Phone & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">தொலைபேசி எண் (Phone)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXXXXXXX"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider">மின்னஞ்சல் (Email)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@bakthiprime.com"
                  className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Profile Image URL */}
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider">புகைப்பட லிங்க் (Photo URL)</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                {editId ? 'இலக்கு புதுப்பி' : 'ஜோதிடரைச் சேர்'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Astrologers List */}
      {loading ? (
        <div className="text-center py-12 text-stone-400 font-bold animate-pulse text-sm">
          ஜோதிடர்கள் பட்டியல் ஏற்றப்படுகிறது...
        </div>
      ) : astrologers.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-stone-500 text-sm max-w-md">
          ஜோதிடர்கள் பட்டியல் காலியாக உள்ளது. புதிய ஜோதிடரைச் சேர்க்கவும்.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {astrologers.map((astrologer) => (
            <motion.div
              key={astrologer._id}
              className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-yellow-500/10 hover:border-yellow-500/20"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-yellow-400/40 shrink-0 bg-stone-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={astrologer.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                      alt={astrologer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm leading-snug">{astrologer.name}</h3>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{astrologer.specialty}</p>
                  </div>
                </div>

                <div className="text-xs text-stone-400 font-semibold space-y-1 pt-1.5 border-t border-amber-900/10">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>அனுபவம்: {astrologer.experience} ஆண்டுகள்</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 border-t border-amber-900/20 mt-4 pt-3">
                <button
                  onClick={() => handleEdit(astrologer)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-200 transition cursor-pointer"
                  title="தொகு"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(astrologer._id)}
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
