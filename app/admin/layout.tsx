'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Newspaper, Video, Users, 
  MapPin, Calendar, LogOut, Home, KeyRound, Sparkles
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    async function checkAuth() {
      if (isLoginPage) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch('/api/auth/me');
        const json = await res.json();
        
        if (json.authenticated) {
          setIsAuthenticated(true);
          setAdminUser(json.username || 'Admin');
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { name: 'கட்டுப்பாட்டு பலகை (Dashboard)', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'செய்திகள் (News)', href: '/admin/news', icon: Newspaper },
    { name: 'வீடியோக்கள் (Videos)', href: '/admin/videos', icon: Video },
    { name: 'ராசிபலன் (Rasi Palan)', href: '/admin/rasipalan', icon: Sparkles },
    { name: 'ஜோதிடர்கள் (Astrologers)', href: '/admin/astrologers', icon: Users },
    { name: 'கோவில்கள் (Temples)', href: '/admin/temples', icon: MapPin },
    { name: 'திருவிழாக்கள் (Festivals)', href: '/admin/festivals', icon: Calendar },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-red-950 text-gold-100 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 overflow-hidden rounded-full border border-amber-300 shadow-md">
          <img
            src="/images/logo.jpg"
            alt="Bakthi Prime Logo"
            className="w-full h-full object-cover animate-pulse"
          />
        </div>
        <p className="text-sm font-bold tracking-widest uppercase text-yellow-400 animate-pulse">
          அனுமதி சரிபார்க்கப்படுகிறது...
        </p>
      </div>
    );
  }

  // Login Page rendering
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-amber-950 to-orange-950 text-stone-100 flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-amber-950/70 border-b md:border-b-0 md:border-r border-amber-900/40 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo & Diya */}
          <div className="flex items-center gap-2 pb-5 border-b border-amber-900/30">
            <div className="w-8 h-8 overflow-hidden rounded-full border border-amber-800 shadow-md bg-amber-950">
              <img
                src="/images/logo.jpg"
                alt="Bakthi Prime Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-amber-100 via-yellow-200 to-white">
                Admin Panel
              </span>
              <span className="block text-[10px] text-amber-400/80 font-bold uppercase tracking-widest">Bakthi Prime</span>
              {adminUser && (
                <span className="block text-[9px] text-emerald-450 font-extrabold tracking-wide mt-1 bg-emerald-950/45 px-2 py-0.5 rounded border border-emerald-500/20 w-fit">
                  ● {adminUser}
                </span>
              )}
            </div>
          </div>

          {/* Menus */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 ${
                    isActive 
                      ? 'bg-amber-400 text-amber-950 shadow-md font-extrabold' 
                      : 'hover:bg-white/5 text-amber-200 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-amber-900/30 space-y-2 mt-6">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-amber-300 hover:bg-white/5 hover:text-white transition"
          >
            <Home className="w-4 h-4" />
            <span>இணையதளம் (Live Site)</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>வெளியேறு (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Admin Workspace Content */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>

    </div>
  );
}
