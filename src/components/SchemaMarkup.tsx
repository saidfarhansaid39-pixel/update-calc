import React from 'react'
import { routing } from '@/i18n/routing'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

interface SchemaMarkupProps {
  type: 'WebSite' | 'Product' | 'Article' | 'FAQPage' | 'HowTo' | 'BreadcrumbList' | 'WebApplication' | 'ItemList' | 'SoftwareApplication' | 'Organization' | 'CollectionPage'
  data: Record<string, unknown>
  locale?: string
}

export function SchemaMarkup({ type, data, locale = routing.defaultLocale }: SchemaMarkupProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
    inLanguage: locale,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

const siteNames: Record<string, string> = {
  en: 'Calculat',
  es: 'Calculat',
  fr: 'Calculat',
  de: 'Calculat',
  pt: 'Calculat',
  ru: 'Calculat',
  ar: 'Calculat',
  hi: 'Calculat',
  ja: 'Calculat',
  'zh-CN': 'Calculat',
}

export const siteDescriptions: Record<string, string> = {
  en: 'Free calculator online for finance, health, math, science, conversion, and everyday life. 4,270+ instant calculators online with step-by-step formulas.',
  es: 'Calculadora online gratis para finanzas, salud, matemáticas, ciencias, conversiones y vida cotidiana. Más de 4.270 calculadoras online instantáneas.',
  fr: 'Calculatrice en ligne gratuite pour finances, santé, maths, sciences, conversion et quotidien. Plus de 4 270 calculateurs en ligne instantanés.',
  de: 'Kostenloser Online-Rechner für Finanzen, Gesundheit, Mathematik, Wissenschaft, Umrechnung und Alltag. Über 4.270 sofortige Online-Rechner.',
  pt: 'Calculadora online gratuita para finanças, saúde, matemática, ciências, conversão e vida cotidiana. Mais de 4.270 calculadoras online instantâneas.',
  ru: 'Бесплатный онлайн-калькулятор для финансов, здоровья, математики, науки, конвертации и повседневной жизни. Более 4 270 мгновенных онлайн-калькуляторов.',
  ar: 'حاسبة مجانية عبر الإنترنت للمالية والصحة والرياضيات والعلوم والتحويل والحياة اليومية. أكثر من 4270 حاسبة عبر الإنترنت.',
  hi: 'वित्त, स्वास्थ्य, गणित, विज्ञान, रूपांतरण और दैनिक जीवन के लिए मुफ्त ऑनलाइन कैलकुलेटर। 4,270+ तत्काल ऑनलाइन कैलकुलेटर।',
  ja: '金融、健康、数学、科学、変換、日常生活のための無料オンライン計算機。4,270以上の即時オンライン計算機。',
  'zh-CN': '金融、健康、数学、科学、转换和日常生活的免费在线计算器。4,270+ 即时在线计算器。',
}

export function websiteSchema(locale: string) {
  return {
    name: siteNames[locale] || siteNames.en,
    url: siteUrl,
    description: siteDescriptions[locale] || siteDescriptions.en,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function organizationSchema(locale?: string) {
  const loc = locale || routing.defaultLocale
  return {
    name: 'Calculat',
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    description: siteDescriptions[loc] || siteDescriptions.en,
    sameAs: [
      'https://www.calculat.online',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: Object.keys(siteNames),
    },
  }
}

export function calculatorSchema(calc: {
  title: string
  description: string
  slug: string
  hubName: string
  hubSlug: string
}, locale?: string) {
  const loc = locale || routing.defaultLocale
  const url = loc === routing.defaultLocale
    ? `${siteUrl}/${calc.hubSlug}/${calc.slug}`
    : `${siteUrl}/${loc}/${calc.hubSlug}/${calc.slug}`
  return {
    '@type': 'SoftwareApplication',
    name: calc.title,
    description: calc.description,
    url,
    applicationCategory: 'UtilitiesApplication',
    applicationSubcategory: 'Calculator',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2025-01-01',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      ratingCount: '1250',
    },
    inLanguage: loc,
    isAccessibleForFree: true,
    author: {
      '@type': 'Organization',
      name: 'Calculat',
      url: siteUrl,
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Calculat',
      url: siteUrl,
    },
  }
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function howToSchema(steps: { label: string; value: string }[]) {
  return {
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.label,
      text: s.value,
    })),
  }
}

export function breadcrumbListSchema(items: { name: string; url: string }[], locale?: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
    inLanguage: locale || routing.defaultLocale,
  }
}
