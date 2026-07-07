import React from 'react'
import { generateGuide, buildFaqSchema } from '@/lib/seo/guide-content'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'
import { SchemaMarkup, faqSchema, howToSchema } from '@/components/SchemaMarkup'
import { getTranslations } from 'next-intl/server'

interface GuideContentProps {
  calculator: CalculatorEntry
  locale?: string
}

function ReadingTimeBadge({ minutes, t }: { minutes: number; t: (key: string, params?: Record<string, string | number>) => string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {t('labels.readingTime', { minutes })}
    </span>
  )
}

export async function GuideContent({ calculator, locale }: GuideContentProps) {
  const t = await getTranslations('guide')
  const guide = await generateGuide(calculator, t, locale)

  const howToSteps = guide.sections
    .filter(s => ['how-to-use', 'formula', 'example'].includes(s.id))
    .map(s => ({ label: s.title, value: s.content.replace(/[#*`\[\]]/g, '').slice(0, 500) }))

  const tocShort: Record<string, string> = {
    'what-is': t('toc_overview'),
    'how-to-use': t('toc_howToUse'),
    'formula': t('toc_formula'),
    'example': t('toc_example'),
    'use-cases': t('toc_useCases'),
    'tips': t('toc_tips'),
    'related': t('toc_related'),
    'faq': t('toc_faq'),
  }

  return (
    <section aria-label="Full calculator guide" className="mt-12 border-t border-gray-200 pt-10">
      <SchemaMarkup type="HowTo" data={howToSchema(howToSteps)} />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('completeGuide', { name: calculator.title })}
          </h2>
          <ReadingTimeBadge minutes={guide.readingTimeMinutes} t={t} />
        </div>

        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-8">
          <nav className="hidden lg:block sticky top-24 self-start" aria-label={t('onThisPage')}>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              {t('onThisPage')}
            </h3>
            <ul className="space-y-2 text-sm">
              {guide.sections.map((section, idx) => (
                <li key={section.id}>
                  <a
                    href={`#guide-${section.id}`}
                    className="text-gray-600 hover:text-blue-600 transition-colors block py-1"
                    aria-current={idx === 0 ? 'location' : undefined}
                  >
                    {tocShort[section.id] || section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 space-y-10">
            {guide.sections.map((section) => {
              if (section.id === 'faq') {
                const faqItems = buildFaqSchema(calculator)
                return (
                  <article key={section.id} id={`guide-${section.id}`} className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                    <SchemaMarkup
                      type="FAQPage"
                      data={{
                        mainEntity: faqItems.map(f => ({
                          '@type': 'Question',
                          name: f.question,
                          acceptedAnswer: { '@type': 'Answer', text: f.answer },
                        })),
                      }}
                    />
                    <dl className="space-y-4">
                      {faqItems.map((faq, i) => (
                        <details key={i} className="group border border-gray-200 rounded-lg [&[open]]:border-blue-200">
                          <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                            {faq.question}
                            <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </summary>
                          <div className="px-4 pb-3 text-sm text-gray-600 border-t border-gray-100 pt-2 mt-0">
                            {faq.answer}
                          </div>
                        </details>
                      ))}
                    </dl>
                  </article>
                )
              }

              if (section.id === 'related') {
                return (
                  <article key={section.id} id={`guide-${section.id}`} className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                    <div className="prose prose-sm max-w-none text-gray-600 [&_a]:text-blue-600 [&_a]:no-underline [&_a]:font-medium hover:[&_a]:underline">
                      {section.content.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < section.content.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  </article>
                )
              }

              return (
                <article key={section.id} id={`guide-${section.id}`} className="scroll-mt-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                  {section.id === 'tips' || section.id === 'use-cases' ? (
                    <div className="prose prose-sm max-w-none text-gray-600 [&_li]:mt-1">
                      {section.content.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < section.content.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                      {section.content}
                    </div>
                  )}
                </article>
              )
            })}

            <div className="border-t border-gray-100 pt-6 text-center">
              <p className="text-xs text-gray-400">
                {t('labels.wasThisHelpful')}{' '}
                <button className="text-blue-600 hover:text-blue-800 font-medium" type="button">{t('labels.yes')}</button>
                {' / '}
                <button className="text-blue-600 hover:text-blue-800 font-medium" type="button">{t('labels.no')}</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
