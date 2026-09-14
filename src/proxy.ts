import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import slugAliases from './lib/slug-aliases.json'

const LOCALES = routing.locales
const ALIASES = slugAliases as Record<string, Record<string, string>>

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const segments = pathname.split('/').filter(Boolean)
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value

  let detectedLocale: string
  if (segments.length > 0 && (LOCALES as readonly string[]).includes(segments[0])) {
    detectedLocale = segments[0]
  } else if (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)) {
    detectedLocale = cookieLocale
  } else {
    detectedLocale = detectLocaleFromAcceptLanguage(request) || routing.defaultLocale
  }

  if (detectedLocale !== 'en' && !cookieLocale && segments.length > 0 && (LOCALES as readonly string[]).includes(segments[0])) {
    const localeAliases = ALIASES[detectedLocale]
    if (localeAliases) {
      const pathWithoutLocale = segments.slice(1).join('/')
      const target = localeAliases[pathWithoutLocale]
      if (target) {
        return NextResponse.redirect(new URL(`/${detectedLocale}/${target}`, request.url), 301)
      }
    }
  }

  if (detectedLocale !== 'en' && !cookieLocale && segments.length === 0) {
    const url = request.nextUrl.clone()
    url.pathname = `/${detectedLocale}${pathname}`
    const response = NextResponse.redirect(url)
    response.cookies.set('NEXT_LOCALE', detectedLocale, { path: '/' })
    response.headers.set('Content-Language', detectedLocale)
    return response
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-next-intl-locale', detectedLocale)

  const localeForHeaders = (cookieLocale && segments.length === 0) ? cookieLocale : detectedLocale
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  if (!cookieLocale) {
    response.cookies.set('NEXT_LOCALE', localeForHeaders, { path: '/' })
  }
  response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  response.headers.set('Content-Language', localeForHeaders)

  return response
}

function detectLocaleFromAcceptLanguage(request: NextRequest): string | null {
  const acceptLanguage = request.headers.get('Accept-Language')
  if (!acceptLanguage) return null

  const preferredLocales = acceptLanguage
    .split(',')
    .map(entry => {
      const [lang, q = 'q=1'] = entry.trim().split(';')
      const quality = parseFloat(q.split('=')[1]) || 1
      return { lang: lang.trim(), quality }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const { lang } of preferredLocales) {
    if ((LOCALES as readonly string[]).includes(lang)) {
      return lang
    }
  }

  for (const { lang } of preferredLocales) {
    const base = lang.split('-')[0]
    if ((LOCALES as readonly string[]).includes(base)) {
      return base
    }
  }

  return null
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}