'use client';

import { useState, useEffect, use, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Sparkles, RefreshCw, MessageSquare, Video, Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const rasisList = [
  { name: 'மேஷம்', key: 'aries', symbol: '♈' },
  { name: 'ரிஷபம்', key: 'taurus', symbol: '♉' },
  { name: 'மிதுனம்', key: 'gemini', symbol: '♊' },
  { name: 'கடகம்', key: 'cancer', symbol: '♋' },
  { name: 'சிம்மம்', key: 'leo', symbol: '♌' },
  { name: 'கன்னி', key: 'virgo', symbol: '♍' },
  { name: 'துலாம்', key: 'libra', symbol: '♎' },
  { name: 'விருச்சிகம்', key: 'scorpio', symbol: '♏' },
  { name: 'தனுசு', key: 'sagittarius', symbol: '♐' },
  { name: 'மகரம்', key: 'capricorn', symbol: '♑' },
  { name: 'கும்பம்', key: 'aquarius', symbol: '♒' },
  { name: 'மீனம்', key: 'pisces', symbol: '♓' }
];

interface PredictionItem {
  _id: string;
  rasi: string;
  rasiKey: string;
  prediction: string;
  type: string;
  date: string;
  youtubeUrl?: string;
}

interface PuthanduContentProps {
  type: string;
}

function PuthanduContent({ type }: PuthanduContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language } = useLanguage();

  const selectedRasiKey = searchParams.get('rasi') || 'aries';
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Comments state
  const [comments, setComments] = useState<any[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const targetType = `puthandu_${type}`;

  const typeTitles: Record<string, string> = {
    tamil: t('தமிழ்ப் புத்தாண்டு'),
    english: t('ஆங்கிலப் புத்தாண்டு')
  };

  useEffect(() => {
    async function fetchPredictions() {
      setLoading(true);
      try {
        const res = await fetch(`/api/rasipalan?type=${targetType}`);
        const json = await res.json();
        if (json.success) {
          setPredictions(json.data);
        }
      } catch (error) {
        console.error('Error fetching puthandu horoscopes:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPredictions();
  }, [targetType]);

  // Fetch comments when rasi key changes
  useEffect(() => {
    async function fetchComments() {
      setCommentsLoading(true);
      try {
        const res = await fetch(`/api/comments?targetKey=${selectedRasiKey}&targetType=${targetType}`);
        const json = await res.json();
        if (json.success) {
          setComments(json.data);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setCommentsLoading(false);
      }
    }
    fetchComments();
  }, [selectedRasiKey, targetType]);

  const activePrediction = predictions.find(p => p.rasiKey === selectedRasiKey);
  const activeRasiInfo = rasisList.find(r => r.key === selectedRasiKey);

  const handleRasiSelect = (key: string) => {
    router.push(`/rasipalan/puthandu/${type}?rasi=${key}`);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentContent.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: commentName,
          content: commentContent,
          targetKey: selectedRasiKey,
          targetType: targetType
        })
      });
      const json = await res.json();
      if (json.success) {
        setComments([...comments, json.data]);
        setCommentContent('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">
          {t('கோள்களின் கணிப்பு')}
        </span>
        <h1 className="text-3xl font-extrabold text-amber-950 font-sans tracking-wide">
          {typeTitles[type] || t('ராசிபலன்')}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Rasi Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 bg-amber-50/45 p-3 rounded-2xl border border-amber-100/50">
        {rasisList.map((rasi) => {
          const isActive = rasi.key === selectedRasiKey;
          return (
            <button
              key={rasi.key}
              onClick={() => handleRasiSelect(rasi.key)}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition duration-200 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-red-700 to-orange-600 text-white shadow-md'
                  : 'bg-white text-amber-950 hover:bg-amber-50 border border-amber-900/10'
              }`}
            >
              <img
                src={`/images/${rasisList.findIndex(r => r.key === rasi.key) + 1}.jpg`}
                alt={rasi.name}
                className="w-5 h-5 rounded-full object-cover border border-amber-200"
              />
              <span>{rasi.name}</span>
            </button>
          );
        })}
      </div>

      {/* Prediction display */}
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="bg-white rounded-3xl shadow-md border border-amber-100 p-12 text-center flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
              <p className="text-sm text-stone-500">விவரங்கள் சேகரிக்கப்படுகின்றன...</p>
            </div>
          ) : activePrediction ? (
            <motion.div
              key={selectedRasiKey}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl shadow-lg border border-amber-150 p-6 sm:p-10 space-y-6 relative overflow-hidden"
            >
              {/* Background watermark image */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-[0.03] pointer-events-none select-none">
                <img
                  src={`/images/${rasisList.findIndex(r => r.key === selectedRasiKey) + 1}.jpg`}
                  alt=""
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div className="flex items-center gap-4 border-b border-stone-100 pb-5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-amber-250 shadow-md bg-amber-50">
                  <img
                    src={`/images/${rasisList.findIndex(r => r.key === selectedRasiKey) + 1}.jpg`}
                    alt={activeRasiInfo?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-amber-950 font-sans">
                    {activeRasiInfo?.name} {t('ராசிபலன்')}
                  </h2>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mt-0.5">
                    {selectedRasiKey}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 w-fit px-3 py-1.5 rounded-full">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>வருடம்: {activePrediction.date}</span>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="font-extrabold text-amber-900 text-base flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>{t('பலன்கள் & பரிகாரங்கள்')}</span>
                </h3>
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                  {activePrediction.prediction}
                </p>
              </div>

              {/* YouTube Video Horoscope */}
              {activePrediction.youtubeUrl && (
                <div className="space-y-4 pt-6 border-t border-stone-100">
                  <h3 className="font-extrabold text-amber-900 text-base flex items-center gap-1.5">
                    <Video className="w-5 h-5 text-amber-500" />
                    <span>{t('வீடியோ பலன் கணிப்பு')}</span>
                  </h3>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-amber-900/10 shadow-md bg-stone-900">
                    <iframe
                      src={activePrediction.youtubeUrl}
                      title={`${activeRasiInfo?.name} Video Horoscope`}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="space-y-6 pt-6 border-t border-stone-100">
                <h3 className="font-extrabold text-amber-900 text-base flex items-center gap-1.5">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  <span>{t('கருத்துகள்')} ({comments.length})</span>
                </h3>

                {/* Comments List */}
                <div className="space-y-4">
                  {commentsLoading ? (
                    <div className="text-center text-xs text-stone-400 py-4">{t('காணொளிகள் ஏற்றப்படுகின்றன...')}</div>
                  ) : comments.length === 0 ? (
                    <div className="text-center text-xs text-stone-400 py-6 border border-dashed border-stone-200 rounded-xl bg-stone-50/50">
                      {t('முதல் கருத்தைப் பதியுங்கள்!')}
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {comments.map((comment) => (
                        <div key={comment._id} className="p-4 rounded-xl bg-amber-50/20 border border-amber-900/5 space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-extrabold text-amber-950">{comment.name}</span>
                            <span className="text-stone-400 text-[10px] font-semibold">
                              {new Date(comment.createdAt).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-stone-700 font-medium leading-relaxed">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="space-y-3">
                  <h4 className="font-extrabold text-xs text-amber-950 uppercase tracking-wider">{t('கருத்து எழுதவும்')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder={t('பெயர் (Name)')}
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      required
                      className="w-full bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 px-3.5 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="relative flex items-center">
                    <textarea
                      placeholder={t('கருத்து (Comment)')}
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      required
                      rows={3}
                      className="w-full bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none pr-12"
                    />
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="absolute right-3 bottom-3 p-2 rounded-lg bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Alert note */}
              <div className="bg-stone-50 border border-stone-150 rounded-xl p-4 text-[11px] text-stone-505 leading-relaxed font-semibold">
                {t('குறிப்பு: இங்கு கூறப்பட்டுள்ள பலன்கள் பொதுவானவை.')}
              </div>

            </motion.div>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200 border-dashed p-12 text-center text-stone-500">
              {t('தற்சமயம் பலன்கள் பதிவிடப்படவில்லை.')}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface Props {
  params: Promise<{ type: string }>;
}

export default function PuthanduPage({ params }: Props) {
  const { type } = use(params);

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    }>
      <PuthanduContent type={type} />
    </Suspense>
  );
}
