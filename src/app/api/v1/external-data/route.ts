import { NextResponse } from 'next/server'

interface ExternalDataConfig {
  key: string
  source: string
  refreshCadence: string
}

const DATA_CALCULATORS: Record<string, ExternalDataConfig> = {
  'currency-calculator': { key: 'exchange-rates', source: 'Open Exchange Rates API', refreshCadence: 'Daily' },
  'inflation-calculator': { key: 'cpi-data', source: 'Bureau of Labor Statistics', refreshCadence: 'Monthly' },
  'income-tax-calculator': { key: 'tax-brackets', source: 'IRS', refreshCadence: 'On legislative change' },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const calculatorSlug = searchParams.get('calculator')
  
  if (!calculatorSlug || !DATA_CALCULATORS[calculatorSlug]) {
    return NextResponse.json({ error: 'Unknown calculator' }, { status: 404 })
  }

  const config = DATA_CALCULATORS[calculatorSlug]

  return NextResponse.json({
    calculator: calculatorSlug,
    dataset: config.key,
    source: config.source,
    refreshCadence: config.refreshCadence,
    lastUpdated: null,
    data: null,
    message: 'Data refresh job not yet configured. See TODO: implement Vercel Cron job for scheduled data refresh.',
  })
}
