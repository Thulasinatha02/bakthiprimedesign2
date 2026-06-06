import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import News from '@/models/News';
import { isAuthenticated } from '@/lib/authHelper';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 0;
    const search = searchParams.get('search');

    const query: any = {};
    if (category && category !== 'all' && category !== 'முகப்பு') {
      // Map Tamil categories to database equivalents
      const categoryMap: Record<string, string> = {
        'ஆன்மிகம்': 'Spiritual',
        'ஜோதிடம்': 'Astrology',
        'கோவில்': 'Temple',
        'திருவிழா': 'Festival',
        'news': 'News',
        'sports': 'Sports',
        'cinema': 'Cinema',
        'spiritual': 'Spiritual',
        'astrology': 'Astrology',
      };
      
      const mappedCategory = categoryMap[category] || category;
      query.category = mappedCategory;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    let newsQuery = News.find(query).sort({ createdAt: -1 });
    if (limit > 0) {
      newsQuery = newsQuery.limit(limit);
    }

    const news = await newsQuery;
    return NextResponse.json({ success: true, count: news.length, data: news });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { title, content, image, category } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newNews = await News.create({ title, content, image, category });
    return NextResponse.json({ success: true, data: newNews }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
