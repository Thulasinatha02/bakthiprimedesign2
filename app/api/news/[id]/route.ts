import { NextResponse } from 'next/server';
import News from '@/models/News';
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
    const news = await News.findById(id);

    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: news });
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

    const updatedNews = await News.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedNews) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedNews });
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
    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'News deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});
