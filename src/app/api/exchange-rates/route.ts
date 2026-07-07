import { NextResponse } from 'next/server'

const FALLBACK_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, CNY: 7.24, INR: 83.1, CAD: 1.36, AUD: 1.53, BRL: 4.97, MXN: 17.15, CHF: 0.88, KRW: 1320, SEK: 10.45, NOK: 10.55, NZD: 1.63,
}

const BASE_CURRENCY = 'USD'

let cachedRates: Record<string, number> | null = null
let lastFetch = 0
const CACHE_TTL = 3600000

async function fetchLiveRates(): Promise<Record<string, number>> {
  const apiKey = process.env.EXCHANGE_RATES_API_KEY
  if (!apiKey) throw new Error('No API key configured')

  const res = await fetch(`https://open.er-api.com/v6/latest/${BASE_CURRENCY}`, {
    signal: AbortSignal.timeout(5000),
  })

  if (!res.ok) throw new Error(`API returned ${res.status}`)

  const data = await res.json()
  if (data.result !== 'success') throw new Error('API returned error')

  return { ...data.rates, [BASE_CURRENCY]: 1 }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = (searchParams.get('from') || 'USD').toUpperCase()
  const to = (searchParams.get('to') || 'EUR').toUpperCase()
  const amount = parseFloat(searchParams.get('amount') || '1')

  try {
    const now = Date.now()
    if (!cachedRates || now - lastFetch > CACHE_TTL) {
      cachedRates = await fetchLiveRates()
      lastFetch = now
    }
  } catch {
    cachedRates = FALLBACK_RATES
  }

  const fromRate = cachedRates[from] || 1
  const toRate = cachedRates[to] || 1
  const converted = (amount / fromRate) * toRate

  return NextResponse.json({
    base: BASE_CURRENCY,
    from,
    to,
    amount,
    result: parseFloat(converted.toFixed(6)),
    rate: parseFloat((toRate / fromRate).toFixed(6)),
    timestamp: new Date().toISOString(),
    usingFallback: cachedRates === FALLBACK_RATES,
    available: Object.keys(cachedRates),
  })
}
