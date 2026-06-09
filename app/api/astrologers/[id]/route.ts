import { NextResponse } from 'next/server';
import Astrologer from '@/models/Astrologer';
import { isAuthenticated } from '@/lib/authHelper';
import { withDb } from '@/lib/withDb';

interface Params {
  params: Promise<{ id: string }>;
}

export const GET = withDb(async (request: Request, { params }: Params) => {
  try {
    const { id } = await params;
    const astrologer = await Astrologer.findById(id);

    if (!astrologer) {
      return NextResponse.json({ error: 'Astrologer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: astrologer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});

export const PUT = withDb(async (request: Request, { params }: Params) => {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updatedAstrologer = await Astrologer.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedAstrologer) {
      return NextResponse.json({ error: 'Astrologer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedAstrologer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});

export const DELETE = withDb(async (request: Request, { params }: Params) => {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deletedAstrologer = await Astrologer.findByIdAndDelete(id);

    if (!deletedAstrologer) {
      return NextResponse.json({ error: 'Astrologer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Astrologer deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});
