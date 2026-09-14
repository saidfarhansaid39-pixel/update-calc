import type { Metadata } from 'next'
import LoginPage from './PageClient'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const metadata: Metadata = {
  title: 'Log in | Calculat',
  description: 'Log in to Calculat to access your saved calculations and premium features.',
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteUrl}/login` },
  openGraph: { title: 'Log in | Calculat', url: `${siteUrl}/login`, siteName: 'Calculat', type: 'website' },
}

export const dynamic = 'force-static'

export default LoginPage