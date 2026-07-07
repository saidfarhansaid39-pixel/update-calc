export async function getCalculatorContent(slug: string) {
  try {
    const { calculators } = await import('@/.velite/generated')
    return calculators.find((c: { slug: string }) => c.slug === slug) ?? null
  } catch {
    return null
  }
}

export async function getGuideContent(slug: string) {
  try {
    const { guides } = await import('@/.velite/generated')
    return guides.find((g: { slug: string }) => g.slug === slug) ?? null
  } catch {
    return null
  }
}

export async function getAllCalculatorSlugs(): Promise<string[]> {
  try {
    const { calculators } = await import('@/.velite/generated')
    return calculators.map((c: { slug: string }) => c.slug)
  } catch {
    return []
  }
}

export async function getCalculatorsByCategory(category: string) {
  try {
    const { calculators } = await import('@/.velite/generated')
    return calculators.filter((c: { category: string }) => c.category === category)
  } catch {
    return []
  }
}
