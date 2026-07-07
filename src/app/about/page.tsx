export const dynamic = 'force-static'
export const revalidate = 86400

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">About JDCALC</h1>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>JDCALC is a comprehensive collection of free online calculators covering finance, health, math, science, conversion, and everyday life. Our mission is to provide fast, accurate, and beautifully designed calculation tools for everyone.</p>
        <p>With 16 categories and thousands of calculators, we help students, professionals, and everyday users solve problems quickly and accurately.</p>
        <h2 className="text-xl font-semibold mt-8">Our Mission</h2>
        <p>To make complex calculations simple and accessible to everyone, regardless of their background or expertise.</p>
        <h2 className="text-xl font-semibold mt-8">Why JDCALC?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Free & Accessible</strong> — All calculators are completely free to use</li>
          <li><strong>Fast & Accurate</strong> — Powered by precise formulas and instant computation</li>
          <li><strong>Beautiful Design</strong> — Modern, clean interface that works on all devices</li>
          <li><strong>Comprehensive</strong> — Thousands of calculators across 16 categories</li>
          <li><strong>Multi-language</strong> — Available in 10 languages</li>
        </ul>
      </div>
    </div>
  )
}
