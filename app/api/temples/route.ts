import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Temple from '@/models/Temple';
import { isAuthenticated } from '@/lib/authHelper';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const temples = await Temple.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: temples.length, data: temples });
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
    const { name, location, deity, history, image, timings } = body;

    if (!name || !location || !deity || !history) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newTemple = await Temple.create({
      name,
      location,
      deity,
      history,
      image,
      timings,
    });

    return NextResponse.json({ success: true, data: newTemple }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
