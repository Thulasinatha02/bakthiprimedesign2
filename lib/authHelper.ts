import { cookies } from 'next/headers';
import { verifyToken } from './jwt';

export async function isAuthenticated() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return false;
    const decoded = verifyToken(token);
    return !!decoded;
  } catch (error) {
    return false;
  }
}
