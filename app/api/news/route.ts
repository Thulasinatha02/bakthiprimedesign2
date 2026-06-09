import { NextResponse } from 'next/server';
import News from '@/models/News';
import { isAuthenticated } from '@/lib/authHelper';
import { withDb } from '@/lib/withDb';

function extractYoutubeVideoId(url: string): string {
  if (!url) return '';
  const cleanUrl = url.trim();
  const shortsMatch = cleanUrl.match(/youtube\.com\/shorts\/([^?&/]+)/);
  if (shortsMatch) return shortsMatch[1];
  const liveMatch = cleanUrl.match(/youtube\.com\/live\/([^?&/]+)/);
  if (liveMatch) return liveMatch[1];
  const embedMatch = cleanUrl.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (embedMatch) return embedMatch[1];
  const watchMatch = cleanUrl.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = cleanUrl.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch) return shortMatch[1];
  const mobileMatch = cleanUrl.match(/m\.youtube\.com\/watch\?v=([^&]+)/);
  if (mobileMatch) return mobileMatch[1];
  return '';
}

export const GET = withDb(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 0;
    const search = searchParams.get('search');
    const isImportant = searchParams.get('isImportant');
    const isLatest = searchParams.get('isLatest');
    const hasVideo = searchParams.get('hasVideo');

    const query: any = {};

    // Filter by Category
    if (category && category !== 'all' && category !== 'அனைத்து' && category !== 'அனைத்தும்' && category !== 'முகப்பு') {
      const categoryMap: Record<string, string> = {
        'விளையாட்டு': 'Sports',
        'அரசியல்': 'Politics',
        'கல்வி': 'Education',
        'ஆன்மீகம்': 'Spiritual',
        'ஆன்மிகம்': 'Spiritual',
        'தொழில்நுட்பம்': 'Technology',
        'சினிமா': 'Cinema',
        'sports': 'Sports',
        'politics': 'Politics',
        'education': 'Education',
        'spiritual': 'Spiritual',
        'technology': 'Technology',
        'cinema': 'Cinema',
      };
      const mappedCategory = categoryMap[category.toLowerCase()] || category;
      query.category = mappedCategory;
    }

    // Filter by Flags
    if (isImportant === 'true') query.isImportant = true;
    if (isLatest === 'true') query.isLatest = true;

    // Filter for YouTube Video News
    if (hasVideo === 'true') query.youtubeVideoId = { $ne: '' };

    // Search Query (Bilingual — title, description, category)
    if (search) {
      query.$or = [
        { titleTamil: { $regex: search, $options: 'i' } },
        { titleEnglish: { $regex: search, $options: 'i' } },
        { descriptionTamil: { $regex: search, $options: 'i' } },
        { descriptionEnglish: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    let newsQuery = News.find(query).sort({ publishDate: -1, createdAt: -1 });
    if (limit > 0) newsQuery = newsQuery.limit(limit);

    const news = await newsQuery;
    return NextResponse.json({ success: true, count: news.length, data: news });
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
    let {
      titleTamil, titleEnglish, descriptionTamil, descriptionEnglish,
      category, image, youtubeUrl, isImportant, isLatest, publishDate,
    } = body;

    if (!titleTamil || !titleEnglish || !descriptionTamil || !descriptionEnglish || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let youtubeVideoId = '';
    if (youtubeUrl) {
      youtubeVideoId = extractYoutubeVideoId(youtubeUrl);
      if (!image && youtubeVideoId) {
        image = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
      }
    }

    const newNews = await News.create({
      titleTamil,
      titleEnglish,
      descriptionTamil,
      descriptionEnglish,
      category,
      image: image || '',
      youtubeUrl: youtubeUrl || '',
      youtubeVideoId,
      isImportant: !!isImportant,
      isLatest: !!isLatest,
      publishDate: publishDate ? new Date(publishDate) : new Date(),
    });

    return NextResponse.json({ success: true, data: newNews }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});
