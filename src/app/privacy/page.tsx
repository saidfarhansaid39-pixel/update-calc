export const dynamic = 'force-static'
export const revalidate = 86400

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>Last updated: January 2025</p>
        <h2 className="text-xl font-semibold mt-8">Information We Collect</h2>
        <p>JDCALC does not collect any personal information. We use minimal cookies for essential functionality such as theme preference (dark/light mode) and language selection.</p>
        <h2 className="text-xl font-semibold mt-8">Analytics</h2>
        <p>We may use anonymous usage analytics to improve our services. No personally identifiable information is tracked.</p>
        <h2 className="text-xl font-semibold mt-8">Third-Party Services</h2>
        <p>We do not share any data with third parties. All calculations are performed entirely in your browser or on our servers without storing your input values.</p>
        <h2 className="text-xl font-semibold mt-8">Contact</h2>
        <p>For privacy-related inquiries, contact us at support@jdcalc.com.</p>
      </div>
    </div>
  )
}
