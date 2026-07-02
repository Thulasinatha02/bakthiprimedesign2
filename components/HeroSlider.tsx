'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  image: string;
  title: string;
  description: string;
  badge: string;
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch('/api/hero-slides');
        const json = await res.json();
        if (json.success) {
          setSlides(json.data);
        } else {
          console.error('Failed to load hero slides');
        }
      } catch (err) {
        console.error('Error fetching hero slides:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Auto slide timer (depends on slides length)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % (slides.length || 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  };

  // Show skeleton while loading — preserves layout height so ImportantNews doesn't jump up
  if (loading || slides.length === 0) {
    return (
      <div className="relative w-full h-[350px] sm:h-[480px] bg-stone-900 overflow-hidden shadow-xl border-b border-amber-900/30 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 space-y-3">
          <div className="h-5 w-24 rounded bg-amber-800/50" />
          <div className="h-10 w-2/3 rounded-lg bg-stone-700/60" />
          <div className="h-4 w-1/2 rounded bg-stone-700/40" />
        </div>
      </div>
    );
  }

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

          {/* Text Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent flex flex-col justify-end p-6 sm:p-12">
            <div className="max-w-3xl space-y-3">
              <span className="inline-block px-3 py-1 rounded bg-amber-500 text-amber-950 text-xs font-bold uppercase tracking-wider">
                {slides[currentIndex].badge}
              </span>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight font-sans tracking-wide gold-glow-text"
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
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentIndex ? 'bg-amber-400 w-6' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
