import React from 'react'
import { generateGuide, buildFaqSchema } from '@/lib/seo/guide-content'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'
import { SchemaMarkup, faqSchema, howToSchema } from '@/components/SchemaMarkup'
import { getTranslations } from 'next-intl/server'
import { MethodologyNote } from './MethodologyNote'
import { Link } from '@/lib/navigation'
import { ReviewedBadge } from '@/components/trust/ReviewedBadge'
import { AuthorBioCard } from '@/components/trust/AuthorBioCard'
import { CitationSources } from '@/components/trust/CitationSources'
import { getDefaultSources, getReviewedDate, CONTENT_REVIEW_DATE } from '@/lib/trust'

interface GuideContentProps {
  calculator: CalculatorEntry
  locale?: string
}

function renderInline(line: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  while ((m = linkRe.exec(line)) !== null) {
    if (m.index > last) nodes.push(renderBold(line.slice(last, m.index), `${keyPrefix}-${key++}`))
    nodes.push(
      <Link key={`${keyPrefix}-${key++}`} href={m[2]} className="text-blue-600 font-medium no-underline hover:underline">
        {m[1]}
      </Link>
    )
    last = m.index + m[0].length
  }
  if (last < line.length) nodes.push(renderBold(line.slice(last), `${keyPrefix}-${key++}`))
  return nodes
}

function renderBold(line: string, key: string): React.ReactNode {
  const parts = line.split(/\*\*(.+?)\*\*/g)
  if (parts.length === 1) return <React.Fragment key={key}>{line}</React.Fragment>
  const nodes: React.ReactNode[] = []
  parts.forEach((part, i) => {
    if (part.length === 0) return
    nodes.push(i % 2 === 1 ? <strong key={`${key}-${i}`}>{part}</strong> : <React.Fragment key={`${key}-${i}`}>{part}</React.Fragment>)
  })
  return nodes
}

function GuideList({ content, keyPrefix }: { content: string, keyPrefix: string }) {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean)
  const bullets = lines.filter(l => l.startsWith('- '))
  const paras = lines.filter(l => !l.startsWith('- '))
  return (
    <div className="space-y-3">
      {bullets.length > 0 && (
        <ul className="list-disc pl-5 space-y-1.5">
          {bullets.map((l, i) => (
            <li key={`${keyPrefix}-b-${i}`}>{renderInline(l.replace(/^-\s+/, ''), `${keyPrefix}-b-${i}`)}</li>
          ))}
        </ul>
      )}
      {paras.map((p, i) => (
        <p key={`${keyPrefix}-p-${i}`}>{renderInline(p, `${keyPrefix}-p-${i}`)}</p>
      ))}
    </div>
  )
}

function ReadingTimeBadge({ minutes, t }: { minutes: number; t: (key: string, params?: Record<string, string | number>) => string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {t('guide.labels.readingTime', { minutes })}
    </span>
  )
}

export async function GuideContent({ calculator, locale }: GuideContentProps) {
  const t = await getTranslations()
  const guide = await generateGuide(calculator, t, locale)

  const howToSteps = guide.sections
    .filter(s => ['how-to-use', 'formula', 'example'].includes(s.id))
    .map(s => ({ label: s.title, value: s.content.replace(/[#*`\[\]]/g, '').slice(0, 500) }))

  const tocShort: Record<string, string> = {
    'what-is': t('guide.toc_overview'),
    'how-to-use': t('guide.toc_howToUse'),
    'formula': t('guide.toc_formula'),
    'example': t('guide.toc_example'),
    'use-cases': t('guide.toc_useCases'),
    'tips': t('guide.toc_tips'),
    'related': t('guide.toc_related'),
    'faq': t('guide.toc_faq'),
  }

  return (
    <section aria-label={t('guide.labels.fullGuide')} className="mt-12 border-t border-gray-200 pt-10">
      <SchemaMarkup type="HowTo" data={howToSchema(howToSteps)} />
      <div className="max-w-4xl mx-auto mb-8">
        <ReviewedBadge hub={calculator.hubSlug} date={getReviewedDate(calculator.hubSlug, calculator.slug)} />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('guide.completeGuide', { name: calculator.title })}
          </h2>
          <ReadingTimeBadge minutes={guide.readingTimeMinutes} t={t} />
        </div>

        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-8">
          <nav className="hidden lg:block sticky top-24 self-start" aria-label={t('guide.onThisPage')}>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              {t('guide.onThisPage')}
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
                    <div className="prose prose-sm max-w-none text-gray-600 [&_a]:no-underline [&_a]:font-medium hover:[&_a]:underline">
                      <GuideList content={section.content} keyPrefix={`${calculator.slug}-related`} />
                    </div>
                  </article>
                )
              }

              if (section.id === 'formula' && guide.expert) {
                return (
                  <article key={section.id} id={`guide-${section.id}`} className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                    <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                      {section.content}
                    </div>
                    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">{t('guide.labels.formula')}</p>
                      <code className="block text-base font-semibold text-gray-900 dark:text-gray-100">{guide.expert.formula}</code>
                    </div>
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{t('guide.labels.variables')}</p>
                      <table className="w-full overflow-hidden rounded-lg border border-gray-200 text-sm dark:border-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">{t('guide.labels.variable')}</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">{t('guide.labels.meaning')}</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">{t('guide.labels.unit')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {guide.expert.variables.map((v) => (
                            <tr key={v.symbol} className="border-t border-gray-200 dark:border-gray-800">
                              <td className="px-3 py-2">
                                <code className="font-semibold text-blue-700 dark:text-blue-300">{v.symbol}</code>
                              </td>
                              <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{v.meaning}</td>
                              <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{v.unit ?? '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>
                )
              }

              if (section.id === 'example' && guide.expert) {
                return (
                  <article key={section.id} id={`guide-${section.id}`} className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                    <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                      {section.content}
                    </div>
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{t('guide.labels.workedExample')}</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {guide.expert.workedExample.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                      <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                        {t('guide.labels.result')}: {guide.expert.workedExample.result}
                      </p>
                    </div>
                  </article>
                )
              }

              return (
                <article key={section.id} id={`guide-${section.id}`} className="scroll-mt-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                  {section.id === 'tips' || section.id === 'use-cases' ? (
                    <div className="prose prose-sm max-w-none text-gray-600 [&_li]:mt-1">
                      <GuideList content={section.content} keyPrefix={`${calculator.slug}-${section.id}`} />
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                      {section.content}
                    </div>
                  )}
                </article>
              )
            })}

            <div className="border-t border-gray-100 pt-6">
              <MethodologyNote lastReviewed={CONTENT_REVIEW_DATE} />
            </div>

            <div className="border-t border-gray-100 pt-6 text-center">
              <p className="text-xs text-gray-400">
                {t('guide.labels.wasThisHelpful')}{' '}
                <button className="text-blue-600 hover:text-blue-800 font-medium" type="button">{t('guide.labels.yes')}</button>
                {' / '}
                <button className="text-blue-600 hover:text-blue-800 font-medium" type="button">{t('guide.labels.no')}</button>
              </p>
            </div>

            <CitationSources sources={getDefaultSources(calculator.hubSlug)} />

            <div className="mt-8">
              <AuthorBioCard hub={calculator.hubSlug} slug={calculator.slug} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
