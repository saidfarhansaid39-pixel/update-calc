import React from 'react'
import { routing } from '@/i18n/routing'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jdcalc.com'

interface SchemaMarkupProps {
  type: 'WebSite' | 'Product' | 'Article' | 'FAQPage' | 'HowTo' | 'BreadcrumbList' | 'WebApplication' | 'ItemList' | 'SoftwareApplication'
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
  en: 'JDCALC',
  es: 'JDCALC',
  fr: 'JDCALC',
  de: 'JDCALC',
  pt: 'JDCALC',
  ru: 'JDCALC',
  ar: 'JDCALC',
  hi: 'JDCALC',
  ja: 'JDCALC',
  'zh-CN': 'JDCALC',
}

const siteDescriptions: Record<string, string> = {
  en: 'Precision calculators for finance, health, math, science, and everyday life. Free, fast, and beautifully designed.',
  es: 'Calculadoras de precisión para finanzas, salud, matemáticas, ciencias y la vida cotidiana. Gratis, rápidas y hermosamente diseñadas.',
  fr: 'Calculatrices de précision pour la finance, la santé, les mathématiques, les sciences et la vie quotidienne. Gratuites, rapides et magnifiquement conçues.',
  de: 'Präzisionsrechner für Finanzen, Gesundheit, Mathematik, Wissenschaft und den Alltag. Kostenlos, schnell und schön gestaltet.',
  pt: 'Calculadoras de precisão para finanças, saúde, matemática, ciências e vida cotidiana. Grátis, rápidas e lindamente projetadas.',
  ru: 'Прецизионные калькуляторы для финансов, здоровья, математики, науки и повседневной жизни. Бесплатно, быстро и красиво.',
  ar: 'حاسبات دقيقة للمالية والصحة والرياضيات والعلوم والحياة اليومية. مجانية وسريعة ومصممة بشكل جميل.',
  hi: 'वित्त, स्वास्थ्य, गणित, विज्ञान और रोजमर्रा की जिंदगी के लिए सटीक कैलकुलेटर। मुफ्त, तेज और खूबसूरती से डिजाइन किए गए।',
  ja: '金融、健康、数学、科学、日常生活のための高精度計算機。無料、高速、美しいデザイン。',
  'zh-CN': '金融、健康、数学、科学和日常生活的精确计算器。免费、快速、设计精美。',
}

export function websiteSchema(locale: string) {
  return {
    name: siteNames[locale] || siteNames.en,
    url: siteUrl,
    description: siteDescriptions[locale] || siteDescriptions.en,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
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
    '@type': 'Product',
    name: calc.title,
    description: calc.description,
    url,
    category: calc.hubName,
    inLanguage: loc,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
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
