/**
 * Shared SEO builders for calculator + cluster page metadata.
 *
 * Every calculator/cluster page title follows one keyword-rich template:
 *   "{Title} - {Free Online Tool} | Calculat"   (≤ 60 chars, else bare title)
 * and every meta description is capped at 160 chars on a word boundary.
 * Pure functions — unit-tested, locale-independent (callers pass the
 * already-localized title/description/suffix strings).
 */

export const SEO_TITLE_MAX = 60
export const SEO_DESC_MAX = 160
const BRAND = 'Calculat'

function truncateWords(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return clean.substring(0, max - 3).replace(/\s+\S*$/, '') + '...'
}

/**
 * Builds "{title} - {suffix} | Calculat" when it fits SEO_TITLE_MAX,
 * otherwise the bare title truncated to the cap. Suffix carries the
 * high-value modifiers (free / online / tool) in the page locale.
 */
export function buildSeoTitle(title: string, suffix: string): string {
  const cleanTitle = title.replace(/\s+/g, ' ').trim()
  const cleanSuffix = suffix.replace(/\s+/g, ' ').trim()
  if (cleanTitle && cleanSuffix) {
    const full = `${cleanTitle} - ${cleanSuffix} | ${BRAND}`
    if (full.length <= SEO_TITLE_MAX) return full
  }
  return truncateWords(cleanTitle || BRAND, SEO_TITLE_MAX)
}

/** Caps a meta description at SEO_DESC_MAX on a word boundary. */
export function buildSeoDescription(description: string): string {
  return truncateWords(description, SEO_DESC_MAX)
}
