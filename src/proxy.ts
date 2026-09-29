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

  // The locale comes ONLY from an explicit /xx/ URL prefix. Prefixless URLs
  // (/, /about, /financial-calculators/...) are always English: they are the
  // canonical English URLs in the hreflang annotations and the EN sitemap, so
  // they must never be redirected away or rendered in another language based
  // on Accept-Language or a stored cookie. Without this, a first-time French
  // visitor was 308'd from / to /fr with no English root left ("the site
  // opens in French, English doesn't exist"). French and the other 8 locales
  // live at their own prefixes (/fr, /de, ...) and are chosen explicitly via
  // the language switcher.
  const detectedLocale: string =
    segments.length > 0 && (LOCALES as readonly string[]).includes(segments[0])
      ? segments[0]
      : 'en'

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

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-next-intl-locale', detectedLocale)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  if (!cookieLocale) {
    response.cookies.set('NEXT_LOCALE', detectedLocale, { path: '/' })
  }
  response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  response.headers.set('Content-Language', detectedLocale)

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}