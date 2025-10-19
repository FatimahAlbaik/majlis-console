import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes
  const protectedRoutes = [
    '/feed',
    '/activities',
    '/members',
    '/suggestions',
    '/feedback',
    '/announcements',
    '/news',
    '/important',
  ];

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextpathname.startsWith(route)
  );

  // Redirect to login if not authenticated and accessing protected route
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect authenticated users away from login page
  if (session && request.nextpathname === '/auth/login') {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};