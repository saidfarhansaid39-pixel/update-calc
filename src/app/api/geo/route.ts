import { NextResponse } from 'next/server'
import { currencyForCountry } from '@/lib/currencies'

export function GET(request: Request) {
  const country = request.headers.get('x-vercel-ip-country') || ''
  const currency = currencyForCountry(country)
  return NextResponse.json({ country, currency })
}
