import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const dynamic = 'force-static'

export async function generateMetadata() {
  const title = 'Cooking Measurement Conversion Guide: Cups, Grams, Ounces & More — Calculat Blog'
  const description = 'Convert cooking measurements instantly between cups, grams, ounces, milliliters, and teaspoons. Essential kitchen conversion charts and tips.'
  return {
    title, description,
    alternates: { canonical: `${siteUrl}/blog/conversion-cooking-guide` },
    openGraph: { title, description, url: `${siteUrl}/blog/conversion-cooking-guide`, siteName: 'Calculat', type: 'article', publishedTime: '2026-07-19', images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function CookingConversionPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">Cooking Measurement Conversion Guide</li>
        </ol>
      </nav>
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbListSchema([
        { name: 'Home', url: siteUrl }, { name: 'Blog', url: `${siteUrl}/blog` }, { name: 'Cooking Measurement Conversion Guide', url: `${siteUrl}/blog/conversion-cooking-guide` },
      ])} />
      <SchemaMarkup type="Article" data={{
        '@type': 'Article', headline: 'Cooking Measurement Conversion Guide', datePublished: '2026-07-19', dateModified: '2026-07-19',
        author: { '@type': 'Person', name: 'Priya Sharma, PE' },
        publisher: { '@type': 'Organization', name: 'Calculat', logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.svg` } },
        description: 'Convert cooking measurements between cups, grams, ounces, and more.', mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/conversion-cooking-guide` },
      }} />
      <h1 className="text-3xl font-bold mb-2">Cooking Measurement Conversion Guide</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <time dateTime="2026-07-19">July 19, 2026</time><span aria-hidden="true">·</span><span>Priya Sharma, PE</span>
      </div>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>Whether you are following a recipe from another country or scaling a dish for more servings, converting cooking measurements accurately is essential. This guide covers the most common kitchen conversions and explains why weight measurements are more accurate than volume.</p>

        <h2>Volume Conversions (US to Metric)</h2>
        <ul>
          <li>1 teaspoon = 5 mL</li>
          <li>1 tablespoon = 15 mL (3 teaspoons)</li>
          <li>1 fluid ounce = 30 mL</li>
          <li>1 cup = 240 mL</li>
          <li>1 pint = 480 mL (2 cups)</li>
          <li>1 quart = 960 mL (4 cups)</li>
          <li>1 gallon = 3.84 L (16 cups)</li>
        </ul>

        <h2>Weight Conversions</h2>
        <ul>
          <li>1 ounce = 28.35 grams</li>
          <li>1 pound = 454 grams (16 ounces)</li>
          <li>1 kilogram = 2.205 pounds</li>
        </ul>

        <h2>Common Ingredient Weights</h2>
        <p>Volume-to-weight conversion depends on density. Here are approximate weights for common ingredients:</p>
        <ul>
          <li>All-purpose flour: 1 cup = 120 g</li>
          <li>Granulated sugar: 1 cup = 200 g</li>
          <li>Butter: 1 cup = 227 g (2 sticks)</li>
          <li>Brown sugar (packed): 1 cup = 220 g</li>
          <li>Honey: 1 cup = 340 g</li>
          <li>Rolled oats: 1 cup = 90 g</li>
        </ul>

        <h2>Temperature Conversions</h2>
        <ul>
          <li><strong>Fahrenheit to Celsius:</strong> (°F - 32) × 5/9 = °C</li>
          <li><strong>Celsius to Fahrenheit:</strong> (°C × 9/5) + 32 = °F</li>
          <li>350°F = 177°C (common baking temperature)</li>
          <li>400°F = 204°C</li>
          <li>450°F = 232°C</li>
        </ul>

        <h2>Use Our Conversion Tools</h2>
        <p>Instead of memorizing all these numbers, bookmark our free <Link href="/conversion-calculators/cups-to-ml" className="text-primary hover:underline">cups to mL converter</Link> and <Link href="/conversion-calculators/ounces-to-grams" className="text-primary hover:underline">ounces to grams converter</Link>. For temperature, use our <Link href="/conversion-calculators/fahrenheit-to-celsius" className="text-primary hover:underline">Fahrenheit to Celsius converter</Link>. All tools are free and work on any device.</p>

        <p>Explore all our <Link href="/conversion-calculators" className="text-primary hover:underline">unit conversion calculators</Link> for instant, accurate results.</p>
      </div>
    </div>
  )
}
