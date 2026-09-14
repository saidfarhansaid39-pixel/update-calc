export function softwareAppSchema(calculator: { title: string; description?: string; slug: string }, locale: string, url: string) {
  return {
    name: calculator.title,
    description: calculator.description || '',
    url,
    applicationCategory: 'UtilitiesApplication',
    applicationSubCategory: 'Calculator',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    potentialAction: {
      '@type': 'UseAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: url,
      },
    },
    author: {
      '@type': 'Organization',
      name: 'Calculat',
    },
  }
}
