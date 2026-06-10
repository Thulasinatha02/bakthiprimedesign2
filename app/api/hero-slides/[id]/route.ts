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

interface Params {
  params: Promise<{ id: string }>;
}

export const GET = withDb(async (request: Request, { params }: Params) => {
  try {
    const { id } = await params;
    const slide = await HeroSlide.findById(id);

    if (!slide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: slide });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});

export const PUT = withDb(async (request: Request, { params }: Params) => {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    let { youtubeUrl, image } = body;
    if (youtubeUrl) {
      const youtubeVideoId = extractYoutubeVideoId(youtubeUrl);
      body.youtubeVideoId = youtubeVideoId;
      if (!image && youtubeVideoId) {
        body.image = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
      }
    }

    const updatedSlide = await HeroSlide.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSlide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedSlide });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});

export const DELETE = withDb(async (request: Request, { params }: Params) => {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deletedSlide = await HeroSlide.findByIdAndDelete(id);

    if (!deletedSlide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Slide deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});
