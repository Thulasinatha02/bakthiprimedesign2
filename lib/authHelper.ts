import { cookies } from 'next/headers';
import { verifyToken } from './jwt';
import { dbConnect } from './mongodb';

/**
 * Verifies that the current request is authenticated via the 'token' cookie.
 *
 * Calls dbConnect() first to guarantee a DB connection is available before
 * any auth logic runs. This future-proofs the function for token revocation
 * checks (e.g. checking a denylist in the DB) without needing changes to
 * every route that calls isAuthenticated().
 */
export async function isAuthenticated() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return false;
    const decoded = verifyToken(token);
    return !!decoded;
  } catch (error) {
    return false;
  }
}
