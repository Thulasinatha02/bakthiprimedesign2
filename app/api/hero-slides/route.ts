import { NextResponse } from 'next/server';
import HeroSlide from '@/models/HeroSlide';
import { isAuthenticated } from '@/lib/authHelper';
import { withDb } from '@/lib/withDb';

function extractYoutubeVideoId(url: string): string {
  if (!url) return '';
  const cleanUrl = url.trim();
  const shortsMatch = cleanUrl.match(/youtube\.com\/shorts\/([^?&/]+)/);
  if (shortsMatch) return shortsMatch[1];
  const liveMatch = cleanUrl.match(/youtube\.com\/live\/([^?&/]+)/);
  if (liveMatch) return liveMatch[1];
  const embedMatch = cleanUrl.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (embedMatch) return embedMatch[1];
  const watchMatch = cleanUrl.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = cleanUrl.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch) return shortMatch[1];
  const mobileMatch = cleanUrl.match(/m\.youtube\.com\/watch\?v=([^&]+)/);
  if (mobileMatch) return mobileMatch[1];
  return '';
}

export const GET = withDb(async () => {
  try {
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, count: slides.length, data: slides });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});

export const POST = withDb(async (request: Request) => {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    let { title, description, badge, image, youtubeUrl, order, isActive } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    let youtubeVideoId = '';
    if (youtubeUrl) {
      youtubeVideoId = extractYoutubeVideoId(youtubeUrl);
      if (!image && youtubeVideoId) {
        image = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
      }
    }

    const newSlide = await HeroSlide.create({
      title,
      description: description || '',
      badge: badge || '',
      image: image || '',
      youtubeUrl: youtubeUrl || '',
      youtubeVideoId,
      order: order ?? 0,
      isActive: isActive !== false,
    });

    return NextResponse.json({ success: true, data: newSlide }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});
