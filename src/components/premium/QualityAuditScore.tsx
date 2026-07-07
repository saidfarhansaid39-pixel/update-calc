'use client'

import React from 'react'
import { CheckCircle, XCircle, AlertTriangle, BarChart3 } from 'lucide-react'

interface AuditCategory {
  name: string
  score: number
  items: { label: string; pass: boolean }[]
}

interface QualityAuditScoreProps {
  categories: AuditCategory[]
}

export interface TierFeatures {
  charts?: boolean
  comparison?: boolean
  educational?: boolean
  export?: boolean
  print?: boolean
  modes?: boolean
  i18n?: boolean
  audit?: boolean
  examples?: boolean
  eduCharts?: boolean
}

function ScoreRing({ score, size = 60 }: { score: number; size?: number }) {
  const stroke = 4
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 95 ? '#06b6d4' : score >= 80 ? '#f77f00' : '#d62828'
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
        className={`text-[${size / 3.5}px] font-bold fill-current`}
        fill={color}>{score}%</text>
    </svg>
  )
}

export function QualityAuditScore({ categories }: QualityAuditScoreProps) {
  const overall = Math.round(categories.reduce((s, c) => s + c.score, 0) / categories.length)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-5 h-5 text-[#06b6d4]" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Quality Audit</h2>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <ScoreRing score={overall} size={80} />
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{overall}% Overall</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {overall >= 95 ? 'Excellent — exceeds industry standards' :
             overall >= 80 ? 'Good — minor improvements needed' :
             'Needs improvement'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map(cat => (
          <div key={cat.name} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{cat.name}</p>
              <ScoreRing score={cat.score} size={40} />
            </div>
            <div className="space-y-1.5">
              {cat.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {item.pass
                    ? <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  }
                  <span className={item.pass ? 'text-gray-600 dark:text-gray-400' : 'text-red-500 dark:text-red-400'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function tierToFeatures(tier: string): TierFeatures {
  const isTier3 = tier === 'tier3'
  const isTier2 = tier === 'tier2' || isTier3
  return {
    charts: isTier2,
    comparison: isTier2,
    educational: isTier3,
    export: true,
    print: true,
    modes: isTier3,
    i18n: isTier3,
    examples: isTier3,
    eduCharts: isTier3,
  }
}

function buildCategory(name: string, defs: { label: string; feature: string }[], features: TierFeatures): AuditCategory {
  const items = defs.map(({ label, feature }) => ({
    label,
    pass: feature === 'always' || features[feature as keyof TierFeatures] === true,
  }))
  const passing = items.filter(i => i.pass).length
  const score = Math.round((passing / items.length) * 100)
  return { name, score, items }
}

export function generateAuditScores(
  calculator: { tier: string; slug: string; category: string },
  tierFeatures?: TierFeatures
): AuditCategory[] {
  const features = tierFeatures ?? tierToFeatures(calculator.tier)

  return [
    buildCategory('Feature Completeness', [
      { label: '4 Calculator Modes (Basic/Advanced/Pro/Expert)', feature: 'modes' },
      { label: 'Rich Result System (primary, secondary, steps)', feature: 'always' },
      { label: 'Interactive Charts', feature: 'charts' },
      { label: 'Educational Charts', feature: 'eduCharts' },
      { label: 'Example Calculations with Visuals', feature: 'examples' },
      { label: 'Scenario Comparison', feature: 'comparison' },
      { label: 'Formula + Step-by-Step', feature: 'always' },
      { label: 'Unit System Toggle (Metric/Imperial/US)', feature: 'always' },
      { label: 'Internationalization (Currency/Locale/Region)', feature: 'i18n' },
      { label: 'Save/Export/Print/Share', feature: 'export' },
    ], features),
    buildCategory('SEO Completeness', [
      { label: 'Schema Markup (FAQ, HowTo, Breadcrumb, Product)', feature: 'always' },
      { label: 'Optimized Title & Meta Description', feature: 'always' },
      { label: 'Semantic H1/H2/H3 Heading Structure', feature: 'always' },
      { label: 'FAQ Schema with Answers', feature: 'always' },
      { label: 'HowTo Schema with Steps', feature: 'always' },
      { label: 'BreadcrumbList Schema', feature: 'always' },
      { label: 'WebApplication Schema', feature: 'always' },
      { label: 'ItemList Schema for Glossary & Use Cases', feature: 'always' },
      { label: '20+ Internal Links', feature: 'always' },
      { label: 'Related Calculators Navigation', feature: 'always' },
    ], features),
    buildCategory('UX Completeness', [
      { label: 'Responsive Mobile-First Design', feature: 'always' },
      { label: 'Form Validation with Zod', feature: 'always' },
      { label: 'Result Tabs (Summary/Chart/Breakdown/Export)', feature: 'charts' },
      { label: 'Quick Presets', feature: 'always' },
      { label: 'Calculation History', feature: 'always' },
      { label: 'Scenario Comparison (side-by-side)', feature: 'comparison' },
      { label: 'Copy/Share Results', feature: 'always' },
      { label: 'CSV Export & Print', feature: 'export' },
      { label: 'Dark Mode Support', feature: 'always' },
      { label: 'Live Updates on Input Change', feature: 'always' },
      { label: 'Slider/Input Toggle', feature: 'always' },
      { label: 'Feedback Widget', feature: 'always' },
      { label: 'Data-Dependent Notice', feature: 'always' },
      { label: 'Author/Reviewer Credentials', feature: 'always' },
      { label: 'Table of Contents Navigation', feature: 'always' },
      { label: 'Loading & Error States', feature: 'always' },
    ], features),
    buildCategory('Educational Completeness', [
      { label: '"What Is" Explanation', feature: 'always' },
      { label: '"How It Works" Description', feature: 'always' },
      { label: 'Formula & Calculation Steps', feature: 'always' },
      { label: 'Real-World Use Cases', feature: 'always' },
      { label: 'Common Mistakes & Solutions', feature: 'always' },
      { label: 'Glossary of Terms', feature: 'always' },
      { label: 'Industry Benchmarks & Ranges', feature: 'educational' },
      { label: 'Result Interpretation', feature: 'always' },
      { label: 'Tips & Best Practices', feature: 'always' },
      { label: 'FAQ with Answers', feature: 'always' },
      { label: 'Example Calculations (Beginner/Typical/Advanced)', feature: 'examples' },
      { label: 'Educational Concept Diagrams', feature: 'eduCharts' },
      { label: 'Formula Visualization Chart', feature: 'eduCharts' },
      { label: 'Process Flow Diagram', feature: 'educational' },
      { label: 'Expert Recommendations', feature: 'always' },
      { label: 'Who Should Use This', feature: 'always' },
      { label: 'Pros & Cons Analysis', feature: 'always' },
      { label: 'Alternatives to Consider', feature: 'always' },
    ], features),
  ]
}
