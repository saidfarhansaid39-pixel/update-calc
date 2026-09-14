'use client'

import type { MeasurementSystem } from '@/lib/i18n/calculator-i18n'

interface ConversionPattern {
  regex: RegExp
  dimension: 'height' | 'weight' | 'temperature' | 'length' | 'volume' | 'speed'
  parse: (match: RegExpMatchArray) => number | null
  format: (value: number, system: MeasurementSystem) => string | null
}

type SystemFlag = 'metric' | 'imperial'

function isImperial(expr: string): SystemFlag {
  const imperialUnits = /(?:ft|feet|foot|in|inch|inches|lbs?|lb|pound|pounds|st|stone|mph|mi|mile|miles|gal|gallon|gallons|°F|\bf\b)/i
  const metricUnits = /(?:cm|m\b|kg|km|kph|kmh|km\/h|l|litre|liters|°C|\bc\b)/i
  const impScore = (expr.match(imperialUnits) || []).length
  const metScore = (expr.match(metricUnits) || []).length
  return impScore > metScore ? 'imperial' : 'metric'
}

function formatNumber(v: number): string {
  return Number.isInteger(v) ? v.toString() : v.toFixed(2)
}

const PATTERNS: ConversionPattern[] = [
  {
    regex: /^(\d+(?:\.\d+)?)\s*(?:ft|feet|foot)(?:\s*(\d+(?:\.\d+)?)\s*(?:in|inch|inches)?)?$/i,
    dimension: 'height',
    parse: (m) => {
      const feet = parseFloat(m[1])
      const inches = m[2] ? parseFloat(m[2]) : 0
      return feet * 30.48 + inches * 2.54
    },
    format: (cm, system) => {
      if (system === 'imperial') {
        const totalIn = cm / 2.54
        const ft = Math.floor(totalIn / 12)
        const inn = Math.round(totalIn % 12)
        return `${ft}ft ${inn}in`
      }
      return null
    },
  },
  {
    regex: /^(\d+(?:\.\d+)?)\s*(?:cm)$/i,
    dimension: 'height',
    parse: (m) => parseFloat(m[1]),
    format: (cm, system) => {
      if (system === 'imperial') {
        const totalIn = cm / 2.54
        const ft = Math.floor(totalIn / 12)
        const inn = Math.round(totalIn % 12)
        return `${ft}ft ${inn}in`
      }
      return null
    },
  },
  {
    regex: /^(\d+(?:\.\d+)?)\s*(?:m)\s*(\d+)?$/i,
    dimension: 'height',
    parse: (m) => parseFloat(m[1]) * 100 + (m[2] ? parseFloat(m[2]) : 0),
    format: (cm, system) => {
      if (system === 'imperial') {
        const totalIn = cm / 2.54
        const ft = Math.floor(totalIn / 12)
        const inn = Math.round(totalIn % 12)
        return `${ft}ft ${inn}in`
      }
      return null
    },
  },
  {
    regex: /^(\d+(?:\.\d+)?)\s*(?:kg)$/i,
    dimension: 'weight',
    parse: (m) => parseFloat(m[1]),
    format: (kg, system) => {
      if (system === 'imperial') return `${formatNumber(kg * 2.20462)}lbs`
      return null
    },
  },
  {
    regex: /^(\d+(?:\.\d+)?)\s*(?:lbs?|lb|pound|pounds)$/i,
    dimension: 'weight',
    parse: (m) => parseFloat(m[1]) / 2.20462,
    format: (kg, system) => {
      if (system === 'metric') return `${formatNumber(kg)}kg`
      return null
    },
  },
  {
    regex: /^(\d+(?:\.\d+)?)\s*(?:st|stone)\s*(\d+(?:\.\d+)?)?\s*(?:lbs?|lb|pound|pounds)?$/i,
    dimension: 'weight',
    parse: (m) => {
      const st = parseFloat(m[1])
      const lb = m[2] ? parseFloat(m[2]) : 0
      return (st * 14 + lb) / 2.20462
    },
    format: (kg, system) => {
      if (system === 'metric') return `${formatNumber(kg)}kg`
      const totalLb = kg * 2.20462
      const st = Math.floor(totalLb / 14)
      const lb = Math.round(totalLb % 14)
      return `${st}st ${lb}lbs`
    },
  },
  {
    regex: /^(\d+(?:\.\d+)?)\s*(?:°?F|°f|f)(?:\s*°?\s*F)?$/i,
    dimension: 'temperature',
    parse: (m) => (parseFloat(m[1]) - 32) * 5 / 9,
    format: (c, system) => {
      if (system === 'metric') return `${formatNumber(c)}°C`
      const f = c * 9 / 5 + 32
      return `${formatNumber(f)}°F`
    },
  },
  {
    regex: /^(\d+(?:\.\d+)?)\s*(?:°?C|°c|c)(?:\s*°?\s*C)?$/i,
    dimension: 'temperature',
    parse: (m) => parseFloat(m[1]),
    format: (c, system) => {
      if (system === 'imperial') {
        const f = c * 9 / 5 + 32
        return `${formatNumber(f)}°F`
      }
      return null
    },
  },
  {
    regex: /^(\d+(?:\.\d+)?)\s*(?:mi|mile|miles)$/i,
    dimension: 'length',
    parse: (m) => parseFloat(m[1]) * 1.60934,
    format: (km, system) => {
      if (system === 'metric') return `${formatNumber(km)}km`
      const mi = km / 1.60934
      return `${formatNumber(mi)}mi`
    },
  },
  {
    regex: /^(\d+(?:\.\d+)?)\s*(?:km)$/i,
    dimension: 'length',
    parse: (m) => parseFloat(m[1]),
    format: (km, system) => {
      if (system === 'imperial') return `${formatNumber(km / 1.60934)}mi`
      return null
    },
  },
  {
    regex: /^(\d+(?:\.\d+)?)\s*(?:mph)$/i,
    dimension: 'speed',
    parse: (m) => parseFloat(m[1]) * 1.60934,
    format: (kph, system) => {
      if (system === 'metric') return `${formatNumber(kph)}km/h`
      const mph = kph / 1.60934
      return `${formatNumber(mph)}mph`
    },
  },
  {
    regex: /^(\d+(?:\.\d+)?)\s*(?:km\/h|kmh|kph)$/i,
    dimension: 'speed',
    parse: (m) => parseFloat(m[1]),
    format: (kph, system) => {
      if (system === 'imperial') return `${formatNumber(kph / 1.60934)}mph`
      return null
    },
  },
  {
    regex: /^(\d+(?:\.\d+)?)\s*(?:gal|gallon|gallons)$/i,
    dimension: 'volume',
    parse: (m) => parseFloat(m[1]) * 3.78541,
    format: (l, system) => {
      if (system === 'metric') return `${formatNumber(l)}L`
      const gal = l / 3.78541
      return `${formatNumber(gal)}gal`
    },
  },
  {
    regex: /^(\d+(?:\.\d+)?)\s*(?:l|litre|liters)$/i,
    dimension: 'volume',
    parse: (m) => parseFloat(m[1]),
    format: (l, system) => {
      if (system === 'imperial') return `${formatNumber(l / 3.78541)}gal`
      return null
    },
  },
]

export function tryAutoConvert(input: string, fieldLabel: string, targetSystem: MeasurementSystem): { value: string; display?: string; converted: boolean } {
  const trimmed = input.trim()
  if (!trimmed || /^\d+(?:\.\d+)?$/.test(trimmed)) return { value: trimmed, converted: false }

  const exprSystem = isImperial(trimmed)

  for (const pattern of PATTERNS) {
    const match = trimmed.match(pattern.regex)
    if (!match) continue

    const baseValue = pattern.parse(match)
    if (baseValue === null || !isFinite(baseValue)) continue

    const numericStr = formatNumber(baseValue)
    const display = pattern.format(baseValue, targetSystem)

    return { value: numericStr, display: display ?? undefined, converted: true }
  }

  return { value: trimmed, converted: false }
}
