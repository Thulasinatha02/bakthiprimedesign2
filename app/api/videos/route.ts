import { NextResponse } from 'next/server';
import Video from '@/models/Video';
import { isAuthenticated } from '@/lib/authHelper';
import { withDb } from '@/lib/withDb';

/**
 * Extracts a YouTube video ID from any valid YouTube URL format.
 */
function extractVideoId(url: string): string {
  if (!url) return '';

  const embedMatch = url.match(/youtube\.com\/embed\/([^?&#]+)/);
  if (embedMatch) return embedMatch[1];

  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&#]+)/);
  if (shortsMatch) return shortsMatch[1];

  const watchMatch = url.match(/[?&]v=([^&#]+)/);
  if (watchMatch) return watchMatch[1];

  const shortMatch = url.match(/youtu\.be\/([^?&#]+)/);
  if (shortMatch) return shortMatch[1];

  const mobileMatch = url.match(/m\.youtube\.com\/watch\?v=([^&#]+)/);
  if (mobileMatch) return mobileMatch[1];

  return '';
}

/** Auto-generate YouTube thumbnail URL from a video URL */
function autoThumbnail(url: string): string {
  const id = extractVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

export const GET = withDb(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 0;

    let videoQuery = Video.find().sort({ createdAt: -1 });
    if (limit > 0) videoQuery = videoQuery.limit(limit);

    const videos = await videoQuery;
    return NextResponse.json({ success: true, count: videos.length, data: videos });
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
    const { title, youtubeUrl, description } = body;

    if (!title || !youtubeUrl) {
      return NextResponse.json({ error: 'Title and YouTube URL are required' }, { status: 400 });
    }

    // Auto-generate thumbnail from YouTube URL if not provided
    const thumbnail = body.thumbnail || autoThumbnail(youtubeUrl);

    const newVideo = await Video.create({ title, youtubeUrl, description, thumbnail });
    return NextResponse.json({ success: true, data: newVideo }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});
