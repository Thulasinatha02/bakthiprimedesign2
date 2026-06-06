'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200',
    title: 'தெய்வீக அருள் பெருகும் பக்தி மார்க்கம்',
    description: 'தினசரி வழிபாடு மற்றும் ஆன்மிக செய்திகளுடன் உங்கள் நாளைத் தொடங்குங்கள்.',
    badge: 'ஆன்மிகம்'
  },
  {
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=1200',
    title: 'பிரபல ஆலயங்களின் தல வரலாறும் தரிசனமும்',
    description: 'தமிழகத்தின் வரலாற்றுச் சிறப்புமிக்க திருத்தலங்களின் அரிய தகவல்கள் மற்றும் தரிசன நேரங்கள்.',
    badge: 'திருத்தலங்கள்'
  },
  {
    image: 'https://images.unsplash.com/photo-1609137982420-b18a56d68ae6?auto=format&fit=crop&q=80&w=1200',
    title: 'துல்லியமான தினசரி ராசிபலன்கள் 2026',
    description: 'உங்கள் ராசிக்கான இன்றைய பலன்கள் மற்றும் பரிகாரங்களை அறிந்து கொள்ளுங்கள்.',
    badge: 'ஜோதிடம்'
  }
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[350px] sm:h-[480px] bg-stone-900 overflow-hidden shadow-xl border-b border-amber-900/30">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Slide Background Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover brightness-[0.4]"
          />

          {/* Slide Text Content Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent flex flex-col justify-end p-6 sm:p-12">
            <div className="max-w-3xl space-y-3">
              <span className="inline-block px-3 py-1 rounded bg-amber-500 text-amber-950 text-xs font-bold uppercase tracking-wider">
                {slides[currentIndex].badge}
              </span>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight font-sans tracking-wide gold-glow-text"
              >
                {slides[currentIndex].title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-stone-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed"
              >
                {slides[currentIndex].description}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 hover:text-amber-300 transition z-10 cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 hover:text-amber-300 transition z-10 cursor-pointer"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentIndex ? 'bg-amber-400 w-6' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
