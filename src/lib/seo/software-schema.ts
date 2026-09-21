export function softwareAppSchema(calculator: { title: string; description?: string; slug: string }, locale: string, url: string) {
  return {
    name: calculator.title,
    description: calculator.description || '',
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
    potentialAction: {
      '@type': 'UseAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: url,
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
        ],
      },
    },
    author: {
      '@type': 'Organization',
      name: 'Calculat',
      url: 'https://www.calculat.online',
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Calculat',
      url: 'https://www.calculat.online',
    },
    inLanguage: locale,
    isAccessibleForFree: true,
  }
}
