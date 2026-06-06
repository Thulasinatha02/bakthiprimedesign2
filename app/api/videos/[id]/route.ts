import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Video from '@/models/Video';
import { isAuthenticated } from '@/lib/authHelper';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    await dbConnect();
    const { id } = await params;
    const video = await Video.findById(id);

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: video });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
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
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Video deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
