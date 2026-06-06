'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Star, Heart } from 'lucide-react';

const muhurthamDays = [
  {
    month: 'ஜூன் 2026 (வைகாசி - ஆனி)',
    dates: [
      { day: 'ஜூன் 07, ஞாயிறு', tithi: 'வைகாசி 24, வளர்பிறை துவிதியை', nakshatra: 'மிருகசீரிடம்', time: 'காலை 06:15 - 07:15', type: 'சுபமுகூர்த்தம்' },
      { day: 'ஜூன் 11, வியாழன்', tithi: 'வைகாசி 28, வளர்பிறை பஞ்சமி', nakshatra: 'பூசம்', time: 'காலை 09:00 - 10:30', type: 'சுபமுகூர்த்தம்' },
      { day: 'ஜூன் 24, புதன்', tithi: 'ஆனி 10, வளர்பிறை நவமி', nakshatra: 'சித்திரை', time: 'காலை 06:00 - 07:30', type: 'சுபமுகூர்த்தம்' }
    ]
  },
  {
    month: 'ஜூலை 2026 (ஆனி - ஆடி)',
    dates: [
      { day: 'ஜூலை 05, ஞாயிறு', tithi: 'ஆனி 21, தேய்பிறை பஞ்சமி', nakshatra: 'சதயம்', time: 'காலை 07:30 - 09:00', type: 'சுபமுகூர்த்தம்' },
      { day: 'ஜூலை 15, புதன்', tithi: 'ஆனி 31, வளர்பிறை பிரதமை', nakshatra: 'புனர்பூசம்', time: 'காலை 09:15 - 10:15', type: 'சுபமுகூர்த்தம்' },
      { day: 'ஜூலை 29, புதன்', tithi: 'ஆடி 14, வளர்பிறை பௌர்ணமி', nakshatra: 'உத்திராடம்', time: 'காலை 06:00 - 07:30', type: 'சுபமுகூர்த்தம்' }
    ]
  },
  {
    month: 'ஆகஸ்ட் 2026 (ஆடி - ஆவணி)',
    dates: [
      { day: 'ஆகஸ்ட் 14, வெள்ளி', tithi: 'ஆவணி 29, வளர்பிறை துவிதியை', nakshatra: 'பூரம்', time: 'காலை 09:15 - 10:45', type: 'சுபமுகூர்த்தம்' },
      { day: 'ஆகஸ்ட் 27, வியாழன்', tithi: 'ஆவணி 11, வளர்பிறை சதுர்த்தசி', nakshatra: 'அவிட்டம்', time: 'காலை 06:15 - 07:45', type: 'சுபமுகூர்த்தம்' }
    ]
  }
];

export default function SubamuhurthaNatkalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6">
      
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex p-3 bg-amber-50 text-amber-600 rounded-full mb-3 border border-amber-100">
          <Star className="w-6 h-6 animate-spin-slow text-amber-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-amber-950 font-sans tracking-wide">
          சுபமுகூர்த்த நாட்கள் 2026 (Auspicious Days)
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 mx-auto mt-3 rounded-full"></div>
        <p className="text-stone-500 text-sm max-w-md mx-auto mt-3">
          திருமணம், கிரகப்பிரவேசம் மற்றும் புதிய தொழில்கள் தொடங்க உகந்த சுபமுகூர்த்த நாட்கள் மற்றும் நல்ல நேரங்கள்.
        </p>
      </div>

      {/* Muhurtham Months List */}
      <div className="space-y-10">
        {muhurthamDays.map((section, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={section.month} 
            className="bg-white rounded-2xl shadow-md border border-amber-100/70 overflow-hidden"
          >
            {/* Month Header Banner */}
            <div className="bg-gradient-to-r from-amber-800 to-orange-700 text-gold-100 px-6 py-4 font-extrabold font-sans flex items-center justify-between">
              <span className="text-base sm:text-lg">{section.month}</span>
              <Calendar className="w-5 h-5 opacity-85" />
            </div>

            {/* Dates list */}
            <div className="divide-y divide-stone-100">
              {section.dates.map((item, dIdx) => (
                <div key={dIdx} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-amber-50/10 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-bold">
                        {item.type}
                      </span>
                      <h3 className="font-extrabold text-amber-950 text-base sm:text-lg">{item.day}</h3>
                    </div>
                    <p className="text-xs text-stone-600 font-semibold">{item.tithi}</p>
                    <p className="text-xs text-stone-400 font-medium">நட்சத்திரம்: {item.nakshatra}</p>
                  </div>
                  
                  {/* Time Badge */}
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100 text-xs sm:text-sm text-amber-900 font-extrabold shrink-0">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tip alert */}
      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-xs text-stone-500 leading-relaxed font-semibold">
        💡 குறிப்பு: மேலே கொடுக்கப்பட்டுள்ள சுப நாட்கள் பொதுவான பஞ்சாங்க கணிப்பு ஆகும். குடும்பத்தில் சுப காரியங்களை முடிவு செய்வதற்கு முன் உங்களது குடும்ப புரோகிதர் அல்லது அனுபவமிக்க ஜோதிடரை அணுகி ஆலோசிப்பது உகந்தது.
      </div>

    </div>
  );
}
