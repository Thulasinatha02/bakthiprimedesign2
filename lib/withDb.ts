import { NextResponse } from 'next/server';
import { dbConnect } from './mongodb';

type RouteHandler = (...args: any[]) => Promise<Response | NextResponse>;

/**
 * Higher-order function (HOF) that ensures a single MongoDB connection is
 * established before the route handler runs.
 *
 * Uses the connection cache inside lib/mongodb.ts — so on warm requests
 * (after first connection) this resolves immediately with zero overhead.
 *
 * If the DB is unreachable it returns a 503 response instead of a raw 500,
 * and logs the error server-side.
 *
 * Usage:
 *   export const GET = withDb(async (request: Request) => { ... });
 *   export const GET = withDb(async (request: Request, { params }: Params) => { ... });
 */
export function withDb<T extends RouteHandler>(handler: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      await dbConnect();
    } catch (error: any) {
      console.error('[withDb] Database connection failed:', error.message);
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }
    return handler(...args);
  }) as T;
}
