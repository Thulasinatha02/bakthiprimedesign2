'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

const rasis = [
  { name: 'மேஷம் (Aries)', key: 'aries' },
  { name: 'ரிஷபம் (Taurus)', key: 'taurus' },
  { name: 'மிதுனம் (Gemini)', key: 'gemini' },
  { name: 'கடகம் (Cancer)', key: 'cancer' },
  { name: 'சிம்மம் (Leo)', key: 'leo' },
  { name: 'கன்னி (Virgo)', key: 'virgo' },
  { name: 'துலாம் (Libra)', key: 'libra' },
  { name: 'விருச்சிகம் (Scorpio)', key: 'scorpio' },
  { name: 'தனுசு (Sagittarius)', key: 'sagittarius' },
  { name: 'மகரம் (Capricorn)', key: 'capricorn' },
  { name: 'கும்பம் (Aquarius)', key: 'aquarius' },
  { name: 'மீனம் (Pisces)', key: 'pisces' }
];

export default function PoruthamPage() {
  const [boyRasi, setBoyRasi] = useState('');
  const [girlRasi, setGirlRasi] = useState('');
  const [result, setResult] = useState<{
    score: number;
    status: string;
    description: string;
    details: { title: string; match: boolean; desc: string }[];
  } | null>(null);
  const [animating, setAnimating] = useState(false);

  const calculateCompatibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boyRasi || !girlRasi) return;

    setAnimating(true);
    setResult(null);

    // Simulate astronomical calculations with a brief delay
    setTimeout(() => {
      const boyIndex = rasis.findIndex(r => r.key === boyRasi);
      const girlIndex = rasis.findIndex(r => r.key === girlRasi);

      // Simple pseudo-astrology distance rule for fun and functionality
      const distance = Math.abs(boyIndex - girlIndex);
      let score = 0;
      let status = '';
      let description = '';

      if (distance === 0) {
        score = 8;
        status = 'உத்தமம் (Excellent Match)';
        description = 'ஏக ராசி பொருத்தம் மிக நன்று. தம்பதியினருக்கு இடையே நல்ல புரிந்துணர்வும் ஒற்றுமையும் நிலவும்.';
      } else if ([1, 3, 5, 7, 9, 11].includes(distance)) {
        score = 9;
        status = 'மிக உத்தமம் (Very Good Match)';
        description = 'இருவருக்கும் இடையே மனப் பொருத்தம், உடல் நலம், குழந்தை பேறு மற்றும் செல்வ வளம் அனைத்தும் சிறப்பாக அமையும்.';
      } else if ([2, 4, 6, 8].includes(distance)) {
        score = 6;
        status = 'மத்திமம் (Average Match)';
        description = 'சில பொருத்தங்கள் சாதகமாகவும், சில சற்றே பலவீனமாகவும் உள்ளன. குடும்பத்தில் சகிப்புத்தன்மை மற்றும் பரஸ்பர விட்டுக் கொடுத்தல் தேவை.';
      } else {
        score = 4;
        status = 'அதமம் (Weak Match)';
        description = 'இருவருக்கும் இடையே கருத்து வேறுபாடுகள் தோன்ற வாய்ப்புகள் அதிகம். திருமணம் செய்வதற்கு முன் மூத்த ஜோதிடரிடம் முழுமையான ஜாதகப் பொருத்தம் பார்ப்பது அவசியமாகும்.';
      }

      const matchDetails = [
        { title: 'தினப் பொருத்தம் (Health & Longevity)', match: score >= 6, desc: 'ஆரோக்கியமான மற்றும் நீண்ட ஆயுளுக்கான தகுதி.' },
        { title: 'கணப் பொருத்தம் (Temperament)', match: distance % 2 === 0, desc: 'குணங்கள் மற்றும் மனோபாவங்களின் இணக்கம்.' },
        { title: 'மகேந்திரப் பொருத்தம் (Lineage)', match: score >= 8, desc: 'புத்திர பாக்கியம் மற்றும் வம்ச வளர்ச்சி.' },
        { title: 'ஸ்திரீ தீர்க்கப் பொருத்தம் (Prosperity)', match: score >= 6, desc: 'மனைவிக்கு தீர்க்க சுமங்கலி பாக்கியம் மற்றும் குடும்ப வளம்.' },
        { title: 'யோனிப் பொருத்தம் (Physical Harmony)', match: distance !== 6, desc: 'உடல் ரீதியான நல்ல ஒத்திசைவு.' }
      ];

      setResult({
        score,
        status,
        description,
        details: matchDetails
      });
      setAnimating(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex p-3 bg-red-50 text-red-600 rounded-full mb-3">
          <Heart className="w-6 h-6 animate-pulse" />
        </div>
        <h1 className="text-3xl font-extrabold text-amber-950 font-sans tracking-wide">
          திருமணப் பொருத்தம் (Marriage Compatibility)
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 mx-auto mt-3 rounded-full"></div>
        <p className="text-stone-500 text-sm max-w-md mx-auto mt-3">
          ஆண் மற்றும் பெண்ணின் ராசிகளைத் தேர்வு செய்து, திருமணப் பொருத்தத்தை எளிதாகக் கண்டறியுங்கள்.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Calculator Form */}
        <div className="md:col-span-6 bg-white rounded-2xl shadow-md border border-amber-100 p-6 space-y-6">
          <h2 className="font-extrabold text-amber-900 text-lg flex items-center gap-1.5 border-b border-stone-100 pb-3">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>ராசி பொருத்தம் காணல்</span>
          </h2>

          <form onSubmit={calculateCompatibility} className="space-y-5">
            {/* Boy's Rasi */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                ஆண் ராசி (Boy's Rasi)
              </label>
              <select
                required
                value={boyRasi}
                onChange={(e) => setBoyRasi(e.target.value)}
                className="w-full bg-amber-50/30 border border-amber-100 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">தேர்வு செய்க...</option>
                {rasis.map(rasi => (
                  <option key={`boy-${rasi.key}`} value={rasi.key}>{rasi.name}</option>
                ))}
              </select>
            </div>

            {/* Girl's Rasi */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                பெண் ராசி (Girl's Rasi)
              </label>
              <select
                required
                value={girlRasi}
                onChange={(e) => setGirlRasi(e.target.value)}
                className="w-full bg-amber-50/30 border border-amber-100 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">தேர்வு செய்க...</option>
                {rasis.map(rasi => (
                  <option key={`girl-${rasi.key}`} value={rasi.key}>{rasi.name}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={animating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white font-bold tracking-wide shadow-md transition duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              {animating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>கணக்கிடப்படுகிறது...</span>
                </>
              ) : (
                <span>பொருத்தம் காண்க</span>
              )}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="md:col-span-6">
          <AnimatePresence mode="wait">
            {animating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-amber-50/50 rounded-2xl border border-dashed border-amber-300 p-12 text-center h-[340px] flex flex-col items-center justify-center space-y-4"
              >
                <RefreshCw className="w-12 h-12 text-orange-500 animate-spin" />
                <p className="text-amber-900 font-bold text-sm">கிரக நிலைகள் மற்றும் நட்சத்திர பொருத்தங்கள் ஆராயப்படுகின்றன...</p>
              </motion.div>
            )}

            {!animating && !result && (
              <div className="bg-stone-50 border border-stone-200 border-dashed rounded-2xl p-12 text-center h-[340px] flex flex-col items-center justify-center text-stone-400 text-sm">
                <AlertCircle className="w-10 h-10 mb-3 text-stone-400" />
                ராசிகளைத் தேர்வு செய்து "பொருத்தம் காண்க" பொத்தானை அழுத்தவும்.
              </div>
            )}

            {!animating && result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-md border border-amber-200 p-6 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-extrabold text-stone-800 text-lg">பொருத்த முடிவு</h3>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 font-bold text-sm rounded-full">
                    <span>பொருத்தம்:</span>
                    <span className="text-red-700">{result.score} / 10</span>
                  </div>
                </div>

                {/* Compatibility Level */}
                <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-100 text-center">
                  <h4 className="font-extrabold text-amber-950 text-base mb-1">{result.status}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-medium">{result.description}</p>
                </div>

                {/* Individual Matching Items */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-stone-700 text-xs uppercase tracking-wider">பொருத்தங்களின் விவரம்:</h4>
                  <div className="space-y-2">
                    {result.details.map((detail, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-stone-50 rounded-lg border border-stone-100">
                        <div>
                          <p className="font-extrabold text-stone-800">{detail.title}</p>
                          <p className="text-[10px] text-stone-400 font-semibold">{detail.desc}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          detail.match 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {detail.match ? 'ஆம்' : 'இல்லை'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
