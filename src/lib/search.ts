import MiniSearch from 'minisearch'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'
import { getLocalizedCalculator } from '@/lib/localized-registry'

const indexCache = new Map<string, Promise<MiniSearch>>()

async function loadPrebuiltIndex(locale: string): Promise<MiniSearch> {
  const res = await fetch(`/search-index/${locale}.json`)
  if (!res.ok) throw new Error(`Failed to fetch search index: ${res.status}`)
  const json = await res.json()
  return MiniSearch.loadJSON(json, {
    fields: ['title', 'keywords', 'slug'],
    storeFields: ['slug', 'hubSlug', 'title'],
    searchOptions: {
      boost: { title: 5, keywords: 3, slug: 2 },
      prefix: true,
      fuzzy: 0.2,
      maxFuzzy: 3,
    },
  })
}

function buildIndex(locale: string): Promise<MiniSearch> {
  return loadPrebuiltIndex(locale).catch(() =>
    import('@calcuniverse/calculator-registry').then(({ calculatorRegistry }) => {
      const idx = new MiniSearch<CalculatorEntry>({
        fields: ['title', 'keywords', 'slug'],
        storeFields: ['slug', 'hubSlug', 'title'],
        searchOptions: {
          boost: { title: 5, keywords: 3, slug: 2 },
          prefix: true,
          fuzzy: 0.2,
          maxFuzzy: 3,
        },
      })
      idx.addAll(calculatorRegistry)
      return idx
    })
  )
}

export type SearchResult = { slug: string; hubSlug: string; title: string }

export async function localizeSearchResults(results: SearchResult[], locale: string): Promise<SearchResult[]> {
  const localized = await Promise.all(
    results.map(async r => {
      const calc = await getLocalizedCalculator(r.slug, locale)
      return calc ? { ...r, title: calc.title } : r
    })
  )
  return localized
}

export async function searchCalculators(
  query: string,
  locale: string = 'en',
  signal?: AbortSignal
): Promise<SearchResult[]> {
  if (query.length < 2) return []
  if (signal?.aborted) return []

  if (!indexCache.has(locale)) {
    indexCache.set(locale, buildIndex(locale))
  }

  const idx = await indexCache.get(locale)!
  if (signal?.aborted) return []

  const raw = idx.search(query, { prefix: true, fuzzy: 0.2 })
  return raw.slice(0, 8).map(r => ({
    slug: r.slug as string,
    hubSlug: r.hubSlug as string,
    title: r.title as string,
  }))
}

export function createSearch(locale: string = 'en'): (query: string) => Promise<SearchResult[]> {
  let previousController: AbortController | null = null
  return (query: string) => {
    if (previousController) previousController.abort()
    const controller = new AbortController()
    previousController = controller
    return searchCalculators(query, locale, controller.signal)
  }
}
