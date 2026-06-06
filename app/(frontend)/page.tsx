import BreakingNewsTicker from '@/components/BreakingNewsTicker';
import HeroNewsSection from '@/components/HeroNewsSection';
import VideoSection from '@/components/VideoSection';
import RasiGrid from '@/components/RasiGrid';

export default function HomePage() {
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Breaking News Ticker */}
      <BreakingNewsTicker />

      {/* 2. Hero & News Category Section */}
      <HeroNewsSection />

      {/* 3. Zodiac 12 Rasi Palan Section */}
      <RasiGrid />

      {/* 4. Devotional Video Section */}
      <VideoSection />
    </div>
  );
}
