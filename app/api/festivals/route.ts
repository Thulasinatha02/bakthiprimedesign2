import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Festival from '@/models/Festival';
import { isAuthenticated } from '@/lib/authHelper';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const festivals = await Festival.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: festivals.length, data: festivals });
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
    const { name, date, significance, rituals, image } = body;

    if (!name || !date || !significance) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newFestival = await Festival.create({
      name,
      date,
      significance,
      rituals,
      image,
    });

    return NextResponse.json({ success: true, data: newFestival }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
