import { describe, it, expect } from 'vitest'
import {
  resolveLocale,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDate,
  formatDateTime,
} from '../calculator-i18n'

describe('resolveLocale', () => {
  it('maps next-intl short codes to BCP-47', () => {
    expect(resolveLocale('en')).toBe('en-US')
    expect(resolveLocale('es')).toBe('es-ES')
    expect(resolveLocale('fr')).toBe('fr-FR')
    expect(resolveLocale('de')).toBe('de-DE')
    expect(resolveLocale('pt')).toBe('pt-BR')
    expect(resolveLocale('ru')).toBe('ru-RU')
    expect(resolveLocale('ar')).toBe('ar')
    expect(resolveLocale('hi')).toBe('hi-IN')
    expect(resolveLocale('ja')).toBe('ja-JP')
    expect(resolveLocale('zh-CN')).toBe('zh-CN')
  })

  it('passes through unknown or already-BCP-47 values', () => {
    expect(resolveLocale('zh-CN')).toBe('zh-CN')
    expect(resolveLocale('fr-CA')).toBe('fr-CA')
    expect(resolveLocale('')).toBe('en-US')
  })
})

describe('formatCurrency', () => {
  it('formats USD with en-US grouping', () => {
    const out = formatCurrency(1234.5, 'USD', 'en-US')
    expect(out).toContain('$')
    expect(out).toContain('1,234.50')
  })

  it('honors per-currency fraction digits (JPY has none)', () => {
    const out = formatCurrency(1234, 'JPY', 'ja-JP')
    expect(out).not.toContain('.00')
    expect(out).toContain('1,234')
  })

  it('uses locale decimal separator for fr-FR', () => {
    const out = formatCurrency(1234.5, 'EUR', 'fr-FR')
    expect(out).toContain('€')
    // separator-free substrings: "234,50" (decimal part) is intact
    expect(out).toContain('234,50')
  })
})

describe('formatNumber', () => {
  it('uses locale grouping/decimal for de-DE', () => {
    const out = formatNumber(1234.5, 'de-DE')
    expect(out).toContain('1.234')
  })
  it('uses comma decimal for fr-FR', () => {
    const out = formatNumber(1234.5, 'fr-FR')
    expect(out).toContain('234,5')
  })
})

describe('formatPercent', () => {
  it('formats a ratio as a percentage', () => {
    const out = formatPercent(0.5, 'en-US')
    expect(out).toContain('50')
    expect(out).toContain('%')
  })
})

describe('formatDate / formatDateTime', () => {
  const d = new Date('2026-07-11T15:04:00Z')
  it('formatDate returns a non-empty localized string', () => {
    expect(formatDate(d, 'en-US').length).toBeGreaterThan(0)
  })
  it('formatDateTime returns a non-empty localized string', () => {
    expect(formatDateTime(d, 'fr-FR').length).toBeGreaterThan(0)
  })
})
