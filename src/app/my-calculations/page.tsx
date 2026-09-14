import type { Metadata } from 'next'
import MyCalculationsPage from './PageClient'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const metadata: Metadata = {
  title: 'My Calculations | Calculat',
  description: 'Calculations you have saved across Calculat.',
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteUrl}/my-calculations` },
  openGraph: { title: 'My Calculations | Calculat', url: `${siteUrl}/my-calculations`, siteName: 'Calculat', type: 'website' },
}

export const dynamic = 'force-static'

export default MyCalculationsPage