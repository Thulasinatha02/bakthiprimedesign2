import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Comment from '@/models/Comment';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const targetKey = searchParams.get('targetKey');
    const targetType = searchParams.get('targetType');

    if (!targetKey || !targetType) {
      return NextResponse.json({ error: 'Missing targetKey or targetType parameters' }, { status: 400 });
    }

    const comments = await Comment.find({ targetKey, targetType }).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, count: comments.length, data: comments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, content, targetKey, targetType } = body;

    if (!name || !content || !targetKey || !targetType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newComment = await Comment.create({
      name: name.trim(),
      content: content.trim(),
      targetKey,
      targetType
    });

    return NextResponse.json({ success: true, data: newComment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
