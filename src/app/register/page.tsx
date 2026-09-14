import type { Metadata } from 'next'
import RegisterPage from './PageClient'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const metadata: Metadata = {
  title: 'Create your account | Calculat',
  description: 'Create a free Calculat account to save calculations, build collections, and unlock more.',
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteUrl}/register` },
  openGraph: { title: 'Create your account | Calculat', url: `${siteUrl}/register`, siteName: 'Calculat', type: 'website' },
}

export const dynamic = 'force-static'

export default RegisterPage