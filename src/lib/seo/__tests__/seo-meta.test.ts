import { describe, expect, it } from 'vitest'
import { buildSeoDescription, buildSeoTitle, SEO_DESC_MAX, SEO_TITLE_MAX } from '@/lib/seo/seo-meta'

describe('buildSeoTitle', () => {
  it('builds the keyword template inside the length cap', () => {
    expect(buildSeoTitle('BMI Calculator', 'Free Online Tool')).toBe(
      'BMI Calculator - Free Online Tool | Calculat',
    )
  })

  it('falls back to the bare title when the template overflows', () => {
    const long = 'Calculadora de 401k con aportaciones del empleador y límites'
    const out = buildSeoTitle(long, 'Herramienta gratuita en línea')
    expect(out.length).toBeLessThanOrEqual(SEO_TITLE_MAX)
    expect(out).toContain('Calculadora de 401k')
  })

  it('never exceeds the cap, even for very long titles', () => {
    const out = buildSeoTitle('x'.repeat(200), 'Free Online Tool')
    expect(out.length).toBeLessThanOrEqual(SEO_TITLE_MAX)
    expect(out).toMatch(/\.\.\.$/)
  })

  it('handles empty inputs without crashing', () => {
    expect(buildSeoTitle('', '')).toBe('Calculat')
    expect(buildSeoTitle('BMI Calculator', '')).toBe('BMI Calculator')
  })
})

describe('buildSeoDescription', () => {
  it('keeps short descriptions intact', () => {
    const d = 'Free BMI Calculator — Calculate your Body Mass Index.'
    expect(buildSeoDescription(d)).toBe(d)
  })

  it('truncates long descriptions on a word boundary', () => {
    const d = buildSeoDescription('word '.repeat(60))
    expect(d.length).toBeLessThanOrEqual(SEO_DESC_MAX)
    expect(d).toMatch(/\.\.\.$/)
    expect(d).not.toMatch(/\s\.\.\.$/)
  })
})
