import { NextResponse } from 'next/server';
import Astrologer from '@/models/Astrologer';
import { isAuthenticated } from '@/lib/authHelper';
import { withDb } from '@/lib/withDb';

export const GET = withDb(async () => {
  try {
    const astrologers = await Astrologer.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: astrologers.length, data: astrologers });
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
    const { name, image, specialty, experience, phone, email } = body;

    if (!name || !specialty || !experience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAstrologer = await Astrologer.create({ name, image, specialty, experience, phone, email });
    return NextResponse.json({ success: true, data: newAstrologer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});
