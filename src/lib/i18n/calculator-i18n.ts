export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'INR' | 'CAD' | 'AUD' | 'BRL' | 'MXN' | 'CHF' | 'KRW' | 'SEK' | 'NOK' | 'NZD' | 'RUB' | 'SAR' | 'MAD' | 'EGP' | 'AED' | 'TND' | 'DZD' | 'ILS' | 'TRY' | 'PLN' | 'CZK' | 'HUF' | 'DKK' | 'SGD' | 'HKD' | 'ZAR' | 'NGN' | 'IDR' | 'MYR' | 'PHP' | 'THB' | 'VND' | 'PKR' | 'BDT' | 'CLP' | 'COP' | 'PEN' | 'ARS'

export type Locale = 'en-US' | 'en-GB' | 'en-IN' | 'en-CA' | 'en-AU' | 'en-NZ' | 'en-SG' | 'en-ZA' | 'en-NG' | 'fr-FR' | 'fr-CH' | 'de-DE' | 'de-CH' | 'es-ES' | 'es-MX' | 'es-CL' | 'es-CO' | 'es-PE' | 'es-AR' | 'it-IT' | 'it-CH' | 'pt-BR' | 'ja-JP' | 'zh-CN' | 'zh-HK' | 'ko-KR' | 'sv-SE' | 'nb-NO' | 'da-DK' | 'fi-FI' | 'ar-MA' | 'ar-EG' | 'ar-AE' | 'ar-TN' | 'ar-DZ' | 'ar-SA' | 'he-IL' | 'tr-TR' | 'pl-PL' | 'cs-CZ' | 'hu-HU' | 'id-ID' | 'ms-MY' | 'fil-PH' | 'th-TH' | 'vi-VN' | 'ur-PK' | 'bn-BD' | 'hi-IN'

export type MeasurementSystem = 'metric' | 'imperial' | 'us'

interface CountryConfig {
  currency: Currency
  locale: Locale
  measurement: MeasurementSystem
  taxRate: number
  dateFormat: string
  timeFormat: string
  weekStartsOn: 0 | 1
}

export const countryConfigs: Record<string, CountryConfig> = {
  US: { currency: 'USD', locale: 'en-US', measurement: 'us', taxRate: 0.07, dateFormat: 'MM/DD/YYYY', timeFormat: 'h:mm A', weekStartsOn: 0 },
  GB: { currency: 'GBP', locale: 'en-GB', measurement: 'metric', taxRate: 0.20, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  DE: { currency: 'EUR', locale: 'de-DE', measurement: 'metric', taxRate: 0.19, dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  FR: { currency: 'EUR', locale: 'fr-FR', measurement: 'metric', taxRate: 0.20, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  JP: { currency: 'JPY', locale: 'ja-JP', measurement: 'metric', taxRate: 0.10, dateFormat: 'YYYY/MM/DD', timeFormat: 'HH:mm', weekStartsOn: 1 },
  CN: { currency: 'CNY', locale: 'zh-CN', measurement: 'metric', taxRate: 0.13, dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm', weekStartsOn: 1 },
  IN: { currency: 'INR', locale: 'en-IN', measurement: 'metric', taxRate: 0.18, dateFormat: 'DD/MM/YYYY', timeFormat: 'hh:mm A', weekStartsOn: 1 },
  CA: { currency: 'CAD', locale: 'en-CA', measurement: 'metric', taxRate: 0.13, dateFormat: 'YYYY-MM-DD', timeFormat: 'h:mm A', weekStartsOn: 0 },
  AU: { currency: 'AUD', locale: 'en-AU', measurement: 'metric', taxRate: 0.10, dateFormat: 'DD/MM/YYYY', timeFormat: 'h:mm A', weekStartsOn: 1 },
  BR: { currency: 'BRL', locale: 'pt-BR', measurement: 'metric', taxRate: 0.17, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  MX: { currency: 'MXN', locale: 'es-MX', measurement: 'metric', taxRate: 0.16, dateFormat: 'DD/MM/YYYY', timeFormat: 'h:mm A', weekStartsOn: 1 },
  KR: { currency: 'KRW', locale: 'ko-KR', measurement: 'metric', taxRate: 0.10, dateFormat: 'YYYY.MM.DD', timeFormat: 'A h:mm', weekStartsOn: 1 },
  SE: { currency: 'SEK', locale: 'sv-SE', measurement: 'metric', taxRate: 0.25, dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm', weekStartsOn: 1 },
  NO: { currency: 'NOK', locale: 'nb-NO', measurement: 'metric', taxRate: 0.25, dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  CH: { currency: 'CHF', locale: 'de-CH', measurement: 'metric', taxRate: 0.077, dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  NZ: { currency: 'NZD', locale: 'en-NZ', measurement: 'metric', taxRate: 0.15, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  FI: { currency: 'EUR', locale: 'fi-FI', measurement: 'metric', taxRate: 0.255, dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  'CH-fr': { currency: 'CHF', locale: 'fr-CH', measurement: 'metric', taxRate: 0.081, dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  'CH-it': { currency: 'CHF', locale: 'it-CH', measurement: 'metric', taxRate: 0.081, dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  MA: { currency: 'MAD', locale: 'ar-MA', measurement: 'metric', taxRate: 0.20, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  EG: { currency: 'EGP', locale: 'ar-EG', measurement: 'metric', taxRate: 0.14, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  AE: { currency: 'AED', locale: 'ar-AE', measurement: 'metric', taxRate: 0.05, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  SA: { currency: 'SAR', locale: 'ar-SA', measurement: 'metric', taxRate: 0.15, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 0 },
  TN: { currency: 'TND', locale: 'ar-TN', measurement: 'metric', taxRate: 0.19, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  DZ: { currency: 'DZD', locale: 'ar-DZ', measurement: 'metric', taxRate: 0.19, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  IL: { currency: 'ILS', locale: 'he-IL', measurement: 'metric', taxRate: 0.17, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 0 },
  TR: { currency: 'TRY', locale: 'tr-TR', measurement: 'metric', taxRate: 0.18, dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  PL: { currency: 'PLN', locale: 'pl-PL', measurement: 'metric', taxRate: 0.23, dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  CZ: { currency: 'CZK', locale: 'cs-CZ', measurement: 'metric', taxRate: 0.21, dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  HU: { currency: 'HUF', locale: 'hu-HU', measurement: 'metric', taxRate: 0.27, dateFormat: 'YYYY.MM.DD', timeFormat: 'HH:mm', weekStartsOn: 1 },
  DK: { currency: 'DKK', locale: 'da-DK', measurement: 'metric', taxRate: 0.25, dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  SG: { currency: 'SGD', locale: 'en-SG', measurement: 'metric', taxRate: 0.09, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  HK: { currency: 'HKD', locale: 'zh-HK', measurement: 'metric', taxRate: 0.165, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 0 },
  ZA: { currency: 'ZAR', locale: 'en-ZA', measurement: 'metric', taxRate: 0.15, dateFormat: 'YYYY/MM/DD', timeFormat: 'HH:mm', weekStartsOn: 1 },
  NG: { currency: 'NGN', locale: 'en-NG', measurement: 'metric', taxRate: 0.075, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  ID: { currency: 'IDR', locale: 'id-ID', measurement: 'metric', taxRate: 0.11, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  MY: { currency: 'MYR', locale: 'ms-MY', measurement: 'metric', taxRate: 0.06, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  PH: { currency: 'PHP', locale: 'fil-PH', measurement: 'metric', taxRate: 0.12, dateFormat: 'MM/DD/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  TH: { currency: 'THB', locale: 'th-TH', measurement: 'metric', taxRate: 0.07, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  VN: { currency: 'VND', locale: 'vi-VN', measurement: 'metric', taxRate: 0.10, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  PK: { currency: 'PKR', locale: 'ur-PK', measurement: 'metric', taxRate: 0.17, dateFormat: 'DD/MM/YYYY', timeFormat: 'hh:mm A', weekStartsOn: 1 },
  BD: { currency: 'BDT', locale: 'bn-BD', measurement: 'metric', taxRate: 0.15, dateFormat: 'DD/MM/YYYY', timeFormat: 'hh:mm A', weekStartsOn: 1 },
  CL: { currency: 'CLP', locale: 'es-CL', measurement: 'metric', taxRate: 0.19, dateFormat: 'DD-MM-YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  CO: { currency: 'COP', locale: 'es-CO', measurement: 'metric', taxRate: 0.19, dateFormat: 'DD/MM/YYYY', timeFormat: 'h:mm A', weekStartsOn: 1 },
  PE: { currency: 'PEN', locale: 'es-PE', measurement: 'metric', taxRate: 0.18, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  AR: { currency: 'ARS', locale: 'es-AR', measurement: 'metric', taxRate: 0.21, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
}

export const currencySymbols: Record<Currency, string> = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥', INR: '₹', CAD: 'C$', AUD: 'A$',
  BRL: 'R$', MXN: 'Mex$', CHF: 'CHF', KRW: '₩', SEK: 'kr', NOK: 'kr', NZD: 'NZ$',
  RUB: '₽', SAR: '﷼', MAD: 'MAD', EGP: 'E£', AED: 'د.إ', TND: 'DT', DZD: 'د.ج',
  ILS: '₪', TRY: '₺', PLN: 'zł', CZK: 'Kč', HUF: 'Ft', DKK: 'kr.',
  SGD: 'S$', HKD: 'HK$', ZAR: 'R', NGN: '₦', IDR: 'Rp', MYR: 'RM',
  PHP: '₱', THB: '฿', VND: '₫', PKR: '₨', BDT: '৳', CLP: '$', COP: '$',
  PEN: 'S/', ARS: '$',
}

// Maps next-intl short locale codes (used across the app) to BCP-47 tags that
// Intl.* understands. Unknown / already-BCP-47 values pass through unchanged.
const SHORT_TO_BCP47: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  pt: 'pt-BR',
  ru: 'ru-RU',
  ar: 'ar',
  hi: 'hi-IN',
  ja: 'ja-JP',
  'zh-CN': 'zh-CN',
}

export function resolveLocale(locale: string): string {
  if (!locale) return 'en-US'
  if (SHORT_TO_BCP47[locale]) return SHORT_TO_BCP47[locale]
  return locale
}

const SHORT_TO_CURRENCY: Record<string, Currency> = {
  en: 'USD',
  es: 'EUR',
  fr: 'EUR',
  de: 'EUR',
  pt: 'BRL',
  ru: 'RUB',
  ar: 'SAR',
  hi: 'INR',
  ja: 'JPY',
  'zh-CN': 'CNY',
}

export function localeToCurrency(locale: string): Currency {
  const short = locale.substring(0, 2)
  const key = locale.startsWith('zh') && locale.includes('CN') ? 'zh-CN' : short
  return SHORT_TO_CURRENCY[key] || 'USD'
}

const SHORT_TO_COUNTRY: Record<string, string> = {
  en: 'US',
  es: 'ES',
  fr: 'FR',
  de: 'DE',
  pt: 'BR',
  ru: 'RU',
  ar: 'SA',
  hi: 'IN',
  ja: 'JP',
  'zh-CN': 'CN',
}

export function localeToCountry(locale: string): string {
  if (!locale) return 'US'
  const short = locale.substring(0, 2)
  const key = locale.startsWith('zh') && locale.includes('CN') ? 'zh-CN' : short
  return SHORT_TO_COUNTRY[key] || 'US'
}

export function localeToMeasurementSystem(locale: string): MeasurementSystem {
  const country = localeToCountry(locale)
  const config = countryConfigs[country]
  return config?.measurement || 'metric'
}

export function localeToDateLocale(locale: string): string {
  const country = localeToCountry(locale)
  const config = countryConfigs[country]
  return config?.locale || 'en-US'
}

export function localeToDateFormat(locale: string): string {
  const country = localeToCountry(locale)
  const config = countryConfigs[country]
  return config?.dateFormat || 'MM/DD/YYYY'
}

export function localeToTimeFormat(locale: string): string {
  const country = localeToCountry(locale)
  const config = countryConfigs[country]
  return config?.timeFormat || 'h:mm A'
}

export function formatCurrency(
  value: number,
  currency: Currency,
  locale: string = 'en-US',
  opts?: Intl.NumberFormatOptions,
): string {
  const loc = resolveLocale(locale)
  try {
    const isWhole = Number.isInteger(value)
    return new Intl.NumberFormat(loc, {
      style: 'currency',
      currency,
      minimumFractionDigits: isWhole && !opts?.minimumFractionDigits ? 0 : undefined,
      ...opts,
    }).format(value)
  } catch {
    return `${currencySymbols[currency] || '$'}${value.toFixed(opts?.minimumFractionDigits ?? (Number.isInteger(value) ? 0 : 2))}`
  }
}

export function formatNumber(value: number, locale: string = 'en-US', decimals = 2): string {
  const loc = resolveLocale(locale)
  try {
    return new Intl.NumberFormat(loc, { maximumFractionDigits: decimals }).format(value)
  } catch {
    return value.toFixed(decimals)
  }
}

export function formatPercent(value: number, locale: string = 'en-US', decimals = 2): string {
  const loc = resolveLocale(locale)
  try {
    return new Intl.NumberFormat(loc, {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    }).format(value)
  } catch {
    return `${(value * 100).toFixed(decimals)}%`
  }
}

export function formatDate(date: Date, locale: string = 'en-US'): string {
  const loc = resolveLocale(locale)
  try {
    return new Intl.DateTimeFormat(loc, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
  } catch {
    return date.toLocaleDateString()
  }
}

export function formatDateTime(date: Date, locale: string = 'en-US'): string {
  const loc = resolveLocale(locale)
  try {
    return new Intl.DateTimeFormat(loc, { dateStyle: 'short', timeStyle: 'short' }).format(date)
  } catch {
    return date.toLocaleString()
  }
}

export function convertMeasurement(value: number, from: MeasurementSystem, to: MeasurementSystem, dimension: 'length' | 'mass' | 'volume' | 'temperature'): number {
  if (from === to) return value
  const inMetric = (v: number, sys: MeasurementSystem): number => {
    if (dimension === 'length') {
      if (sys === 'imperial' || sys === 'us') return v * 0.3048 * 3.28084
      return v
    }
    return v
  }
  const fromMetric = (v: number, sys: MeasurementSystem): number => {
    if (dimension === 'length') {
      if (sys === 'imperial' || sys === 'us') return v / 0.3048 / 3.28084
      return v
    }
    return v
  }
  const metric = inMetric(value, from)
  return fromMetric(metric, to)
}

export const countryNames: Record<string, string> = {
  US: 'United States', GB: 'United Kingdom', DE: 'Germany', FR: 'France',
  JP: 'Japan', CN: 'China', IN: 'India', CA: 'Canada', AU: 'Australia',
  BR: 'Brazil', MX: 'Mexico', KR: 'South Korea', SE: 'Sweden', NO: 'Norway', CH: 'Switzerland',
  NZ: 'New Zealand', FI: 'Finland', 'CH-fr': 'Switzerland (French)', 'CH-it': 'Switzerland (Italian)',
  MA: 'Morocco', EG: 'Egypt', AE: 'United Arab Emirates', SA: 'Saudi Arabia',
  TN: 'Tunisia', DZ: 'Algeria', IL: 'Israel', TR: 'Turkey',
  PL: 'Poland', CZ: 'Czech Republic', HU: 'Hungary', DK: 'Denmark',
  SG: 'Singapore', HK: 'Hong Kong', ZA: 'South Africa', NG: 'Nigeria',
  ID: 'Indonesia', MY: 'Malaysia', PH: 'Philippines', TH: 'Thailand',
  VN: 'Vietnam', PK: 'Pakistan', BD: 'Bangladesh', CL: 'Chile',
  CO: 'Colombia', PE: 'Peru', AR: 'Argentina',
}
