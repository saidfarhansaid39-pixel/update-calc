import { NextResponse } from 'next/server'
import { log } from '@/lib/logger'

export const dynamic = 'force-dynamic'

const APP_VERSION = '0.1.0'

export async function GET() {
  log('info', 'health check', { route: '/api/health' })
  return NextResponse.json({
    status: 'ok',
    ts: new Date().toISOString(),
    version: APP_VERSION,
  })
}
