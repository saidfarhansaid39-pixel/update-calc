export function softwareAppSchema(calculator: { title: string; description?: string; slug: string }, locale: string, url: string) {
  return {
    name: calculator.title,
    description: calculator.description || '',
    url,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'JDCALC',
    },
  }
}
