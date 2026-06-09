import BreakingNewsTicker from '@/components/BreakingNewsTicker';
import HeroSlider from '@/components/HeroSlider';
import ImportantNewsSection from '@/components/ImportantNewsSection';
import LatestNewsSlider from '@/components/LatestNewsSlider';

import RasiGrid from '@/components/RasiGrid';

export default function HomePage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Breaking News Ticker */}
      <BreakingNewsTicker />

      {/* Hero Slider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <HeroSlider />
      </div>

      {/* Important News Feed */}
      <ImportantNewsSection />

      {/* Latest News Slider */}
      <LatestNewsSlider />





      {/* Zodiac 12 Rasi Palan Section */}
      <RasiGrid />
    </div>
  );
}

