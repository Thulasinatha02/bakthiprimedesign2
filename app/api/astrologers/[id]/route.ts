import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Astrologer from '@/models/Astrologer';
import { isAuthenticated } from '@/lib/authHelper';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    await dbConnect();
    const { id } = await params;
    const astrologer = await Astrologer.findById(id);

    if (!astrologer) {
      return NextResponse.json({ error: 'Astrologer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: astrologer });
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
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const deletedAstrologer = await Astrologer.findByIdAndDelete(id);

    if (!deletedAstrologer) {
      return NextResponse.json({ error: 'Astrologer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Astrologer deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
