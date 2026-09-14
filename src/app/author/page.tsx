import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'
import { AUTHOR_LIST } from '@/lib/authors'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const dynamic = 'force-static'

export async function generateMetadata() {
  const title = 'Our Expert Authors & Reviewers — Calculat'
  const description = 'Every Calculat calculator is reviewed by a qualified expert. Meet our team of doctors, financial analysts, engineers, and educators who ensure accuracy.'
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/author` },
    openGraph: { title, description, url: `${siteUrl}/author`, siteName: 'Calculat', type: 'website', images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description },
  }
}

function AuthorAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700 ring-2 ring-gray-200 dark:bg-blue-900/50 dark:text-blue-300 dark:ring-gray-700">
      {initials}
    </div>
  )
}

export default async function AuthorListingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">Our Experts</li>
        </ol>
      </nav>
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbListSchema([
        { name: 'Home', url: siteUrl },
        { name: 'Our Experts', url: `${siteUrl}/author` },
      ])} />
      <h1 className="text-3xl font-bold mb-2">Our Expert Authors & Reviewers</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Every calculator on Calculat is reviewed by a qualified professional. Our team includes doctors, financial analysts, engineers, and educators who verify the accuracy of every formula and guide.
      </p>
      <div className="space-y-6">
        {AUTHOR_LIST.map((author) => (
          <div key={author.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-start gap-4">
              <AuthorAvatar name={author.name} />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{author.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{author.credentials}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{author.bio}</p>
                <Link
                  href={`/author/${author.id}`}
                  className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                >
                  View reviewed calculators →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
