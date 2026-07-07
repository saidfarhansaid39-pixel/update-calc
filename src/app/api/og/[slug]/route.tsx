import { ImageResponse } from 'next/og'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'
import { calculatorRegistry } from '@calcuniverse/calculator-registry'
import { getLocalizedCalculator } from '@/lib/localized-registry'

export const runtime = 'nodejs'

const categoryColors: Record<string, string> = {
  financial: 'from-emerald-500 to-teal-600',
  health: 'from-rose-500 to-pink-600',
  math: 'from-blue-500 to-indigo-600',
  conversion: 'from-violet-500 to-purple-600',
  'date-time': 'from-cyan-500 to-blue-600',
  construction: 'from-amber-500 to-orange-600',
  statistics: 'from-sky-500 to-cyan-600',
  education: 'from-fuchsia-500 to-pink-600',
  physics: 'from-red-500 to-rose-600',
  chemistry: 'from-lime-500 to-green-600',
  engineering: 'from-yellow-500 to-amber-600',
  everyday: 'from-teal-500 to-emerald-600',
  food: 'from-orange-500 to-red-600',
  biology: 'from-green-500 to-lime-600',
  ecology: 'from-teal-500 to-cyan-600',
  sports: 'from-blue-500 to-sky-600',
}

const categoryBadgeColors: Record<string, string> = {
  financial: 'bg-emerald-500',
  health: 'bg-rose-500',
  math: 'bg-blue-500',
  conversion: 'bg-violet-500',
  'date-time': 'bg-cyan-500',
  construction: 'bg-amber-500',
  statistics: 'bg-sky-500',
  education: 'bg-fuchsia-500',
  physics: 'bg-red-500',
  chemistry: 'bg-lime-500',
  engineering: 'bg-yellow-500',
  everyday: 'bg-teal-500',
  food: 'bg-orange-500',
  biology: 'bg-green-500',
  ecology: 'bg-teal-500',
  sports: 'bg-blue-500',
}

const localeNames: Record<string, string> = {
  es: 'ES', fr: 'FR', de: 'DE', pt: 'PT', ru: 'RU',
  ar: 'AR', hi: 'HI', ja: 'JA', 'zh-CN': 'ZH',
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale')
  const localeBadge = locale && locale !== 'en' ? localeNames[locale] || locale.toUpperCase() : null

  const calc = await getLocalizedCalculator(slug, locale ?? 'en')

  if (!calc) {
    return new Response('Calculator not found', { status: 404 })
  }

  const gradient = categoryColors[calc.category] || 'from-gray-500 to-slate-600'
  const badgeColor = categoryBadgeColors[calc.category] || 'bg-gray-500'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
          fontFamily: '"Inter", "system-ui", sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: `radial-gradient(circle at 30% 40%, rgba(52, 160, 164, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 70% 60%, rgba(52, 160, 164, 0.1) 0%, transparent 40%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: `linear-gradient(90deg, #06b6d4, #1a3a8a, #06b6d4)`,
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 80px',
            maxWidth: 1000,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                padding: '6px 18px',
                borderRadius: 9999,
                fontSize: 16,
                fontWeight: 700,
                color: '#fff',
                textTransform: 'capitalize',
                background: badgeColor,
              }}
            >
              {calc.hubName || calc.category}
            </span>
            {localeBadge && (
              <span
                style={{
                  display: 'inline-flex',
                  padding: '6px 14px',
                  borderRadius: 9999,
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#fff',
                  background: '#1a3a8a',
                  letterSpacing: '0.05em',
                }}
              >
                {localeBadge}
              </span>
            )}
          </div>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: '#f8fafc',
              margin: '0 0 16px 0',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            {calc.title}
          </h1>
          <p
            style={{
              fontSize: 22,
              color: '#94a3b8',
              margin: '0 0 32px 0',
              lineHeight: 1.5,
              maxWidth: 700,
            }}
          >
            {calc.description.length > 150
              ? calc.description.slice(0, 147) + '...'
              : calc.description}
          </p>
          {calc.formulaSource && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 12,
                background: 'rgba(52, 160, 164, 0.1)',
                border: '1px solid rgba(52, 160, 164, 0.2)',
                marginBottom: 32,
              }}
            >
              <span style={{ fontSize: 18, color: '#5eead4', fontWeight: 600 }}>
                Formula:
              </span>
              <span
                style={{
                  fontSize: 20,
                  color: '#e2e8f0',
                  fontWeight: 500,
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                {calc.formulaSource}
              </span>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: calc.formulaSource ? 0 : 32,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="#1a3a8a" />
              <text
                x="12"
                y="16"
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
              >
                C
              </text>
            </svg>
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#1a3a8a',
                letterSpacing: '0.05em',
              }}
            >
              CALCULATOR UNIVERSE
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  )
}
