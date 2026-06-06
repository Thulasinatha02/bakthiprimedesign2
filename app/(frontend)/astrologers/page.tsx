'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Phone, Mail, AwardIcon, CheckCircle } from 'lucide-react';
import { DetailedPageSkeleton } from '@/components/LoadingSkeleton';

import { useLanguage } from '@/context/LanguageContext';

interface AstrologerItem {
  _id: string;
  name: string;
  image: string;
  specialty: string;
  experience: number;
  phone: string;
  email: string;
}

export default function AstrologersPage() {
  const [astrologers, setAstrologers] = useState<AstrologerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchAstrologers() {
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
    }
    fetchAstrologers();
  }, []);

  if (loading) {
    return <DetailedPageSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">
          {t('ஜோதிட நிபுணர்கள்')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-950 font-sans tracking-wide">
          {t('எம்முடைய தகுதி வாய்ந்த ஜோதிடர்கள் (Astrologers)')}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 mx-auto mt-4 rounded-full"></div>
        <p className="text-stone-500 text-sm max-w-md mx-auto mt-4 leading-relaxed">
          {t('உங்கள் வாழ்வின் அனைத்து பிரச்சனைகளுக்கும் எங்கள் அனுபவம் வாய்ந்த ஜோதிட நிபுணர்களிடம் கலந்தாலோசித்து சிறந்த தீர்வு பெறலாம்.')}
        </p>
      </div>

      {/* Grid of Astrologers */}
      {astrologers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center text-stone-500 border border-stone-100 max-w-md mx-auto">
          {t('தற்சமயம் ஜோதிடர்கள் யாரும் பதிவிடப்படவில்லை.')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {astrologers.map((astrologer) => (
            <motion.div
              key={astrologer._id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-md border border-amber-100 overflow-hidden flex flex-col justify-between group transition-all duration-300"
            >
              {/* Profile Top Half */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  {/* Photo */}
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-md shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={astrologer.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                      alt={t(astrologer.name)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-amber-950 text-lg group-hover:text-orange-600 transition">
                      {t(astrologer.name)}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                      <CheckCircle className="w-3 h-3" />
                      {t('சரிபார்க்கப்பட்டது')}
                    </span>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4 space-y-2">
                  <p className="text-sm text-stone-700 font-medium">
                    <span className="font-bold text-amber-900">{t('சிறப்புத் துறை:')}</span> {t(astrologer.specialty)}
                  </p>
                  <p className="text-sm text-stone-600 flex items-center gap-1.5 font-semibold">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>{t('அனுபவம்:')} {astrologer.experience} {t('ஆண்டுகள்')}</span>
                  </p>
                </div>
              </div>

              {/* Action/Contact Footer */}
              <div className="bg-amber-50/50 px-6 py-4 border-t border-amber-100 flex flex-col sm:flex-row gap-2 justify-between items-center text-sm font-bold text-amber-950">
                {astrologer.phone && (
                  <a 
                    href={`tel:${astrologer.phone}`}
                    className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 rounded-full border border-amber-200 bg-white hover:bg-amber-100 transition duration-150 text-stone-700 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('அழைக்க')}</span>
                  </a>
                )}
                {astrologer.email && (
                  <a 
                    href={`mailto:${astrologer.email}`}
                    className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 rounded-full bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 text-white shadow-sm transition duration-150 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{t('கலந்தாலோசிக்க')}</span>
                  </a>
                )}
              </div>

            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
