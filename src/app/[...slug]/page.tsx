import { isValidHubSlug } from '@/lib/hub-data'
import { CalculatorPageContent, generateCalculatorMetadata } from '@/components/hub-pages/calculator-page-content'
import { HubLandingContent, generateHubLandingMetadata } from '@/components/hub-pages/hub-landing'
import { routing } from '@/i18n/routing'
import HomePage from '../page'
import AboutPage from '../about/page'
import ContactPage from '../contact/page'
import PrivacyPage from '../privacy/page'
import TermsPage from '../terms/page'
import CalculatorBuilderPage from '../calculator-builder/page'
import NotFoundPage from '../not-found/page'

export const revalidate = 3600

const VALID_LOCALES = routing.locales as readonly string[]
const STATIC_PAGES: Record<string, React.ComponentType<any>> = {
  about: AboutPage,
  contact: ContactPage,
  privacy: PrivacyPage,
  terms: TermsPage,
  'calculator-builder': CalculatorBuilderPage,
  'not-found': NotFoundPage,
}

function stripLocale(slug: string[]): string[] {
  if (slug.length > 0 && VALID_LOCALES.includes(slug[0])) {
    return slug.slice(1)
  }
  return slug
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: rawSlug } = await params
  const slug = stripLocale(rawSlug)
  if (slug.length === 1) {
    if (slug[0] in STATIC_PAGES || slug[0] === '') return {}
    if (!isValidHubSlug(slug[0])) return {}
    return generateHubLandingMetadata(slug[0], 1)
  }
  if (slug.length !== 2) return {}
  if (!isValidHubSlug(slug[0])) return {}
  return generateCalculatorMetadata(slug[0], slug[1])
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: rawSlug } = await params
  const slug = stripLocale(rawSlug)

  if (slug.length === 0) {
    return <HomePage />
  }

  if (slug.length === 1) {
    if (slug[0] in STATIC_PAGES) {
      const Page = STATIC_PAGES[slug[0]]
      return <Page />
    }
    if (!isValidHubSlug(slug[0])) return <NotFoundPage />
    return <HubLandingContent hubSlug={slug[0]} searchParams={Promise.resolve({})} />
  }

  if (slug.length !== 2) return <NotFoundPage />
  if (!isValidHubSlug(slug[0])) return <NotFoundPage />
  return <CalculatorPageContent hubSlug={slug[0]} slug={slug[1]} />
}
