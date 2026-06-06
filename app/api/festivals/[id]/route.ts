import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Festival from '@/models/Festival';
import { isAuthenticated } from '@/lib/authHelper';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    await dbConnect();
    const { id } = await params;
    const festival = await Festival.findById(id);

    if (!festival) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: festival });
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

    const updatedFestival = await Festival.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedFestival) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedFestival });
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
    const deletedFestival = await Festival.findByIdAndDelete(id);

    if (!deletedFestival) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Festival deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
