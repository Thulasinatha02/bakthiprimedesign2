import { NextResponse } from 'next/server';
import SpiritualPost from '@/models/SpiritualPost';
import { isAuthenticated } from '@/lib/authHelper';
import { withDb } from '@/lib/withDb';

interface Params {
  params: Promise<{ id: string }>;
}

export const GET = withDb(async (request: Request, { params }: Params) => {
  try {
    const { id } = await params;
    const post = await SpiritualPost.findById(id);

    if (!post) {
      return NextResponse.json({ error: 'Spiritual post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
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

    const updatedPost = await SpiritualPost.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
      return NextResponse.json({ error: 'Spiritual post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedPost });
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
    const deletedPost = await SpiritualPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json({ error: 'Spiritual post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Spiritual post deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});
