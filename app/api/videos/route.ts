import { NextResponse } from 'next/server';
import Video from '@/models/Video';
import { isAuthenticated } from '@/lib/authHelper';
import { withDb } from '@/lib/withDb';

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
    const { title, youtubeUrl, description, thumbnail } = body;

    if (!title || !youtubeUrl) {
      return NextResponse.json({ error: 'Title and YouTube URL are required' }, { status: 400 });
    }

    const newVideo = await Video.create({ title, youtubeUrl, description, thumbnail });
    return NextResponse.json({ success: true, data: newVideo }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});
