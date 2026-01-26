import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  // Extract locale from pathname and set as header for not-found page
  const pathname = request.nextUrl.pathname;
  const pathSegments = pathname.split('/').filter(Boolean);

  const firstSegment = pathSegments[0];
  if (firstSegment && (routing.locales as readonly string[]).includes(firstSegment)) {
    response.headers.set('x-locale', firstSegment);
  }

  return response;
}

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - _next (Next.js internals)
  // - _vercel (Vercel internals)
  // - Static files (images, etc.)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
