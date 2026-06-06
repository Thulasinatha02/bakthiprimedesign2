import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import News from '@/models/News';
import { isAuthenticated } from '@/lib/authHelper';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    await dbConnect();
    const { id } = await params;
    const newsItem = await News.findById(id);

    if (!newsItem) {
      return NextResponse.json({ error: 'News article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: newsItem });
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

    const updatedNews = await News.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedNews) {
      return NextResponse.json({ error: 'News article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedNews });
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
    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
      return NextResponse.json({ error: 'News article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'News article deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
