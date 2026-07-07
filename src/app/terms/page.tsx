export const dynamic = 'force-static'
export const revalidate = 86400

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>Last updated: January 2025</p>
        <h2 className="text-xl font-semibold mt-8">Use of Service</h2>
        <p>JDCALC provides free online calculators for informational purposes. While we strive for accuracy, results should not replace professional advice for financial, medical, or legal decisions.</p>
        <h2 className="text-xl font-semibold mt-8">Accuracy</h2>
        <p>We make every effort to ensure calculation accuracy. However, we cannot guarantee 100% error-free results. Users should verify critical calculations independently.</p>
        <h2 className="text-xl font-semibold mt-8">Limitation of Liability</h2>
        <p>JDCALC and its operators are not liable for any damages arising from the use of our calculators or reliance on their results.</p>
      </div>
    </div>
  )
}
