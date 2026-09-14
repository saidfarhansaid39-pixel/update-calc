import type { Metadata } from 'next'
import SuggestCalculatorPage from './PageClient'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const metadata: Metadata = {
  title: 'Suggest a Calculator | Calculat',
  description: 'Have an idea for a new calculator? Submit your suggestion to Calculat and help us build the tools you need.',
  robots: { index: true, follow: true },
  alternates: { canonical: `${siteUrl}/suggest-calculator` },
  openGraph: {
    title: 'Suggest a Calculator | Calculat',
    description: 'Have an idea for a new calculator? Submit your suggestion to Calculat and help us build the tools you need.',
    url: `${siteUrl}/suggest-calculator`,
    siteName: 'Calculat',
    type: 'website',
  },
}

export const dynamic = 'force-static'

export default SuggestCalculatorPage