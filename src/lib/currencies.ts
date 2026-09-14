export const CURRENCY_OPTIONS = [
  { label: 'USD ($)', value: 'USD' },
  { label: 'EUR (€)', value: 'EUR' },
  { label: 'GBP (£)', value: 'GBP' },
  { label: 'JPY (¥)', value: 'JPY' },
  { label: 'CNY (¥)', value: 'CNY' },
  { label: 'INR (₹)', value: 'INR' },
  { label: 'CAD ($)', value: 'CAD' },
  { label: 'AUD ($)', value: 'AUD' },
  { label: 'CHF (Fr)', value: 'CHF' },
  { label: 'HKD ($)', value: 'HKD' },
  { label: 'SGD ($)', value: 'SGD' },
  { label: 'SEK (kr)', value: 'SEK' },
  { label: 'KRW (₩)', value: 'KRW' },
  { label: 'NOK (kr)', value: 'NOK' },
  { label: 'NZD ($)', value: 'NZD' },
  { label: 'MXN ($)', value: 'MXN' },
  { label: 'TWD ($)', value: 'TWD' },
  { label: 'ZAR (R)', value: 'ZAR' },
  { label: 'BRL (R$)', value: 'BRL' },
  { label: 'TRY (₺)', value: 'TRY' },
]

export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CNY: 7.24,
  INR: 83.5,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.88,
  HKD: 7.82,
  SGD: 1.34,
  SEK: 10.45,
  KRW: 1320,
  NOK: 10.65,
  NZD: 1.63,
  MXN: 17.15,
  TWD: 32.2,
  ZAR: 18.5,
  BRL: 4.95,
  TRY: 30.2,
}

export function convertCurrency(amount: number, from: string, to: string): number {
  const usdAmount = amount / (EXCHANGE_RATES[from] ?? 1)
  return usdAmount * (EXCHANGE_RATES[to] ?? 1)
}

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: 'USD', CA: 'CAD', GB: 'GBP', DE: 'EUR', FR: 'EUR', IT: 'EUR',
  ES: 'EUR', NL: 'EUR', BE: 'EUR', AT: 'EUR', IE: 'EUR', PT: 'EUR',
  FI: 'EUR', GR: 'EUR', LU: 'EUR', EE: 'EUR', LT: 'EUR', LV: 'EUR',
  SK: 'EUR', SI: 'EUR', CY: 'EUR', MT: 'EUR', HR: 'EUR',
  JP: 'JPY', CN: 'CNY', IN: 'INR', AU: 'AUD', CH: 'CHF',
  HK: 'HKD', SG: 'SGD', SE: 'SEK', KR: 'KRW', NO: 'NOK',
  NZ: 'NZD', MX: 'MXN', TW: 'TWD', ZA: 'ZAR', BR: 'BRL',
  TR: 'TRY', DK: 'DKK', PL: 'PLN', CZ: 'CZK', HU: 'HUF',
  RO: 'RON', BG: 'BGN', TH: 'THB', MY: 'MYR', ID: 'IDR',
  PH: 'PHP', VN: 'VND', AE: 'AED', SA: 'SAR', IL: 'ILS',
  RU: 'RUB', AR: 'ARS', CL: 'CLP', CO: 'COP', PE: 'PEN',
  EG: 'EGP', NG: 'NGN', KE: 'KES', MA: 'MAD', PK: 'PKR',
  BD: 'BDT', LK: 'LKR', NP: 'NPR', MM: 'MMK',
}

export function currencyForCountry(countryCode: string): string {
  return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] ?? 'USD'
}
