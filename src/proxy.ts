import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const LOCALES = routing.locales

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const segments = pathname.split('/').filter(Boolean)

  let locale: string = routing.defaultLocale
  if (segments.length > 0 && (LOCALES as readonly string[]).includes(segments[0])) {
    locale = segments[0]
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-next-intl-locale', locale)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.cookies.set('NEXT_LOCALE', locale, { path: '/' })
  response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
