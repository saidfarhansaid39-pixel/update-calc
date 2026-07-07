import React from 'react'
import { routing } from '@/i18n/routing'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jdcalc.com'

interface SchemaMarkupProps {
  type: 'WebSite' | 'Product' | 'Article' | 'FAQPage' | 'HowTo' | 'BreadcrumbList' | 'WebApplication' | 'ItemList'
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
