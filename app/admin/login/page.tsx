'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, RefreshCw, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();
      if (json.success) {
        router.push('/admin/dashboard');
      } else {
        setError(json.error || 'உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.');
      }
    } catch (err) {
      setError('இணைப்பு பிழை. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-950 via-orange-950 to-yellow-950 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative Golden Background Glow halos */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-[120px]"></div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-yellow-500/20"
      >
        {/* Animated Diya at the Top of Login Card */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-20 h-20 overflow-hidden rounded-full border-2 border-yellow-500/20 shadow-lg bg-amber-950">
            <img
              src="/images/logo.jpg"
              alt="Bakthi Prime Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-amber-200 mt-4 tracking-wide font-sans gold-glow-text">
            Bakthi Prime Admin
          </h1>
          <p className="text-stone-300 text-xs mt-1 font-semibold">நிருவாக கட்டுப்பாட்டு தளம்</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3.5 bg-red-950/40 border border-red-500/30 rounded-xl text-red-200 text-xs font-bold mb-5 flex items-center gap-2"
          >
            <span>⚠️</span>
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider">
              பயனர் பெயர் (Username)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                disabled={loading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="எ.கா: admin"
                className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 pl-10 pr-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-200/40" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider">
              கடவுச்சொல் (Password)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 text-amber-100 placeholder-amber-200/20 pl-10 pr-4 py-3 rounded-xl border border-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-200/40" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-amber-950 font-extrabold rounded-xl shadow-lg border border-yellow-300/30 tracking-wide transition duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>உள்நுழைகிறது...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>உள்நுழை (Login)</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] text-amber-200/30 border-t border-amber-900/40 pt-4 font-semibold">
          பாதுகாக்கப்பட்ட வலைப் பக்கம். அனுமதியின்றி நுழையக் கூடாது.
        </div>
      </motion.div>
    </div>
  );
}
