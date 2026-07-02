'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Trash2, Award, Phone, Mail } from 'lucide-react';

interface ApplicationItem {
  _id: string;
  name: string;
  image: string;
  specialty: string;
  experience: number;
  phone: string;
  email: string;
  createdAt: string;
}

export default function AdminAstrologerApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/astrologer-applications');
      const json = await res.json();
      if (json.success) {
        setApplications(json.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('இந்த விண்ணப்பத்தை நீக்க வேண்டுமா? (Delete this application?)')) return;

    try {
      const res = await fetch(`/api/astrologer-applications/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchApplications();
      } else {
        alert(json.error || 'நீக்க முடியவில்லை. (Failed to delete)');
      }
    } catch (error) {
      alert('இணைப்புப் பிழை. (Connection Error)');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-amber-900/30 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-200 tracking-wide font-sans gold-glow-text">
            ஜோதிடர் விண்ணப்பங்கள் (Interview Applications)
          </h1>
          <p className="text-stone-400 text-xs mt-1 font-semibold">
            நேர்காணலுக்காக விண்ணப்பித்துள்ள புதிய ஜோதிடர்களின் விவரங்கள். (These applicants are NOT shown to the public.)
          </p>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="text-center py-12 text-stone-400 font-bold animate-pulse text-sm">
          விண்ணப்பங்கள் ஏற்றப்படுகின்றன... (Loading...)
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-stone-500 text-sm max-w-md">
          புதிய விண்ணப்பங்கள் எதுவும் இல்லை. (No new applications.)
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <motion.div
              key={app._id}
              className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-blue-500/10 hover:border-blue-500/30 relative"
            >
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl uppercase tracking-wider">
                புதியது (New)
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-amber-400/40 shrink-0 bg-stone-900 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {app.image && !app.image.startsWith('data:application') ? (
                      <img
                        src={app.image}
                        alt={app.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-6 h-6 text-stone-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm leading-snug">{app.name}</h3>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{app.specialty}</p>
                  </div>
                </div>

                <div className="text-xs text-stone-400 font-semibold space-y-2 pt-2 border-t border-amber-900/10">
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>அனுபவம் (Experience): {app.experience} ஆண்டுகள்</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{app.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{app.email || 'N/A'}</span>
                  </div>
                  {app.image && (
                    <div className="pt-2">
                      <a href={app.image} download={`document-${app.name}`} className="text-[10px] text-blue-400 hover:underline font-bold bg-blue-900/20 px-2 py-1 rounded inline-block">
                        கோப்பை தரவிறக்க (Download File)
                      </a>
                    </div>
                  )}
                  <div className="text-[9px] text-stone-500 pt-2">
                    விண்ணப்பித்த தேதி: {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 border-t border-amber-900/20 mt-4 pt-3">
                <button
                  onClick={() => handleDelete(app._id)}
                  className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400 transition cursor-pointer flex items-center gap-1 text-[10px] font-bold uppercase"
                  title="நீக்கு (Delete)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>விண்ணப்பத்தை நீக்கு</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
