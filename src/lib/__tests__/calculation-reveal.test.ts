import { describe, expect, it } from 'vitest'
import {
  getCalculationSignature,
  isCalculationStale,
  isDisplayableMainValue,
  parseChartNumber,
  shouldEnableCalculate,
} from '@/lib/calculation-reveal'

describe('getCalculationSignature', () => {
  it('ignores key order and empty values', () => {
    const a = getCalculationSignature({ inputs: { b: '2', a: '1', empty: '' } })
    const b = getCalculationSignature({ inputs: { a: '1', b: '2' } })
    expect(a).toBe(b)
  })

  it('changes when inputs, extra fields, or display preferences change', () => {
    const base = getCalculationSignature({ inputs: { x: '1' }, currency: 'USD', locale: 'en' })
    expect(getCalculationSignature({ inputs: { x: '2' }, currency: 'USD', locale: 'en' })).not.toBe(base)
    expect(getCalculationSignature({ inputs: { x: '1' }, extraFields: { goal: 'lose' }, currency: 'USD', locale: 'en' })).not.toBe(base)
    expect(getCalculationSignature({ inputs: { x: '1' }, currency: 'EUR', locale: 'en' })).not.toBe(base)
    expect(getCalculationSignature({ inputs: { x: '1' }, currency: 'USD', locale: 'fr' })).not.toBe(base)
  })
})

describe('shouldEnableCalculate', () => {
  it('enables when the visitor typed inputs', () => {
    expect(shouldEnableCalculate(true, undefined, false)).toBe(true)
  })

  it('stays disabled on load even when engines pre-report 0/NaN main values', () => {
    expect(shouldEnableCalculate(false, 0, true)).toBe(false)
    expect(shouldEnableCalculate(false, NaN, true)).toBe(false)
  })

  it('enables when a result appears after mount (internal calculate buttons)', () => {
    expect(shouldEnableCalculate(false, 42, false)).toBe(true)
  })
})

describe('isDisplayableMainValue', () => {
  it('rejects NaN and non-numbers so the sticky bar never shows NaN', () => {
    expect(isDisplayableMainValue(NaN)).toBe(false)
    expect(isDisplayableMainValue(undefined)).toBe(false)
    expect(isDisplayableMainValue('12')).toBe(false)
    expect(isDisplayableMainValue(0)).toBe(true)
    expect(isDisplayableMainValue(1390326.04)).toBe(true)
  })
})

describe('isCalculationStale', () => {
  it('detects edits after an explicit calculation', () => {
    expect(isCalculationStale(false, null, 'a')).toBe(false)
    expect(isCalculationStale(true, 'a', 'a')).toBe(false)
    expect(isCalculationStale(true, 'a', 'b')).toBe(true)
  })
})

describe('parseChartNumber', () => {
  it('parses display-formatted money, percents and plain numbers', () => {
    expect(parseChartNumber('$7,500.00')).toBe(7500)
    expect(parseChartNumber('1390326.04 $')).toBe(1390326.04)
    expect(parseChartNumber('22%')).toBe(22)
    expect(parseChartNumber('3.0000')).toBe(3)
    expect(parseChartNumber(42)).toBe(42)
  })

  it('returns null for non-numeric steps', () => {
    expect(parseChartNumber('See results above')).toBe(null)
    expect(parseChartNumber('')).toBe(null)
    expect(parseChartNumber('$')).toBe(null)
    expect(parseChartNumber(NaN)).toBe(null)
    expect(parseChartNumber(undefined)).toBe(null)
    expect(parseChartNumber('May 2026')).toBe(null)
  })
})
