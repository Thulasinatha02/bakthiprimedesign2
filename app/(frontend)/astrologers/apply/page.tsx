'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AstrologerApplyPage() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState(0);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/astrologer-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, specialty, experience, phone, email, image }),
      });

      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
      } else {
        setError(json.error || t('விண்ணப்பத்தை சமர்ப்பிக்க முடியவில்லை. (Failed to submit application)'));
      }
    } catch (err) {
      setError(t('இணைப்புப் பிழை. (Connection Error)'));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-amber-100 max-w-lg text-center"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-amber-950 mb-4">{t('விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!')}</h2>
          <p className="text-stone-600 text-sm leading-relaxed mb-8">
            {t('உங்கள் விண்ணப்பத்தை நாங்கள் பெற்றுள்ளோம். எங்களது தேர்வுக் குழு உங்களின் விவரங்களைச் சரிபார்த்து, நேர்காணல் தொடர்பான தகவல்களுடன் உங்களைத் தொடர்புகொள்வார்கள்.')}
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full shadow-md hover:from-amber-600 hover:to-orange-600 transition"
          >
            {t('முகப்புக்குத் திரும்பு')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-amber-100/50 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-300/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-4 text-amber-600 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-950 font-sans tracking-wide">
            {t('ஜோதிடராக இணைய விண்ணப்பிக்கவும்')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-stone-600 mt-4 font-medium text-sm sm:text-base max-w-lg mx-auto">
            {t('எங்கள் தளத்தில் இணைந்து, உலகம் முழுவதிலுமுள்ள மக்களுக்கு உங்கள் ஜோதிட ஆலோசனைகளை வழங்க இப்போதே விண்ணப்பிக்கவும்.')}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white text-center">
            <h2 className="text-xl font-bold">{t('விண்ணப்பப் படிவம்')}</h2>
            <p className="text-amber-100 text-xs mt-1">{t('கீழ்க்கண்ட அனைத்து விவரங்களையும் சரியாக நிரப்பவும்.')}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100 text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-bold text-stone-700">{t('ஜோதிடர் பெயர் (Astrologer Name) *')}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('எ.கா: ஜோதிட ரத்னா சுப்பிரமணியம்')}
                className="w-full bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700">{t('சிறப்புத் துறை (Specialty) *')}</label>
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder={t('எ.கா: வேத ஜோதிடம் & கைரேகை')}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700">{t('அனுபவம் (Experience in Years) *')}</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={experience}
                  onChange={(e) => setExperience(parseInt(e.target.value) || 0)}
                  placeholder={t('எ.கா: 15')}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700">{t('தொலைபேசி எண் (Phone)')}</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('+91 XXXXXXXXXX')}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-700">{t('மின்னஞ்சல் (Email)')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('name@example.com')}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-stone-700">{t('புகைப்படம் அல்லது ஆவணம் (Upload Photo / Document)')}</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.doc,.docx,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    setImage('');
                    return;
                  }
                  
                  if (file.size > 2 * 1024 * 1024) {
                    alert(t('கோப்பு 2MB அளவுக்குள் இருக்க வேண்டும். (File must be under 2MB)'));
                    e.target.value = '';
                    setImage('');
                    return;
                  }

                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }}
                className="w-full bg-stone-50 border border-stone-200 text-stone-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 cursor-pointer transition"
              />
              <p className="text-[10px] text-stone-500 font-medium">
                {t('jpg, png, doc, pdf கோப்புகளை பதிவேற்றவும் (2MB-க்குள்).')}
              </p>
              {image && <p className="text-xs text-green-600 font-bold mt-1">{t('கோப்பு தேர்ந்தெடுக்கப்பட்டது.')}</p>}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-lg rounded-xl shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="animate-pulse">{t('சமர்ப்பிக்கப்படுகிறது...')}</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{t('விண்ணப்பத்தை சமர்ப்பி')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
