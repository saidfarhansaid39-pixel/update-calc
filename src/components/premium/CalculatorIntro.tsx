import React from 'react'
import { Lightbulb, HelpCircle, ArrowRight } from 'lucide-react'

interface CalculatorIntroProps {
  title: string
  description: string
  category: string
  questions?: string[]
}

function generateQuestions(title: string, category: string): string[] {
  const cats: Record<string, string[]> = {
    biology: [
      `What is the science behind ${title.toLowerCase()}?`,
      `How do I calculate the correct values?`,
      `What happens if I use the wrong parameters?`,
    ],
  }
  return cats[category] || [
    `How does the ${title.toLowerCase()} work?`,
    `What inputs do I need to use it?`,
    `How accurate are the results?`,
  ]
}

export function CalculatorIntro({ title, description, category, questions }: CalculatorIntroProps) {
  const hooks = questions || generateQuestions(title, category)

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 mb-6 border border-blue-100 dark:border-blue-900">
      <div className="flex items-start gap-3 mb-4">
        <Lightbulb className="w-6 h-6 text-amber-500 mt-0.5 shrink-0" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
      </div>
      <div className="space-y-2 mt-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-500" />
          In this guide:
        </p>
        <ul className="space-y-1.5">
          {hooks.map((q, i) => (
            <li key={i}>
              <a
                href={`#faq-${i}`}
                className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                <span>{q}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
