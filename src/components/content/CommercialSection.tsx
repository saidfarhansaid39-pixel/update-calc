import React from 'react'
import { CalculatorContent } from '@/lib/seo/calculator-content-engine'
import { BarChart3, ThumbsUp, ThumbsDown, Shuffle, Award } from 'lucide-react'

interface CommercialSectionProps {
  title: string
  content: CalculatorContent
}

export function CommercialSection({ title, content }: CommercialSectionProps) {

  if (!content.comparisons.length && !content.alternatives.length) return null

  return (
    <div className="space-y-6">
      {/* Comparisons: Manual vs Calculator */}
      {content.comparisons.map((comparison, ci) => (
        <div key={ci} id={`comparison-${ci}`} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-[#06b6d4]" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{comparison.title}</h2>
          </div>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-2 text-left font-medium text-gray-500 dark:text-gray-400 w-1/4">Factor</th>
                  <th className="px-6 py-2 text-left font-medium text-gray-500 dark:text-gray-400 w-[35%]">Manual Approach</th>
                  <th className="px-6 py-2 text-left font-medium text-[#06b6d4] w-[35%]">Our Calculator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {comparison.items.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{item.label}</td>
                    <td className="px-6 py-3 text-gray-500 dark:text-gray-400">{item.manual}</td>
                    <td className="px-6 py-3 text-gray-900 dark:text-white">{item.calculator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 bg-[#1a3a8a]/5 rounded-lg p-3 border border-[#06b6d4]/10">
            {comparison.summary}
          </p>
        </div>
      ))}

      {/* Pros & Cons */}
      <div id="pros-cons" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pros & Cons</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ThumbsUp className="w-4 h-4 text-green-500" />
              <h3 className="font-medium text-green-700 dark:text-green-400 text-sm">Pros</h3>
            </div>
            <ul className="space-y-2">
              {content.prosCons.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">+</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ThumbsDown className="w-4 h-4 text-red-500" />
              <h3 className="font-medium text-red-700 dark:text-red-400 text-sm">Cons</h3>
            </div>
            <ul className="space-y-2">
              {content.prosCons.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">−</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Alternatives */}
      {content.alternatives.length > 0 && (
        <div id="alternatives" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shuffle className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Alternatives to Consider</h2>
          </div>
          <div className="grid gap-3">
            {content.alternatives.map((alt, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{alt.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{alt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expert Recommendations */}
      <div id="recommendations" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Expert Recommendations</h2>
        </div>
        <div className="space-y-3">
          {content.expertRecommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
              <span className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
              <p className="text-sm text-gray-700 dark:text-gray-300">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
