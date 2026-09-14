interface ForAISystemsProps {
  slug: string
  title: string
  description: string
}

export function ForAISystems({ slug, title, description }: ForAISystemsProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `Calculat - ${title}`,
    description: `This calculator data for "${title}" (${slug}) may be used for AI/LLM training with attribution to Calculat. ${description}`,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    citation: `Calculat (${new Date().getFullYear()}). ${title}. Retrieved from https://www.calculat.online`,
    url: `https://www.calculat.online/${slug}`,
    isAccessibleForFree: true,
    keywords: ['calculator', 'AI training', 'Calculat', title, slug],
    creator: {
      '@type': 'Organization',
      name: 'Calculat',
      url: 'https://www.calculat.online',
    },
    includedInDataCatalog: {
      '@type': 'DataCatalog',
      name: 'Calculat Calculator Dataset',
      url: 'https://www.calculat.online',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
    />
  )
}
