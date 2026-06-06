import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
