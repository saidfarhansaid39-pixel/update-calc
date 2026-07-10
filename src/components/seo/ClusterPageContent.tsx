'use client'

import React from 'react'
import { Link } from '@/lib/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { ClusterFlatEntry } from '@/lib/seo-clusters/types'
import { getClustersForPrimary } from '@/lib/seo-clusters'

function faqSchema(faqs: Array<{ q: string; a: string }>) {
  if (faqs.length === 0) return null
  return {
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }),
  }
}

function breadcrumbSchema(cluster: ClusterFlatEntry, locale: string, th: (key: string) => string) {
  const homeUrl = locale === 'en' ? 'https://www.jdcalc.com' : `https://www.jdcalc.com/${locale}`
  const hubUrl = locale === 'en' ? `https://www.jdcalc.com/${cluster.hubSlug}` : `https://www.jdcalc.com/${locale}/${cluster.hubSlug}`
  return {
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'JDCALC', item: homeUrl },
        { '@type': 'ListItem', position: 2, name: th(cluster.hubSlug), item: hubUrl },
        { '@type': 'ListItem', position: 3, name: cluster.variant.title },
      ],
    }),
  }
}

export function ClusterPageContent({
  cluster,
  children,
}: {
  cluster: ClusterFlatEntry
  children: React.ReactNode
}) {
  const locale = useLocale()
  const tc = useTranslations('common')
  const th = useTranslations('hubs')
  const v = cluster.variant
  return (
    <div>
      {faqSchema(v.faqs) && (
        <script type="application/ld+json" dangerouslySetInnerHTML={faqSchema(v.faqs)!} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={breadcrumbSchema(cluster, locale, th)} />

      <div className="mb-3">
        <Link
          href={`/${cluster.hubSlug}/${cluster.primarySlug}`}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          aria-label={tc('backTo', { title: v.title })}
        >
          {tc('backTo', { title: v.title || cluster.primarySlug.replace(/-/g, ' ') })}
        </Link>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
        {v.title}
      </h1>

      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">{v.searchIntent}</p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 text-gray-600 dark:text-gray-300">
        {v.intro}
      </div>

      {children}

      {v.faqs.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            {tc('faq')}
          </h2>
          <div className="space-y-4">
            {v.faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">{faq.q}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <ClusterInternalLinks cluster={cluster} />
    </div>
  )
}

export function ClusterInternalLinks({ cluster }: { cluster: ClusterFlatEntry }) {
  const tc = useTranslations('common')
  const related = getClustersForPrimary(cluster.primarySlug).filter(v => v.key !== cluster.variant.key)

  if (related.length === 0) return null

  return (
    <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        {tc('relatedCalculators')}
      </p>
      <div className="flex flex-wrap gap-2">
        {related.slice(0, 6).map(v => (
          <Link
            key={v.key}
            href={`/${cluster.hubSlug}/${cluster.primarySlug}-${v.slugSuffix}`}
            className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {v.title}
          </Link>
        ))}
        <Link
          href={`/${cluster.hubSlug}/${cluster.primarySlug}`}
          className="text-xs px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
        >
          {tc('mainCalculator')}
        </Link>
      </div>
    </div>
  )
}

export function PrimaryClusterLinks({ hubSlug, primarySlug }: { hubSlug: string; primarySlug: string }) {
  const tc = useTranslations('common')
  const variants = getClustersForPrimary(primarySlug)

  if (variants.length === 0) return null

  return (
    <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {tc('popularSearches')}
      </p>
      <div className="flex flex-wrap gap-2">
        {variants.slice(0, 8).map(v => (
          <Link
            key={v.key}
            href={`/${hubSlug}/${primarySlug}-${v.slugSuffix}`}
            className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {v.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
