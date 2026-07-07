import React from 'react'
import { CalculatorContent, LongFormSection } from '@/lib/seo/calculator-content-engine'
import { Lightbulb, AlertTriangle, BookOpen, Network, BookText, ChevronRight } from 'lucide-react'

interface InformationalSectionProps {
  title: string
  description: string
  content: CalculatorContent
}

export function InformationalSection({ title, description, content }: InformationalSectionProps) {

  return (
    <div className="space-y-6">
      {/* What Is - already in main shell but re-stated for completeness */}

      {/* Real-World Use Cases */}
      {content.useCases.length > 0 && (
        <div id="use-cases" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Real-World Use Cases</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.useCases.map((uc, i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">{uc.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{uc.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Mistakes */}
      {content.commonMistakes.length > 0 && (
        <div id="common-mistakes" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Common Mistakes to Avoid</h2>
          </div>
          <div className="space-y-3">
            {content.commonMistakes.map((m, i) => (
              <div key={i} className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">✗ {m.mistake}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">✓ {m.solution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Glossary */}
      {content.glossary.length > 0 && (
        <div id="glossary" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Glossary of Terms</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {content.glossary.map((g, i) => (
              <div key={i} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{g.term}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{g.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Long-Form Educational Article */}
      {content.longFormArticle && content.longFormArticle.length > 0 && (
        <div id="educational-guide" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BookText className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Complete Guide</h2>
          </div>
          <div className="space-y-8">
            {content.longFormArticle.map((section, i) => (
              <LongFormSectionCard key={i} section={section} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Related Concepts */}
      {content.relatedConcepts.length > 0 && (
        <div id="related-concepts" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Network className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Related Concepts</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {content.relatedConcepts.map((concept, i) => (
              <span key={i} className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300 rounded-lg text-sm border border-purple-100 dark:border-purple-900/30">
                {concept}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function LongFormSectionCard({ section, index }: { section: LongFormSection; index: number }) {
  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-5 py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
            {index + 1}
          </span>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{section.title}</h3>
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          {section.content}
        </p>
        {section.subsections && section.subsections.length > 0 && (
          <div className="space-y-4 mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
            {section.subsections.map((sub, j) => (
              <div key={j}>
                <h4 className="flex items-center gap-1.5 text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  {sub.heading}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 pl-5 leading-relaxed">{sub.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
