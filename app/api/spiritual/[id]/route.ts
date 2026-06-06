import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import SpiritualPost from '@/models/SpiritualPost';
import { isAuthenticated } from '@/lib/authHelper';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    await dbConnect();
    const { id } = await params;
    const post = await SpiritualPost.findById(id);

    if (!post) {
      return NextResponse.json({ error: 'Spiritual post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
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
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const deletedPost = await SpiritualPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json({ error: 'Spiritual post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Spiritual post deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
