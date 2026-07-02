import { NextResponse } from 'next/server';
import AstrologerApplication from '@/models/AstrologerApplication';
import { isAuthenticated } from '@/lib/authHelper';
import { withDb } from '@/lib/withDb';

// Admin only: Get all applications
export const GET = withDb(async () => {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applications = await AstrologerApplication.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: applications.length, data: applications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});

// Public: Submit an application
export const POST = withDb(async (request: Request) => {
  try {
    const body = await request.json();
    const { name, image, specialty, experience, phone, email } = body;

    if (!name || !specialty || !experience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newApplication = await AstrologerApplication.create({ name, image, specialty, experience, phone, email });
    return NextResponse.json({ success: true, data: newApplication }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});
