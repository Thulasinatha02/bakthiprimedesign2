import { NextResponse } from 'next/server';
import Video from '@/models/Video';
import { isAuthenticated } from '@/lib/authHelper';
import { withDb } from '@/lib/withDb';

interface Params {
  params: Promise<{ id: string }>;
}

export const GET = withDb(async (request: Request, { params }: Params) => {
  try {
    const { id } = await params;
    const video = await Video.findById(id);

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: video });
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

    const updatedVideo = await Video.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedVideo) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedVideo });
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
    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Video deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});
