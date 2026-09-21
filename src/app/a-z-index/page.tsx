import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'
import { calculatorRegistry } from '@calcuniverse/calculator-registry'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const dynamic = 'force-static'

export async function generateMetadata() {
  return {
    title: 'A-Z Index of All Calculators Online — Calculat',
    description: 'Browse every Calculat calculator online from A to Z. Find the perfect calculator online for your needs with our complete alphabetical index of 4,270+ tools.',
    alternates: { canonical: siteUrl + '/a-z-index' },
    openGraph: { title: 'A-Z Index of All Calculators Online — Calculat', description: 'Browse every Calculat calculator online from A to Z.', url: siteUrl + '/a-z-index', siteName: 'Calculat', type: 'website', images: [{ url: siteUrl + '/og-image.png', width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title: 'A-Z Index of All Calculators Online — Calculat', description: 'Browse every Calculat calculator online from A to Z.' },
  }
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const grouped = new Map<string, typeof calculatorRegistry>()
for (const calc of calculatorRegistry) {
  if (/\d$/.test(calc.slug)) continue
  const first = calc.title.charAt(0).toUpperCase()
  const key = /[A-Z]/.test(first) ? first : '#'
  if (!grouped.has(key)) grouped.set(key, [])
  grouped.get(key)!.push(calc)
}

export default async function AZIndexPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">A-Z Index</li>
        </ol>
      </nav>
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbListSchema([
        { name: 'Home', url: siteUrl },
        { name: 'A-Z Index', url: siteUrl + '/a-z-index' },
      ])} />
      <h1 className="text-3xl font-bold mb-2">A-Z Index of All Calculators Online</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Browse all {calculatorRegistry.length.toLocaleString()}+ calculator online tools alphabetically. Click a letter to jump to that section.</p>
      <nav className="sticky top-16 z-10 flex flex-wrap gap-1.5 mb-8 p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-lg border border-gray-200 dark:border-gray-800" aria-label="Letter navigation">
        {LETTERS.map(l => {
          const hasEntries = grouped.has(l)
          return hasEntries ? (
            <a key={l} href={'#letter-' + l} className="inline-flex items-center justify-center w-8 h-8 rounded text-sm font-medium text-primary hover:bg-primary/10 transition-colors">{l}</a>
          ) : (
            <span key={l} className="inline-flex items-center justify-center w-8 h-8 rounded text-sm text-gray-300 dark:text-gray-600">{l}</span>
          )
        })}
        {grouped.has('#') && (
          <a href="#letter-#" className="inline-flex items-center justify-center w-8 h-8 rounded text-sm font-medium text-primary hover:bg-primary/10 transition-colors">#</a>
        )}
      </nav>
      <div className="space-y-8">
        {LETTERS.map(l => {
          const entries = grouped.get(l)
          if (!entries) return null
          return (
            <section key={l} id={'letter-' + l}>
              <h2 className="sticky top-32 text-2xl font-bold text-primary border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">{l}</h2>
              <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                {entries.map(calc => (
                  <li key={calc.slug}>
                    <Link href={'/' + calc.hubSlug + '/' + calc.slug} className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                      {calc.title}
                      <span className="ml-1.5 inline-block rounded-full bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500 dark:text-gray-400">{calc.hubName}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
        {grouped.has('#') && (
          <section id="letter-#">
            <h2 className="sticky top-32 text-2xl font-bold text-primary border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">#</h2>
            <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {grouped.get('#')!.map(calc => (
                <li key={calc.slug}>
                  <Link href={'/' + calc.hubSlug + '/' + calc.slug} className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                    {calc.title}
                    <span className="ml-1.5 inline-block rounded-full bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500 dark:text-gray-400">{calc.hubName}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
