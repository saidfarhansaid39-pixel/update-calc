import { isValidHubSlug } from '@/lib/hub-data'
import { CalculatorPageContent, generateCalculatorMetadata } from '@/components/hub-pages/calculator-page-content'
import { HubLandingContent, generateHubLandingMetadata } from '@/components/hub-pages/hub-landing'
import { routing } from '@/i18n/routing'
import HomePage from '../page'
import AboutPage, { generateMetadata as genAboutMeta } from '../about/page'
import ContactPage, { generateMetadata as genContactMeta } from '../contact/page'
import PrivacyPage, { generateMetadata as genPrivacyMeta } from '../privacy/page'
import TermsPage, { generateMetadata as genTermsMeta } from '../terms/page'
import CalculatorBuilderPage, { generateMetadata as genCalcBuilderMeta } from '../calculator-builder/page'
import NotFoundPage, { generateMetadata as genNotFoundMeta } from '../not-found/page'

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
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jdcalc.com'

function stripLocale(slug: string[]): string[] {
  if (slug.length > 0 && VALID_LOCALES.includes(slug[0])) {
    return slug.slice(1)
  }
  return slug
}

function getLocaleFromSlug(slug: string[]): string {
  if (slug.length > 0 && VALID_LOCALES.includes(slug[0])) {
    return slug[0]
  }
  return 'en'
}

const LOCALE_TITLES: Record<string, string> = {
  en: 'JDCALC - Precision Calculators & Unit Converters',
  es: 'JDCALC - Calculadoras de Precisión y Conversores de Unidades',
  fr: 'JDCALC - Calculatrices et Convertisseurs de Précision',
  de: 'JDCALC - Präzisionsrechner und Einheitenumrechner',
  pt: 'JDCALC - Calculadoras de Precisão e Conversores de Unidades',
  ru: 'JDCALC - Точные калькуляторы и конвертеры единиц',
  ar: 'JDCALC - حاسبات دقيقة ومحولات وحدات',
  hi: 'JDCALC - सटीक कैलकुलेटर और यूनिट कन्वर्टर',
  ja: 'JDCALC - 精密計算機と単位変換',
  'zh-CN': 'JDCALC - 精确计算器和单位转换器',
}

const LOCALE_DESCRIPTIONS: Record<string, string> = {
  en: 'Free online calculators for finance, health, math, science, conversion, and everyday life. Fast, accurate, and beautifully designed.',
  es: 'Calculadoras gratuitas en línea para finanzas, salud, matemáticas, ciencias, conversiones y vida cotidiana. Rápidas, precisas y hermosamente diseñadas.',
  fr: 'Calculatrices gratuites pour finances, santé, maths, sciences, conversion et quotidien. Rapides, précises et faciles à utiliser.',
  de: 'Kostenlose Online-Rechner für Finanzen, Gesundheit, Mathematik, Wissenschaft, Umrechnung und Alltag. Schnell, genau und schön gestaltet.',
  pt: 'Calculadoras online gratuitas para finanças, saúde, matemática, ciência, conversão e vida cotidiana. Rápidas, precisas e lindamente projetadas.',
  ru: 'Бесплатные онлайн-калькуляторы для финансов, здоровья, математики, науки, конвертации и повседневной жизни. Быстро, точно и красиво.',
  ar: 'آلات حاسبة مجانية عبر الإنترنت للتمويل والصحة والرياضيات والعلوم والتحويل والحياة اليومية. سريعة ودقيقة ومصممة بشكل جميل.',
  hi: 'वित्त, स्वास्थ्य, गणित, विज्ञान, रूपांतरण और दैनिक जीवन के लिए मुफ्त ऑनलाइन कैलकुलेटर। तेज़, सटीक और खूबसूरती से डिज़ाइन किए गए।',
  ja: '金融、健康、数学、科学、変換、日常生活のための無料オンライン計算機。高速、正確、美しいデザイン。',
  'zh-CN': '免费在线计算器，涵盖金融、健康、数学、科学、转换和日常生活。快速、准确、设计精美。',
}

function buildHreflang(path: string) {
  const map: Record<string, string> = { 'x-default': `${siteUrl}${path}` }
  for (const l of routing.locales) {
    map[l] = l === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${l}${path}`
  }
  return map
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: rawSlug } = await params
  const locale = getLocaleFromSlug(rawSlug)
  const slug = stripLocale(rawSlug)

  if (slug.length === 0) {
    const title = LOCALE_TITLES[locale] || LOCALE_TITLES.en
    const description = LOCALE_DESCRIPTIONS[locale] || LOCALE_DESCRIPTIONS.en
    const url = locale === 'en' ? siteUrl : `${siteUrl}/${locale}`
    return {
      title,
      description,
      alternates: { canonical: url, languages: buildHreflang('/') },
      openGraph: { title, description, url, siteName: 'JDCALC', type: 'website', locale: locale === 'en' ? 'en_US' : `${locale}_${locale.toUpperCase()}`, images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }] },
      twitter: { card: 'summary_large_image', title, description },
    }
  }

  if (slug.length === 1) {
    if (slug[0] in STATIC_PAGES) {
      switch (slug[0]) {
        case 'about': return genAboutMeta()
        case 'contact': return genContactMeta()
        case 'privacy': return genPrivacyMeta()
        case 'terms': return genTermsMeta()
        case 'calculator-builder': return genCalcBuilderMeta()
        case 'not-found': return genNotFoundMeta()
      }
    }
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
