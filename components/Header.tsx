'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Search, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch('/api/auth/me');
        const json = await res.json();
        setIsAdmin(!!json.authenticated);
      } catch {
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/news?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      setIsOpen(false);
    }
  };

  const navItems = [
    { name: 'முகப்பு', href: '/' },
    { name: 'ஜோதிடர்கள்', href: '/astrologers' },
    { name: 'பொருத்தம்', href: '/porutham' },
    { name: 'ஆன்மிகம்', href: '/spiritual' },
    { name: 'ஜோதிடம்', href: '/astrology' },
    { name: 'கோவில்', href: '/temple' },
    { name: 'திருவிழா', href: '/festival' },
    { name: 'ஏனையவை', href: '/others' },
  ];

  const rasiPalanDropdown = {
    title: 'ராசிபலன்',
    links: [
      { name: 'தினசரி ராசிபலன்', href: '/rasipalan/daily' },
      { name: 'வாராந்திர ராசிபலன்', href: '/rasipalan/weekly' },
      { name: 'மாதாந்திர ராசிபலன்', href: '/rasipalan/monthly' },
      { name: 'குரு பெயர்ச்சி', href: '/rasipalan/peyarchi/guru' },
      { name: 'சனி பெயர்ச்சி', href: '/rasipalan/peyarchi/sani' },
      { name: 'தமிழ்ப் புத்தாண்டு', href: '/rasipalan/puthandu/tamil' },
      { name: 'ஆங்கிலப் புத்தாண்டு', href: '/rasipalan/puthandu/english' },
      { name: 'சுபமுகூர்த்த நாட்கள்', href: '/rasipalan/subamuhurtha-natkal' },
    ],
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-amber-900/95 text-white shadow-lg backdrop-blur-md border-b border-amber-800/50'
        : 'bg-gradient-to-r from-red-800 via-orange-700 to-amber-800 text-white shadow-md'
        }`}
    >
      {/* Decoration line */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />

      <div className="w-full px-3 lg:px-6">
        <div className="flex items-center justify-between h-14 lg:h-16 gap-2">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 overflow-hidden rounded-full border border-amber-300 shadow-md flex-shrink-0">
              <img
                src="/images/logo.jpg"
                alt="Bakthi Prime Logo"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
            </div>
            <span className="font-extrabold text-base lg:text-lg tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-amber-100 via-yellow-200 to-white whitespace-nowrap">
              Bakthi Prime
            </span>
          </Link>

          {/* ── Desktop Nav (lg+) ── */}
          <nav className="hidden lg:flex items-center flex-1 justify-center">
            <div className="flex items-center gap-0.5 xl:gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-2 xl:px-3 py-1.5 rounded-md text-xs xl:text-sm font-semibold hover:bg-white/10 hover:text-white transition duration-200 whitespace-nowrap"
                >
                  {t(item.name)}
                </Link>
              ))}

              {/* Rasi Palan Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('rasi')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-0.5 px-2 xl:px-3 py-1.5 rounded-md text-xs xl:text-sm font-semibold hover:bg-white/10 hover:text-white transition duration-200 cursor-pointer whitespace-nowrap">
                  <span>{t(rasiPalanDropdown.title)}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'rasi' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-1 w-52 rounded-md shadow-2xl bg-amber-950 text-white border border-amber-700/50 py-1.5 z-50"
                    >
                      {rasiPalanDropdown.links.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className="block px-4 py-2 text-xs text-amber-100 hover:bg-amber-800 hover:text-white transition duration-150"
                        >
                          {t(link.name)}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </nav>

          {/* ── Desktop Right Controls (lg+) ── */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">

            {/* Apply as Astrologer Button */}
            <Link
              href="/astrologers/apply"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-md transition border border-amber-300/50"
            >
              <span>{t('ஜோதிடராக இணைய')}</span>
            </Link>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'ta' ? 'en' : 'ta')}
              className="flex items-center gap-1 px-2 py-1.5 rounded-full text-[11px] font-bold bg-white/10 text-white hover:bg-white/20 transition border border-white/15 whitespace-nowrap"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{language === 'ta' ? 'English' : 'தமிழ்'}</span>
            </button>

            {/* Search — icon only, expands on click */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {searchOpen && (
                  <motion.form
                    onSubmit={handleSearchSubmit}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 180, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mr-1"
                  >
                    <input
                      autoFocus
                      type="text"
                      placeholder={t('தேடுக...')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                      className="w-full bg-white/10 text-white placeholder-amber-200/60 px-3 py-1.5 rounded-full text-xs border border-white/20 focus:outline-none focus:ring-1 focus:ring-amber-300"
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/15"
              >
                <Search className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Admin / Dashboard */}

          </div>

          {/* ── Mobile / Tablet right bar ── */}
          <div className="lg:hidden flex items-center gap-1.5">
            <button
              onClick={() => setLanguage(language === 'ta' ? 'en' : 'ta')}
              className="flex items-center gap-1 px-2 py-1.5 rounded-full text-[10px] font-bold bg-white/10 text-white hover:bg-white/20 transition border border-white/10"
            >
              <Globe className="w-3 h-3" />
              <span>{language === 'ta' ? 'EN' : 'தமிழ்'}</span>
            </button>


            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-md text-white hover:bg-white/10 focus:outline-none transition"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile Slide-out Menu ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-amber-950 border-t border-amber-800 text-white overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative mt-2">
                <input
                  type="text"
                  placeholder={t('தேடுக...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 text-white placeholder-amber-200/50 pl-9 pr-4 py-2 rounded-md text-sm border border-white/20 focus:outline-none"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-amber-200/50" />
              </form>

              {/* Nav Links */}
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-base font-medium hover:bg-amber-800 transition"
                  >
                    {t(item.name)}
                  </Link>
                ))}
                
                {/* Apply Link (Mobile) */}
                <Link
                  href="/astrologers/apply"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-base font-bold bg-amber-900/50 text-amber-300 hover:bg-amber-800 transition border border-amber-700/50"
                >
                  {t('ஜோதிடராக இணைய (Apply)')}
                </Link>
              </div>

              {/* Rasi Palan */}
              <div className="border-t border-amber-800/80 pt-3">
                <div className="px-3 py-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {t(rasiPalanDropdown.title)}
                </div>
                <div className="mt-1 grid grid-cols-2 gap-1 px-1">
                  {rasiPalanDropdown.links.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-md text-sm text-amber-100 hover:bg-amber-800 hover:text-white transition"
                    >
                      {t(link.name)}
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}