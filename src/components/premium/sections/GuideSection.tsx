'use client'

import React from 'react'
import Image from 'next/image'
import { ChevronUp, ChevronDown, ExternalLink, Linkedin } from 'lucide-react'
import { SchemaMarkup, howToSchema, breadcrumbListSchema } from '@/components/SchemaMarkup'
import type { Author, Reference, PremiumCalculatorShellProps } from '@/components/premium/PremiumCalculatorShell'
import type { TierFeatures } from './types'

type TFunc = (key: string) => string

function AuthorCard({ author, label }: { author: Author; label: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
      {author.photoUrl ? (
        <Image src={author.photoUrl} alt={author.name} width={40} height={40} loading="lazy" decoding="async" className="w-10 h-10 rounded-full object-cover shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-[#1a3a8a]/10 flex items-center justify-center text-[#06b6d4] font-bold text-sm shrink-0">
          {author.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{author.name}</p>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          {author.credential && <span>{author.credential}</span>}
          {author.title && <span>· {author.title}</span>}
          {author.linkedIn && (
            <a href={author.linkedIn} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-[#06b6d4] hover:underline">
              <Linkedin className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

const howItWorks: Record<string, string> = {
  financial: 'Enter your financial details into the form above. Our tool applies industry-standard formulas to calculate payments, interest, returns, and projections. Results update instantly as you adjust inputs.',
  health: 'Input your personal metrics such as age, weight, height, and activity level. Our health calculator uses validated medical formulas and research-backed algorithms to provide personalized health assessments.',
  math: 'Enter your numbers and select the operation you need. Our math solver applies correct mathematical principles and order of operations, providing step-by-step solutions.',
  conversion: 'Select the conversion type and units, then enter your value. Our converter uses internationally standardized conversion factors to deliver accurate results in real time.',
  statistics: 'Input your data set values and select the statistical measures you need. Our statistics calculator computes descriptive statistics using validated statistical methods.',
  education: 'Enter your grades, credit hours, and course levels. Our education calculator computes weighted and unweighted GPA, projects future grades needed, and helps you plan academic goals.',
  physics: 'Select the physics concept and input your known values. Our physics calculator applies fundamental physical laws and equations to solve for unknown variables.',
  chemistry: 'Input your chemical values and select the calculation type. Our chemistry calculator performs accurate computations using standardized atomic weights and gas constants.',
  'date-time': 'Enter your dates and times. Our date-time calculator computes precise differences accounting for leap years, month lengths, and time zones.',
  construction: 'Enter your project measurements and material preferences. Our construction calculator provides accurate estimates for materials, costs, and quantities.',
  engineering: 'Input your engineering parameters. Our engineering calculator applies professional standards and formulas to compute technical values.',
  everyday: 'Enter the relevant values for your everyday calculation. Our tool provides quick, practical results you can apply immediately to real-life situations.',
}

const whatIsExtra: Record<string, string> = {
  financial: ' This tool helps you make informed financial decisions by providing clear projections of complex financial scenarios.',
  health: ' Understanding your health metrics is the first step toward better wellness. Use these insights alongside professional medical guidance.',
  math: ' Mathematical calculations are fundamental to science, engineering, finance, and everyday life.',
  conversion: ' Accurate unit conversion is essential in science, engineering, travel, cooking, and international trade.',
  statistics: ' Statistical analysis helps you understand data patterns, make predictions, and draw meaningful conclusions.',
  education: ' Tracking academic performance helps students set goals and plan their educational journey.',
  physics: ' Physics principles govern everything from the motion of planets to the behavior of subatomic particles.',
  chemistry: ' Chemistry calculations are essential for laboratory work, industrial processes, and understanding the material world.',
  'date-time': ' Precise date and time calculations are critical for project planning, scheduling, and event coordination.',
  construction: ' Accurate construction estimates save money, reduce waste, and ensure projects are completed on time.',
  engineering: ' Engineering calculations ensure structures and systems are designed safely and efficiently.',
  everyday: ' Quick everyday calculations save time and help you make better decisions in daily life.',
}

interface GuideSectionProps {
  locale: string
  t: TFunc
  th: TFunc
  calculator: PremiumCalculatorShellProps['calculator']
  showContent: boolean
  onToggleContent: () => void
  faqs: { q: string; a: string }[]
  tierFeatures: TierFeatures
  steps?: { label: string; value: string }[]
  useCases?: { title: string; description: string }[]
  glossary?: { term: string; definition: string }[]
  author?: Author
  reviewer?: Author
  references?: Reference[]
}

export function GuideSection({ locale, t, th, calculator, showContent, onToggleContent, faqs, tierFeatures, steps, useCases, glossary, author, reviewer, references }: GuideSectionProps) {
  const schemaFaqs = faqs.map(f => ({ question: f.q, answer: f.a }))
  const applicationCategoryMap: Record<string, string> = {
    financial: 'FinanceApplication', health: 'HealthApplication', math: 'ScienceApplication', conversion: 'UtilitiesApplication', construction: 'BusinessApplication', statistics: 'DataAnalysisApplication', education: 'EducationalApplication', physics: 'ScienceApplication', chemistry: 'ScienceApplication', engineering: 'EngineeringApplication', everyday: 'LifestyleApplication', food: 'LifestyleApplication', biology: 'ScienceApplication', ecology: 'ScienceApplication', sports: 'SportsApplication', 'date-time': 'UtilitiesApplication',
  }
  const applicationCategory = applicationCategoryMap[calculator.hubSlug] || 'UtilitiesApplication'

  return (
    <div id="guide" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <button
        onClick={onToggleContent}
        className="w-full flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Educational Guide</h2>
        {showContent ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {showContent && (
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="prose dark:prose-invert max-w-none">
            <h3>What Is {calculator.title}?</h3>
            <p>{calculator.description}{whatIsExtra[calculator.category] || ''}</p>

            <h3>How Does It Work?</h3>
            <p>{howItWorks[calculator.category] || 'Enter your values in the form above. The tool processes your inputs using industry-standard formulas and displays detailed results in real time.'}</p>

            <h3>Tips & Best Practices</h3>
            <ul>
              <li>Use accurate input values for the most reliable results. Small errors in inputs can compound in the output.</li>
              <li>Review the underlying assumptions to ensure they match your specific situation.</li>
              <li>Use the preset examples to quickly test common scenarios and understand the tool.</li>
              {tierFeatures.comparison && <li>Use the <strong>Save Scenario</strong> button to compare multiple scenarios side by side and find the best option.</li>}
              <li>Print or export your results for record-keeping or sharing with a professional.</li>
              <li>Bookmark this tool for quick future access when you need it.</li>
            </ul>

            {faqs.length > 0 && (
              <>
                <h3 id="faq">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <div key={i}>
                      <p className="font-medium">{faq.q}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {calculator.keywords.length > 0 && (
              <>
                <h3>Related Topics</h3>
                <ul>
                  {calculator.keywords.slice(0, 8).map((kw, i) => <li key={i}>{kw}</li>)}
                </ul>
              </>
            )}

            <h3>Questions?</h3>
            <p>If you have questions about this calculator or need help interpreting results, consult a qualified professional in the relevant field. This tool is for educational and informational purposes only.</p>
          </div>

          {/* Author & Reviewer bios */}
          {(author || reviewer) && (
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">About the Authors</h3>
              {author && <AuthorCard author={author} label="Author" />}
              {reviewer && <AuthorCard author={reviewer} label="Reviewer" />}
            </div>
          )}

          {/* References */}
          {references && references.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                References ({references.length})
              </h3>
              <ol className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                {references.map((ref, i) => (
                  <li key={i}>
                    <a href={ref.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-[#06b6d4] transition-colors">
                      <span>[{i + 1}]</span> {ref.label}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      <SchemaMarkup type="Product" data={{
        name: calculator.title,
        description: calculator.description,
        url: `https://www.jdcalc.com/${calculator.hubSlug}/${calculator.slug}`,
        category: calculator.hubName,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
        applicationCategory: applicationCategory,
        operatingSystem: 'Web',
        browserRequirements: 'Requires JavaScript',
      }} />
      {schemaFaqs.length > 0 && <SchemaMarkup type="FAQPage" data={{
        mainEntity: schemaFaqs.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }} />}
      {steps && steps.length > 0 && <SchemaMarkup type="HowTo" data={howToSchema(steps)} />}
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbListSchema([
        { name: t('home'), url: locale === 'en' ? `https://www.jdcalc.com` : `https://www.jdcalc.com/${locale}` },
        { name: th(calculator.hubSlug), url: locale === 'en' ? `https://www.jdcalc.com/${calculator.hubSlug}` : `https://www.jdcalc.com/${locale}/${calculator.hubSlug}` },
        { name: calculator.title, url: locale === 'en' ? `https://www.jdcalc.com/${calculator.hubSlug}/${calculator.slug}` : `https://www.jdcalc.com/${locale}/${calculator.hubSlug}/${calculator.slug}` },
      ])} />
      <SchemaMarkup type="WebApplication" data={{
        name: calculator.title,
        description: calculator.description,
        url: `https://www.jdcalc.com/${calculator.hubSlug}/${calculator.slug}`,
        applicationCategory: applicationCategory,
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      {useCases && useCases.length > 0 && <SchemaMarkup type="ItemList" data={{
        itemListElement: useCases.slice(0, 5).map((uc, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: uc.title,
          description: uc.description,
        })),
      }} />}
      {glossary && glossary.length > 0 && <SchemaMarkup type="ItemList" data={{
        name: `${calculator.title} Glossary`,
        description: 'Key terms related to this calculator',
        itemListElement: glossary.map((g, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: g.term,
          description: g.definition,
        })),
      }} />}
    </div>
  )
}
