import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Temple from '@/models/Temple';
import { isAuthenticated } from '@/lib/authHelper';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    await dbConnect();
    const { id } = await params;
    const temple = await Temple.findById(id);

    if (!temple) {
      return NextResponse.json({ error: 'Temple not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: temple });
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

    const updatedTemple = await Temple.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTemple) {
      return NextResponse.json({ error: 'Temple not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedTemple });
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
    const deletedTemple = await Temple.findByIdAndDelete(id);

    if (!deletedTemple) {
      return NextResponse.json({ error: 'Temple not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Temple deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
