import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const dynamic = 'force-static'

export async function generateMetadata() {
  return {
    title: 'Accessibility Statement — Calculat',
    description: 'Calculat is committed to ensuring digital accessibility for all users, including those with disabilities. Learn about our accessibility features and standards.',
    alternates: { canonical: siteUrl + '/accessibility' },
    openGraph: { title: 'Accessibility Statement — Calculat', description: 'Calculat is committed to ensuring digital accessibility for all users.', url: siteUrl + '/accessibility', siteName: 'Calculat', type: 'website', images: [{ url: siteUrl + '/og-image.png', width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title: 'Accessibility Statement — Calculat', description: 'Calculat is committed to ensuring digital accessibility for all users.' },
  }
}

export default async function AccessibilityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">Accessibility Statement</li>
        </ol>
      </nav>
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbListSchema([
        { name: 'Home', url: siteUrl },
        { name: 'Accessibility Statement', url: siteUrl + '/accessibility' },
      ])} />
      <SchemaMarkup type="WebApplication" data={{
        '@type': 'WebPage',
        name: 'Accessibility Statement',
        description: 'Calculat commitment to digital accessibility.',
        url: siteUrl + '/accessibility',
        isPartOf: { '@type': 'WebSite', name: 'Calculat', url: siteUrl },
      }} />
      <h1 className="text-3xl font-bold mb-6">Accessibility Statement</h1>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>Last updated: July 12, 2026</p>
        <p>Calculat is committed to ensuring digital accessibility for all users, including those with disabilities. We continuously work to improve the user experience for everyone and apply the relevant accessibility standards.</p>

        <h2 className="text-xl font-semibold mt-8">Standards</h2>
        <p>We strive to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines define requirements for making web content more accessible to people with a wide range of disabilities, including blindness and low vision, deafness and hearing loss, limited movement, speech disabilities, photosensitivity, and cognitive limitations.</p>

        <h2 className="text-xl font-semibold mt-8">Accessibility Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Skip to Content</strong> — A skip navigation link is provided at the top of every page, allowing keyboard and screen reader users to bypass repeated navigation and go directly to the main content.</li>
          <li><strong>ARIA Labels</strong> — Interactive elements throughout the site use ARIA labels and roles to ensure screen readers can properly identify and describe controls, navigation landmarks, and dynamic content.</li>
          <li><strong>Keyboard Navigation</strong> — All functionality is operable through a keyboard interface. Focus indicators are clearly visible, and the tab order follows a logical sequence.</li>
          <li><strong>Screen Reader Support</strong> — Our pages are structured with semantic HTML landmarks, proper heading hierarchies, and descriptive text alternatives for non-decorative images.</li>
          <li><strong>Dark Mode</strong> — A high-contrast dark mode is available, reducing eye strain for users with light sensitivity or visual impairments.</li>
          <li><strong>Responsive Design</strong> — Content is fully responsive and accessible across desktop, tablet, and mobile viewports without loss of functionality.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">Known Limitations</h2>
        <p>While we are actively working to achieve full WCAG 2.1 AA compliance, some areas may have limitations:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Some older calculator tools may have complex data tables that require additional markup for optimal screen reader interpretation.</li>
          <li>Third-party embedded content (such as interactive charts) may not be fully accessible in all cases.</li>
          <li>Some dynamically generated content may not announce changes to screen readers without user interaction.</li>
        </ul>
        <p>We are addressing these issues as part of our ongoing accessibility improvement roadmap.</p>

        <h2 className="text-xl font-semibold mt-8">Contact Us</h2>
        <p>If you encounter any accessibility barriers on Calculat, please contact us. We will make every reasonable effort to resolve the issue and provide the information you need in an accessible format.</p>
        <p>Email: <a href="mailto:accessibility@calculat.online" className="text-primary hover:underline">accessibility@calculat.online</a></p>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link href="/" className="text-primary hover:underline">Back to Home</Link>
      </div>
    </div>
  )
}
