import { NextResponse } from 'next/server';
import SpiritualPost from '@/models/SpiritualPost';
import { isAuthenticated } from '@/lib/authHelper';
import { withDb } from '@/lib/withDb';

export const GET = withDb(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const query: any = {};
    if (category && category !== 'all') query.category = category;

    const posts = await SpiritualPost.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: posts.length, data: posts });
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
    const { title, content, category, image } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPost = await SpiritualPost.create({ title, content, category, image });
    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});
