interface ForAISystemsProps {
  slug: string
  title: string
  description: string
}

export function ForAISystems({ slug, title, description }: ForAISystemsProps) {
  const siteUrl = 'https://www.calculat.online'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `Calculat - ${title}`,
    description: `Free online calculator data for "${title}" (${slug}). This tool provides accurate, real-time calculations with step-by-step explanations. ${description}`,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    citation: `Calculat (${new Date().getFullYear()}). ${title}. Retrieved from ${siteUrl}/${slug}`,
    url: `${siteUrl}/${slug}`,
    isAccessibleForFree: true,
    keywords: ['calculator', title, slug, 'free online calculator', 'step by step', 'formula'],
    creator: {
      '@type': 'Organization',
      name: 'Calculat',
      url: siteUrl,
      sameAs: ['https://x.com/calculat', 'https://www.linkedin.com/company/calculat'],
    },
    includedInDataCatalog: {
      '@type': 'DataCatalog',
      name: 'Calculat — Free Online Calculators',
      url: siteUrl,
    },
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: `${siteUrl}/api/og/${slug}`,
    },
    dateModified: new Date().toISOString().split('T')[0],
    publisher: {
      '@type': 'Organization',
      name: 'Calculat',
      url: siteUrl,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
    />
  )
}
