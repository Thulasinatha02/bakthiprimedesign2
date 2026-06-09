import { NextResponse } from 'next/server';
import Temple from '@/models/Temple';
import { isAuthenticated } from '@/lib/authHelper';
import { withDb } from '@/lib/withDb';

export const GET = withDb(async () => {
  try {
    const temples = await Temple.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: temples.length, data: temples });
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
    const { name, location, deity, history, image, timings } = body;

    if (!name || !location || !deity || !history) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newTemple = await Temple.create({ name, location, deity, history, image, timings });
    return NextResponse.json({ success: true, data: newTemple }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});
