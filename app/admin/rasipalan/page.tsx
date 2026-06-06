'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Save, RefreshCw, Calendar, AlertCircle } from 'lucide-react';

const rasisList = [
  { name: 'மேஷம்', key: 'aries', symbol: '♈' },
  { name: 'ரிஷபம்', key: 'taurus', symbol: '♉' },
  { name: 'மிதுனம்', key: 'gemini', symbol: '♊' },
  { name: 'கடகம்', key: 'cancer', symbol: '♋' },
  { name: 'சிம்மம்', key: 'leo', symbol: '♌' },
  { name: 'கன்னி', key: 'virgo', symbol: '♍' },
  { name: 'துலாம்', key: 'libra', symbol: '♎' },
  { name: 'விருச்சிகம்', key: 'scorpio', symbol: '♏' },
  { name: 'தனுசு', key: 'sagittarius', symbol: '♐' },
  { name: 'மகரம்', key: 'capricorn', symbol: '♑' },
  { name: 'கும்பம்', key: 'aquarius', symbol: '♒' },
  { name: 'மீனம்', key: 'pisces', symbol: '♓' }
];

const horoscopeTypes = [
  { label: 'தினசரி ராசிபலன் (Daily)', value: 'daily' },
  { label: 'வாராந்திர ராசிபலன் (Weekly)', value: 'weekly' },
  { label: 'மாதாந்திர ராசிபலன் (Monthly)', value: 'monthly' },
  { label: 'குரு பெயர்ச்சி (Guru Peyarchi)', value: 'peyarchi_guru' },
  { label: 'சனி பெயர்ச்சி (Sani Peyarchi)', value: 'peyarchi_sani' },
  { label: 'தமிழ்ப் புத்தாண்டு (Tamil New Year)', value: 'puthandu_tamil' },
  { label: 'ஆங்கிலப் புத்தாண்டு (English New Year)', value: 'puthandu_english' }
];

export default function AdminRasiPalanPage() {
  const [type, setType] = useState('daily');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [predictions, setPredictions] = useState<Record<string, string>>({});
  const [youtubeUrls, setYoutubeUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Fetch horoscopes when type or date changes
  const fetchHoroscopes = async () => {
    setLoading(true);
    setStatusMsg('');
    try {
      const res = await fetch(`/api/rasipalan?type=${type}&date=${date}`);
      const json = await res.json();
      if (json.success) {
        // Map list to key-value prediction and youtubeUrl objects
        const predictionMapping: Record<string, string> = {};
        const urlMapping: Record<string, string> = {};
        rasisList.forEach((r) => {
          const match = json.data.find((p: any) => p.rasiKey === r.key);
          predictionMapping[r.key] = match ? match.prediction : '';
          urlMapping[r.key] = match ? (match.youtubeUrl || '') : '';
        });
        setPredictions(predictionMapping);
        setYoutubeUrls(urlMapping);
      }
    } catch (err) {
      console.error('Error fetching horoscopes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoroscopes();
  }, [type, date]);

  const handlePredictionChange = (key: string, val: string) => {
    setPredictions((prev) => ({ ...prev, [key]: val }));
  };

  const handleYoutubeUrlChange = (key: string, val: string) => {
    setYoutubeUrls((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg('');

    // Transform predictions object to payload list
    const payload = rasisList.map((r) => ({
      rasi: r.name,
      rasiKey: r.key,
      type,
      prediction: predictions[r.key] || 'இன்று உங்களுக்கு நன்மையான நாளாக இருக்கும்.',
      youtubeUrl: youtubeUrls[r.key] || '',
      date
    }));

    try {
      const res = await fetch('/api/rasipalan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setStatusMsg('12 ராசிகளின் பலன்களும் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டன!');
        fetchHoroscopes();
      } else {
        setStatusMsg('பிழை: பலன்களைச் சேமிக்க முடியவில்லை.');
      }
    } catch (err) {
      setStatusMsg('இணைப்புப் பிழை ஏற்பட்டது.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-amber-900/30 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-200 tracking-wide font-sans gold-glow-text">
            ராசிபலன் மேலாண்மை (Horoscope Editor)
          </h1>
          <p className="text-stone-400 text-xs mt-1 font-semibold">
            12 ராசிகளுக்கான தினசரி, வார, மாத மற்றும் கிரகப் பெயர்ச்சி பலன்களை இங்கிருந்து ஒரே நேரத்தில் திருத்தலாம்.
          </p>
        </div>
      </div>

      {/* Filter panel */}
      <div className="glass-panel rounded-2xl p-5 border border-yellow-500/10 flex flex-col md:flex-row gap-4 text-xs font-bold text-amber-200">
        <div className="flex-1 space-y-1.5">
          <label className="uppercase tracking-wider">பலன் வகை (Horoscope Type)</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-black/40 text-amber-100 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {horoscopeTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 space-y-1.5">
          <label className="uppercase tracking-wider">தேதி/காலம் (Date or Year)</label>
          <input
            type="text"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="daily: YYYY-MM-DD | weekly: YYYY-WXX | monthly: YYYY-MM | peyarchi/newyear: YYYY"
            className="w-full bg-black/40 text-amber-100 px-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Message alerts */}
      {statusMsg && (
        <div className={`p-4 rounded-xl text-xs font-bold ${
          statusMsg.includes('பிழை') 
            ? 'bg-red-950/40 border border-red-500/30 text-red-200' 
            : 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-200'
        }`}>
          {statusMsg}
        </div>
      )}

      {/* Bulk editor Form */}
      {loading ? (
        <div className="text-center py-12 text-stone-400 font-bold animate-pulse text-sm">
          பலன்கள் சேகரிக்கப்படுகின்றன...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rasisList.map((rasi) => (
              <div 
                key={rasi.key}
                className="glass-card rounded-2xl p-5 border border-yellow-500/10 hover:border-yellow-500/20 space-y-3"
              >
                <div className="flex items-center gap-3 border-b border-amber-900/20 pb-2">
                  <div className="w-9 h-9 rounded-lg overflow-hidden border border-yellow-500/15 shrink-0 bg-amber-950/20">
                    <img
                      src={`/images/${rasisList.findIndex(r => r.key === rasi.key) + 1}.jpg`}
                      alt={rasi.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-extrabold text-sm">{rasi.name} பலன்கள் ({rasi.key})</h3>
                  </div>
                </div>

                <div className="space-y-2">
                  <textarea
                    required
                    rows={3}
                    value={predictions[rasi.key] || ''}
                    onChange={(e) => handlePredictionChange(rasi.key, e.target.value)}
                    placeholder={`${rasi.name} ராசிக்கான பலன்களை இங்கு எழுதவும்...`}
                    className="w-full bg-black/30 text-stone-200 placeholder-amber-200/10 p-3 rounded-xl border border-yellow-500/10 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs font-semibold leading-relaxed"
                  />
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-stone-450 font-bold text-amber-200/70">YouTube வீடியோ லிங்க் (Embed URL)</label>
                    <input
                      type="text"
                      value={youtubeUrls[rasi.key] || ''}
                      onChange={(e) => handleYoutubeUrlChange(rasi.key, e.target.value)}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full bg-black/30 text-stone-200 placeholder-stone-600 p-2 rounded-xl border border-yellow-500/10 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-amber-950 font-extrabold shadow-lg border border-yellow-300/30 tracking-wide transition duration-200 cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>சேமிக்கப்படுகிறது...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>அனைத்து பலன்களையும் சேமிக்கவும் (Save All 12)</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
