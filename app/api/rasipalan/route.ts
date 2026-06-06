import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import RasiPalan from '@/models/RasiPalan';
import { isAuthenticated } from '@/lib/authHelper';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // e.g. daily, weekly, monthly, peyarchi_guru, etc.
    const rasiKey = searchParams.get('rasiKey'); // e.g. aries
    const date = searchParams.get('date');

    const query: any = {};
    if (type) query.type = type;
    if (rasiKey) query.rasiKey = rasiKey;
    if (date) query.date = date;

    const data = await RasiPalan.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: data.length, data });
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

    // Check if it is a bulk upsert (array of 12 rasi predictions)
    if (Array.isArray(body)) {
      const operations = body.map((item) => {
        const { rasiKey, type, rasi, prediction, date, youtubeUrl } = item;
        return RasiPalan.findOneAndUpdate(
          { rasiKey, type, date },
          { rasiKey, type, rasi, prediction, date, youtubeUrl },
          { upsert: true, new: true }
        );
      });

      const results = await Promise.all(operations);
      return NextResponse.json({ success: true, data: results });
    } else {
      const { rasiKey, type, rasi, prediction, date, youtubeUrl } = body;

      if (!rasiKey || !type || !rasi || !prediction || !date) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const updated = await RasiPalan.findOneAndUpdate(
        { rasiKey, type, date },
        { rasiKey, type, rasi, prediction, date, youtubeUrl },
        { upsert: true, new: true }
      );

      return NextResponse.json({ success: true, data: updated });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
