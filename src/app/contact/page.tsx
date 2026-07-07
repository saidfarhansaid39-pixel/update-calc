export const dynamic = 'force-static'
export const revalidate = 86400

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>Have a question, suggestion, or feedback? We&apos;d love to hear from you.</p>
        <p>Email us at: <a href="mailto:support@jdcalc.com" className="text-primary hover:underline">support@jdcalc.com</a></p>
        <p>We typically respond within 24-48 hours on business days.</p>
        <h2 className="text-xl font-semibold mt-8">Report an Issue</h2>
        <p>If you find a bug or calculation error, please include the calculator name and a description of the issue so we can fix it quickly.</p>
      </div>
    </div>
  )
}
