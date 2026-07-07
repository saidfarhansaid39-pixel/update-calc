import { NextResponse } from 'next/server'

interface MarketIndex {
  name: string
  symbol: string
  price: number
  change: number
  changePercent: number
}

interface MarketDataResponse {
  indices: MarketIndex[]
  timestamp: string
}

const FALLBACK_DATA: MarketDataResponse = {
  indices: [
    { name: 'S&P 500', symbol: 'SPX', price: 5432.10, change: 23.45, changePercent: 0.43 },
    { name: 'Dow Jones', symbol: 'DJI', price: 38912.50, change: -45.20, changePercent: -0.12 },
    { name: 'NASDAQ', symbol: 'IXIC', price: 17654.80, change: 156.30, changePercent: 0.89 },
    { name: 'FTSE 100', symbol: 'FTSE', price: 8234.60, change: 34.50, changePercent: 0.42 },
    { name: 'DAX', symbol: 'DAX', price: 18456.20, change: 89.10, changePercent: 0.48 },
    { name: 'Nikkei 225', symbol: 'N225', price: 38902.30, change: -234.50, changePercent: -0.60 },
    { name: 'Hang Seng', symbol: 'HSI', price: 17234.80, change: 123.40, changePercent: 0.72 },
    { name: 'Bitcoin', symbol: 'BTC', price: 67432.10, change: 1234.50, changePercent: 1.86 },
  ],
  timestamp: new Date().toISOString(),
}

export async function GET() {
  try {
    const apiKey = process.env.MARKET_DATA_API_KEY
    if (apiKey) {
      const res = await fetch('https://financialmodelingprep.com/api/v3/stock/list', {
        signal: AbortSignal.timeout(5000),
      })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          return NextResponse.json({
            indices: data.slice(0, 20).map((s: any) => ({
              name: s.name || s.symbol,
              symbol: s.symbol,
              price: s.price || 0,
              change: s.change || 0,
              changePercent: s.changesPercentage || 0,
            })),
            timestamp: new Date().toISOString(),
            usingFallback: false,
          })
        }
      }
    }
    return NextResponse.json({ ...FALLBACK_DATA, usingFallback: true })
  } catch {
    return NextResponse.json({ ...FALLBACK_DATA, usingFallback: true })
  }
}
