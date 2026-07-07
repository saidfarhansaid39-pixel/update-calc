'use client'

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Calculator, RotateCcw, Download, Copy, Share2, Printer, TrendingUp, AlertCircle, Info, CheckCircle2, Settings2, Eye, EyeOff, BarChart3, RefreshCw, Plus, Save, Scissors, Trash2, DownloadCloud, FileSpreadsheet, FileText, Lightbulb, Target, Brain, Zap, ChevronDown, ChevronUp, X, AlertTriangle, Sparkles, Edit3, Flag, BookOpen, Layers, Sliders, Table2, Network, GitBranch, LineChart, PieChart, BarChart, Activity, Check, CopyCheck, ExternalLink, Heart, DollarSign, Droplet, Leaf, Microscope, Dumbbell, Globe, Award, ClipboardList, HardHat, Gauge, Clock, Sun, Moon, Atom, GraduationCap, Ruler, ThumbsUp, Linkedin, History, Crosshair } from 'lucide-react'
import { SchemaMarkup, calculatorSchema, faqSchema, howToSchema, breadcrumbListSchema } from '@/components/SchemaMarkup'
import { generateCalculatorContent, longFormArticlesReady } from '@/lib/seo/calculator-content-engine'
import { InformationalSection } from '@/components/content/InformationalSection'
import { CommercialSection } from '@/components/content/CommercialSection'
import { NavigationalSection } from '@/components/content/NavigationalSection'
import { ResultTabs } from '@/components/premium/ResultTabs'
import { ScenarioComparison } from '@/components/premium/ScenarioComparison'
import { CalculationHistory } from '@/components/premium/CalculationHistory'
import { BatchCalculator } from '@/components/premium/BatchCalculator'
import { useCalculatorHistory } from '@/lib/hooks/useCalculatorHistory'
import { generateExplanation } from '@/lib/seo/result-explanation'
import { generateAIExplanation } from '@/lib/seo/ai-explanation'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'
import { calculatorRegistry } from '@calcuniverse/calculator-registry'
import { CalculatorModeToggle, type CalcMode } from '@/components/premium/CalculatorModeToggle'
import { CalculatorModeProvider } from '@/lib/context/CalculatorModeContext'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { InternationalizationPanel } from '@/components/premium/InternationalizationPanel'
import { ExportPanel } from '@/components/premium/ExportPanel'
import { EnhancedResultExplanation } from '@/components/premium/EnhancedResultExplanation'
import { DynamicFormulaChart as FormulaChart, DynamicConceptDiagram as ConceptDiagram, DynamicProcessFlowChart as ProcessFlowChart } from '@/components/premium/DynamicCharts'
import { DynamicExampleChartGenerator as ExampleChartGenerator } from '@/components/premium/DynamicCharts'
import { InternalLinkingGrid } from '@/components/premium/InternalLinkingGrid'
import { QualityAuditScore, generateAuditScores } from '@/components/premium/QualityAuditScore'
import { ActionToolbar } from '@/components/premium/ActionToolbar'
import { ExtraFieldInjector } from '@/components/premium/ExtraFieldInjector'
import { ShareButtons } from '@/components/premium/ShareButtons'
import { EmbedWidget } from '@/components/premium/EmbedWidget'
import { CitationGenerator } from '@/components/premium/CitationGenerator'
import { ExtraFieldAdjustments } from '@/components/premium/ExtraFieldAdjustments'
import { RangeVisualizer } from '@/components/premium/RangeVisualizer'
import { RelatedCalculatorCarousel } from '@/components/premium/RelatedCalculatorCarousel'
import { VisualPresetCards } from '@/components/premium/VisualPresetCards'
import { ResultQualityBadge } from '@/components/premium/ResultQualityBadge'
import { InputRangeValidator } from '@/components/premium/InputRangeValidator'
import { getQualityInfo, getInputRanges } from '@/lib/quality/calculator-quality'
import { getExtraFieldsForCalculator } from '@/lib/extra-field-pools'
import { ExtraFieldsProvider } from '@/lib/context/ExtraFieldsContext'
import { useAutoSave } from '@/lib/hooks/useAutoSave'
import { useLocale } from 'next-intl'
import { getLocalizedCalculator } from '@/lib/localized-registry'

import { CalculatorIntro } from '@/components/premium/CalculatorIntro'
import { CalculatorErrorBoundary, CalculatorEmptyState, CalculatorLoadingSkeleton } from '@/components/premium/CalculatorStates'
import { generateCalculatorFAQ } from '@/lib/seo/per-calculator-content'
import type { Currency, MeasurementSystem } from '@/lib/i18n/calculator-i18n'

export type UnitSystem = 'metric' | 'imperial' | 'us'

interface Scenario {
  id: string
  label: string
  snapshot: string
  mainValue?: number
}

interface Preset {
  label: string
  values: Record<string, string>
}

export interface Author {
  name: string
  title: string
  credential?: string
  photoUrl?: string
  linkedIn?: string
}

export interface Reference {
  label: string
  url: string
}

export interface ExampleStep {
  label: string
  value: string
}

interface Benchmark {
  label: string
  value: string
  isGood?: boolean
}

interface NextAction {
  label: string
  description: string
  priority?: 'high' | 'medium' | 'low'
}

interface OptimizationSuggestion {
  label: string
  impact: string
  effort: 'low' | 'medium' | 'high'
}

interface DetailedExplanation {
  whatItMeans?: string
  whyItMatters?: string
  whatAffectsIt?: string[]
  howToImprove?: string[]
  detailedSections?: { title: string; content: string }[]
}

interface EnhancedExplanation {
  goodRange?: { min: number; max: number }
  benchmarks?: Benchmark[]
  nextActions?: NextAction[]
  optimizations?: OptimizationSuggestion[]
  warnings?: string[]
  resultInsights?: string[]
  detailedExplanation?: DetailedExplanation
}

interface FormulaVariable {
  name: string
  value: number
  min: number
  max: number
}

interface ConceptNode { id: string; label: string; x: number; y: number; color?: string }
interface ConceptEdge { from: string; to: string; label?: string }
interface ProcessStep { label: string; description: string; icon?: string }

interface ExampleItem {
  label: string
  inputs: Record<string, string>
  output: string
  outputLabel?: string
  chartData?: { name: string; value: number }[]
  steps?: { label: string; value: string }[]
}

interface PremiumCalculatorShellProps {
  calculator: {
    slug: string
    title: string
    description: string
    tier: string
    category: string
    hubSlug: string
    hubName: string
    keywords: string[]
    dataDependent?: boolean
    dataRefreshCadence?: string
  }
  form: React.ReactNode
  result: React.ReactNode
  unitSystem?: UnitSystem
  onUnitChange?: (unit: UnitSystem) => void
  presets?: Preset[]
  onPresetApply?: (preset: Preset) => void
  scenarioLabel?: string
  onSaveScenario?: () => string
  onExportCSV?: () => string
  extraActions?: React.ReactNode
  formula?: string
  steps?: { label: string; value: string }[]
  interpretation?: string
  author?: Author
  reviewer?: Author
  references?: Reference[]
  example?: ExampleStep[]
  userCount?: number
  onReset?: () => void
  lockedFields?: Set<string>
  copyResultText?: string
  inputs?: Record<string, string>
  charts?: React.ReactNode
  breakdown?: React.ReactNode
  schedule?: React.ReactNode
  showTabs?: boolean
  useSlider?: boolean
  onToggleSlider?: () => void
  explanation?: { summary: string; details: string[]; tips: string[] }
  subCalcs?: React.ReactNode
  hubCategory?: string
  mainValue?: number
  mode?: CalcMode
  onModeChange?: (mode: CalcMode) => void
  enhancedExplanation?: EnhancedExplanation
  formulaVariables?: FormulaVariable[]
  conceptNodes?: ConceptNode[]
  conceptEdges?: ConceptEdge[]
  processSteps?: ProcessStep[]
  examples?: { beginner: ExampleItem; typical: ExampleItem; advanced: ExampleItem; realworld?: ExampleItem }
  exampleChartType?: 'bar' | 'line' | 'pie'
  country?: string
  currency?: Currency
  measurementSystem?: MeasurementSystem
  onCountryChange?: (country: string) => void
  onCurrencyChange?: (currency: Currency) => void
  onMeasurementSystemChange?: (system: MeasurementSystem) => void
  onExtraFieldsChange?: (values: Record<string, string>) => void
  rangeVisualizer?: React.ReactNode
  onRestoreValues?: (values: Record<string, string>) => void
}

const hubIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  financial: DollarSign,
  health: Heart,
  math: Calculator,
  construction: HardHat,
  engineering: Gauge,
  'date-time': Clock,
  everyday: Globe,
  conversion: Ruler,
  statistics: Activity,
  education: GraduationCap,
  physics: Atom,
  chemistry: Atom,
  food: Heart,
  biology: Atom,
  ecology: Activity,
  sports: TrendingUp,
}

const unitOptions: { value: UnitSystem; label: string }[] = [
  { value: 'metric', label: 'Metric' },
  { value: 'imperial', label: 'Imperial' },
  { value: 'us', label: 'US' },
]



function BreadcrumbNav({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <svg className="w-3 h-3 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
            {i < items.length - 1 ? (
              <a href={item.href} className="hover:text-primary dark:hover:text-primary transition-colors">
                {item.label}
              </a>
            ) : (
              <span className="text-gray-600 dark:text-gray-300 font-medium" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function AuthorCard({ author, label }: { author: Author; label: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
      {author.photoUrl ? (
        <img src={author.photoUrl} alt={author.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
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

export function PremiumCalculatorShell({
  calculator, form, result, unitSystem, onUnitChange, presets, onPresetApply,
  scenarioLabel, onSaveScenario, onExportCSV, extraActions,
  formula, steps, interpretation, author, reviewer, references, example, userCount, onReset, copyResultText,
  inputs, charts, breakdown, schedule, showTabs, useSlider, onToggleSlider,
  explanation: explanationProp, subCalcs, hubCategory, mainValue,
  mode: modeProp, onModeChange,
  enhancedExplanation: enhancedExplanationProp,
  formulaVariables, conceptNodes, conceptEdges, processSteps,
  examples, exampleChartType,
  country: countryProp, currency: currencyProp, measurementSystem: measurementSystemProp,
  onCountryChange, onCurrencyChange, onMeasurementSystemChange,
  onExtraFieldsChange,
  rangeVisualizer,
  onRestoreValues,
}: PremiumCalculatorShellProps) {
  const locale = useLocale()
  const [showContent, setShowContent] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [copied, setCopied] = useState(false)
  const [resultCopied, setResultCopied] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null)
  const [showToC, setShowToC] = useState(false)
  const [loading, setLoading] = useState(true)
  const [calcError, setCalcError] = useState<string | null>(null)
  const [extraFieldValues, setExtraFieldValues] = useState<Record<string, string>>({})
  const shareUrl = useMemo(() => {
    if (typeof window !== 'undefined') return window.location.href
    return `https://www.jdcalc.com/${calculator.hubSlug}/${calculator.slug}`
  }, [calculator.hubSlug, calculator.slug])

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  React.useEffect(() => {
    try {
      const hasInputs = inputs && Object.keys(inputs).length > 0
      if (hasInputs && result === null) {
        setCalcError('No result available. Please provide valid inputs.')
      } else {
        setCalcError(null)
      }
    } catch (e) {
      setCalcError(e instanceof Error ? e.message : 'Calculation failed')
    }
  }, [result, inputs])
  const [mode, setMode] = useState<CalcMode>(modeProp || 'basic')
  const modeLevel = useMemo(() => {
    const levels: Record<CalcMode, number> = { basic: 0, advanced: 1, professional: 2, expert: 3 }
    return levels[mode] || 0
  }, [mode])
  const [country, setCountry] = useState(countryProp || 'US')
  const [currency, setCurrency] = useState<Currency>(currencyProp || 'USD')
  const [measSystem, setMeasSystem] = useState<MeasurementSystem>(measurementSystemProp || 'metric')
  const [showAudit, setShowAudit] = useState(false)
  const [showBatch, setShowBatch] = useState(false)
  const [showRestore, setShowRestore] = useState(false)
  const [restoreDismissed, setRestoreDismissed] = useState(false)
  const [copiedValue, setCopiedValue] = useState<string | null>(null)
  const { history, addEntry, removeEntry, clearHistory, showHistory, setShowHistory, exportCSV, searchQuery, setSearchQuery, clearConfirm, setClearConfirm, calcStats } = useCalculatorHistory(calculator.slug, calculator.title)
  const autoSave = useAutoSave({ slug: calculator.slug })
  const hasInputs = inputs && Object.keys(inputs).length > 0

  useEffect(() => {
    if (hasInputs) autoSave.save(inputs!)
  }, [inputs, hasInputs, autoSave.save])

  useEffect(() => {
    if (!restoreDismissed && !hasInputs && autoSave.hasSavedData) {
      setShowRestore(true)
    } else {
      setShowRestore(false)
    }
  }, [restoreDismissed, hasInputs, autoSave.hasSavedData])
  const tier = calculator.tier as 'tier1' | 'tier2' | 'tier3'

  const handleModeChange = useCallback((newMode: CalcMode) => {
    setMode(newMode)
    onModeChange?.(newMode)
  }, [onModeChange])

  const handleCountryChange = useCallback((c: string) => {
    setCountry(c)
    onCountryChange?.(c)
  }, [onCountryChange])

  const handleCurrencyChange = useCallback((c: Currency) => {
    setCurrency(c)
    onCurrencyChange?.(c)
  }, [onCurrencyChange])

  const handleMeasurementChange = useCallback((s: MeasurementSystem) => {
    setMeasSystem(s)
    onMeasurementSystemChange?.(s)
  }, [onMeasurementSystemChange])

  React.useEffect(() => {
    onExtraFieldsChange?.(extraFieldValues)
  }, [extraFieldValues, onExtraFieldsChange])

  const tierFeatures = useMemo(() => {
    switch (tier) {
      case 'tier3':
        return { charts: true, comparison: true, educational: true, export: true, print: true, modes: true, i18n: true, audit: true, examples: true, eduCharts: true }
      case 'tier2':
        return { charts: true, comparison: true, educational: true, export: true, print: true, modes: true, i18n: true, audit: true, examples: true, eduCharts: true }
      default:
        return { charts: true, comparison: true, educational: true, export: true, print: true, modes: true, i18n: true, audit: true, examples: true, eduCharts: true }
    }
  }, [tier])

  const availableModes = useMemo((): CalcMode[] => {
    const modes: CalcMode[] = ['basic']
    const hasAdvanced = showTabs || !!formula || (steps && steps.length > 0) || !!interpretation || !!explanationProp || (example && example.length > 0)
    const hasProfessional = (tierFeatures.eduCharts && (!!formulaVariables || (conceptNodes && conceptNodes.length > 0) || (processSteps && processSteps.length > 0))) || (tierFeatures.examples && !!examples) || !!enhancedExplanationProp
    const hasExpert = tierFeatures.comparison || tierFeatures.audit
    if (hasAdvanced) modes.push('advanced')
    if (hasProfessional) modes.push('professional')
    if (hasExpert) modes.push('expert')
    return modes
  }, [showTabs, formula, steps, interpretation, explanationProp, example, tierFeatures, formulaVariables, conceptNodes, processSteps, examples, enhancedExplanationProp])

  useEffect(() => {
    if (!availableModes.includes(mode)) {
      setMode(availableModes[availableModes.length - 1] || 'basic')
    }
  }, [availableModes, mode])

  const explanation = useMemo(() => {
    if (explanationProp) return explanationProp
    if (hubCategory && mainValue !== undefined && inputs) {
      const parsedInputs: Record<string, number> = {}
      Object.entries(inputs).forEach(([k, v]) => { const n = parseFloat(v); if (!isNaN(n)) parsedInputs[k] = n })
      return generateExplanation(hubCategory, calculator.slug, mainValue, parsedInputs)
    }
    return null
  }, [explanationProp, hubCategory, mainValue, inputs, calculator.slug])

  const [articleTick, setArticleTick] = useState(0)
  useEffect(() => {
    longFormArticlesReady.then(() => setArticleTick(t => t + 1))
  }, [])

  const relatedSlugs = useMemo(() => {
    try {
      return calculatorRegistry
        .filter((entry: { slug: string; category: string }) => entry.slug !== calculator.slug && entry.category === calculator.category)
        .slice(0, 8)
        .map(entry => entry.slug)
    } catch { return [] }
  }, [calculator.slug, calculator.category])
  const [relatedCalculators, setRelatedCalculators] = useState<CalculatorEntry[]>([])
  useEffect(() => {
    (async () => {
      const entries = await Promise.all(
        relatedSlugs.map(async slug => {
          const localized = await getLocalizedCalculator(slug, locale)
          return localized ?? calculatorRegistry.find(c => c.slug === slug)!
        })
      )
      setRelatedCalculators(entries.filter(Boolean) as CalculatorEntry[])
    })()
  }, [relatedSlugs, locale])

  const calcContent = useMemo(() => generateCalculatorContent({
    ...calculator,
    category: calculator.category as CalculatorEntry['category'],
  } as CalculatorEntry), [calculator, articleTick])

  const HubIcon = hubIcons[calculator.category] || Zap

  const handleExport = useCallback((format: string) => {
    if (format === 'print') window.print()
    if (format === 'csv' && onExportCSV) {
      const csv = onExportCSV()
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${calculator.slug}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }, [calculator.slug, onExportCSV])

  const handleShare = useCallback(() => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    }
  }, [])

  const handleCopyResult = useCallback(async () => {
    const text = copyResultText || (() => {
      const lines: string[] = [calculator.title]
      if (inputs) Object.entries(inputs).forEach(([k, v]) => lines.push(`${k}: ${v}`))
      return lines.join('\n')
    })()
    try {
      await navigator.clipboard.writeText(text)
      setResultCopied(true)
      setTimeout(() => setResultCopied(false), 2000)
    } catch { /* fallback */ }
  }, [copyResultText, calculator.title, inputs])

  const handleCopyValue = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedValue(label)
      setTimeout(() => setCopiedValue(null), 2000)
    } catch { /* fallback */ }
  }, [])

  const handleSaveScenario = useCallback(() => {
    if (onSaveScenario) {
      const snapshot = onSaveScenario()
      const label = scenarioLabel || `Scenario ${scenarios.length + 1}`
      setScenarios(prev => [...prev, { id: crypto.randomUUID(), label, snapshot, mainValue }])
    }
    if (inputs) {
      addEntry(inputs)
    }
  }, [onSaveScenario, scenarioLabel, scenarios.length, inputs, addEntry, mainValue])

  const removeScenario = useCallback((id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id))
  }, [])

  const hubFAQs: Record<string, { q: string; a: string }[]> = {
    financial: [
      { q: 'What is the difference between simple and compound interest?', a: 'Simple interest is calculated only on the principal amount, while compound interest is calculated on the principal plus accumulated interest. Compound interest grows faster over time making it more powerful for long-term savings.' },
      { q: 'How does inflation affect my savings?', a: 'Inflation reduces purchasing power over time. If your savings earn less than the inflation rate, your money loses value in real terms. Aim for returns that outpace inflation.' },
      { q: 'What is a good debt-to-income ratio?', a: 'Lenders generally prefer a debt-to-income ratio below 36%. Ratios above 43% may make it difficult to qualify for mortgages and other major loans.' },
      { q: 'How much should I save for retirement?', a: 'A common guideline is to save 15% of your pre-tax income annually, including any employer match. Aim to have 1x your salary by age 30, 3x by 40, and 6x by 50.' },
    ],
    health: [
      { q: 'Are these calculators a substitute for medical advice?', a: 'No. These tools provide estimates for educational purposes only. Always consult a qualified healthcare professional for medical decisions.' },
      { q: 'How often should I check my BMI?', a: 'BMI is a screening tool, not a diagnostic measure. Checking 1-2 times per year is sufficient for most adults, or as recommended by your doctor.' },
      { q: 'What factors affect BMR besides age and weight?', a: 'BMR is influenced by muscle mass, genetics, hormones, body temperature, and environmental temperature. Muscle mass is the most modifiable factor through exercise.' },
      { q: 'What is a healthy body fat percentage?', a: 'Essential body fat ranges from 10-13% for women and 2-5% for men. Athletes typically range 14-20% (women) and 6-13% (men). Fitness ranges are 21-24% and 14-17% respectively.' },
    ],
    math: [
      { q: 'How are percentages calculated?', a: 'A percentage is a fraction of 100. To find x% of a number, multiply by x/100. For example, 15% of 200 = 200 × 0.15 = 30.' },
      { q: 'What is the difference between mean, median, and mode?', a: 'Mean is the average (sum ÷ count). Median is the middle value when sorted. Mode is the most frequent value. Each provides different insight into your data.' },
      { q: 'What is a ratio?', a: 'A ratio compares two quantities showing their relative sizes. Ratios can be expressed as a:b, a/b, or decimal. They are used to scale recipes, convert units, and compare values.' },
      { q: 'How do I calculate a tip?', a: 'Multiply the bill total by the tip percentage as a decimal. For 18% tip on a $50 bill: $50 × 0.18 = $9. To split, divide the total bill plus tip by the number of people.' },
    ],
    conversion: [
      { q: 'How do I convert between metric and imperial?', a: 'Use conversion factors such as 1 inch = 2.54 cm, 1 pound = 0.4536 kg, 1 gallon = 3.785 L. Multiply the value by the conversion factor.' },
      { q: 'How do temperature conversions work?', a: 'Celsius to Fahrenheit: °F = (°C × 9/5) + 32. Fahrenheit to Celsius: °C = (°F - 32) × 5/9. Kelvin = °C + 273.15.' },
      { q: 'How many significant figures should I use?', a: 'Use the precision of your input values. For most everyday conversions, 2-4 decimal places provide sufficient accuracy.' },
      { q: 'What is the difference between weight and mass?', a: 'Mass is the amount of matter in an object. Weight is the force of gravity on that mass. On Earth, the difference is negligible for everyday use, but mass is constant everywhere.' },
    ],
    'date-time': [
      { q: 'How many days in each month?', a: 'January (31), February (28/29), March (31), April (30), May (31), June (30), July (31), August (31), September (30), October (31), November (30), December (31).' },
      { q: 'What is a leap year?', a: 'A leap year occurs every 4 years if the year is divisible by 4 but not by 100 unless also divisible by 400. 2024, 2028, 2032 are leap years.' },
      { q: 'When does daylight saving time start and end?', a: 'In the US, DST starts the second Sunday of March and ends the first Sunday of November. In Europe, it starts the last Sunday of March and ends the last Sunday of October.' },
      { q: 'How do time zones work?', a: 'Time zones offset from Coordinated Universal Time (UTC). The US spans UTC-5 to UTC-10. Major zones: Eastern (UTC-5), Central (UTC-6), Mountain (UTC-7), Pacific (UTC-8).' },
    ],
    construction: [
      { q: 'How many square feet in a square yard?', a: 'There are 9 square feet in 1 square yard (3 ft × 3 ft). To convert square feet to square yards, divide by 9.' },
      { q: 'What size lumber is actually 2x4?', a: 'A nominal 2×4 actually measures 1.5" × 3.5". This is standard for framing lumber. Dimensional lumber shrinks after planing and drying.' },
      { q: 'How do I calculate concrete volume?', a: 'Concrete volume = length × width × height. For slabs, use feet for length/width and inches for thickness. 1 cubic yard = 27 cubic feet covers about 81 sq ft at 4" thick.' },
      { q: 'What is the standard stud spacing?', a: 'Wall studs are typically spaced 16 inches on center. Some walls use 24-inch spacing. This affects the number of studs needed and the structural load capacity.' },
    ],
    statistics: [
      { q: 'What is standard deviation?', a: 'Standard deviation measures the spread of data from the mean. A low SD means data points cluster near the mean; a high SD means data is spread out.' },
      { q: 'What does "statistically significant" mean?', a: 'A result is statistically significant if it is unlikely to have occurred by chance, typically measured by a p-value below 0.05.' },
      { q: 'How do I calculate probability?', a: 'Probability = number of favorable outcomes / total number of possible outcomes. Probabilities range from 0 (impossible) to 1 (certain).' },
      { q: 'What is a normal distribution?', a: 'A normal distribution is a bell-shaped curve where most data clusters around the mean. About 68% of data falls within 1 standard deviation, 95% within 2, and 99.7% within 3.' },
    ],
    education: [
      { q: 'How is GPA calculated?', a: 'GPA = (sum of grade points × credits) / total credits. A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0. Some schools use weighted GPA for honors courses.' },
      { q: 'What is the difference between a percentage and a letter grade?', a: 'Typically, 90-100% = A, 80-89% = B, 70-79% = C, 60-69% = D, below 60% = F. Some institutions use plus/minus modifiers.' },
      { q: 'How do I calculate final grade with weighted assignments?', a: 'Multiply each assignment grade by its weight percentage, sum the results, and divide by total weight. This gives your overall weighted average.' },
      { q: 'What is a good SAT or ACT score?', a: 'SAT ranges from 400-1600 with 1050 as average. ACT ranges from 1-36 with 21 as average. Competitive colleges typically look for SAT 1200+ or ACT 25+.' },
    ],
    physics: [
      { q: 'What is the formula for force?', a: 'Force = mass × acceleration (F = ma). Measured in newtons (N). One newton is the force needed to accelerate 1 kg at 1 m/s².' },
      { q: 'How does kinetic energy work?', a: 'Kinetic energy = ½ × mass × velocity² (KE = ½mv²). Energy doubles when mass doubles but quadruples when velocity doubles.' },
      { q: 'What is the speed of light?', a: 'The speed of light in a vacuum is exactly 299,792,458 m/s (≈300,000 km/s or 186,282 mi/s). This is the universal speed limit.' },
      { q: 'What are Newton\'s three laws of motion?', a: '1) Objects at rest stay at rest. 2) F = ma. 3) Every action has an equal and opposite reaction.' },
    ],
    chemistry: [
      { q: 'What is the mole concept?', a: 'A mole is 6.022 × 10²³ particles (Avogadro\'s number). One mole of a substance has a mass in grams equal to its molecular weight.' },
      { q: 'How do I balance chemical equations?', a: 'Adjust coefficients so the same number of each atom appears on both sides. Start with the most complex molecule, then balance elements one at a time.' },
      { q: 'What is pH?', a: 'pH = -log[H+]. pH below 7 is acidic, above 7 is basic (alkaline), and 7 is neutral. Each whole number change represents a 10× change in acidity.' },
      { q: 'How do dilution calculations work?', a: 'C₁V₁ = C₂V₂ where C is concentration and V is volume. This formula is used when diluting a solution by adding solvent.' },
    ],
    engineering: [
      { q: 'What is Ohm\'s Law?', a: 'Voltage = Current × Resistance (V = IR). Power = Voltage × Current (P = VI). These are fundamental relationships in electrical engineering.' },
      { q: 'How do gear ratios work?', a: 'Gear ratio = number of teeth on driven gear / number of teeth on driving gear. A higher ratio increases torque but decreases speed.' },
      { q: 'What is beam deflection?', a: 'Beam deflection is the degree to which a structural element bends under load. It depends on the material, cross-section, length, and applied force.' },
      { q: 'How is torque calculated?', a: 'Torque = force × distance from pivot point (τ = F × r). Measured in newton-meters (N·m) or pound-feet (lb·ft).' },
    ],
    everyday: [
      { q: 'How do I convert cooking measurements?', a: '1 cup = 8 fl oz = 16 tbsp = 48 tsp. 1 tbsp = 3 tsp. 1 fl oz = 2 tbsp. For dry ingredients, weights vary - 1 cup flour ≈ 120g, 1 cup sugar ≈ 200g.' },
      { q: 'How do I calculate fuel cost?', a: 'Fuel cost = distance ÷ fuel efficiency × fuel price. For a 300-mile trip at 25 MPG with $3.50/gallon: 300 ÷ 25 × 3.50 = $42.00.' },
      { q: 'How do I calculate sale price?', a: 'Sale price = original price × (1 - discount%). For 30% off $80: $80 × 0.70 = $56. Add sales tax: price × (1 + tax%).' },
      { q: 'How do I split a bill?', a: 'Each person pays = total ÷ number of people. For tip: total × tip% ÷ people. For example, $100 bill, 18% tip, 4 people: ($100 + $18) ÷ 4 = $29.50 each.' },
    ],
  }
  const generatedFAQs = generateCalculatorFAQ(calculator.slug, calculator.category)
  const faqs = generatedFAQs.length > 0 ? generatedFAQs.map(f => ({ q: f.question, a: f.answer })) : (hubFAQs[calculator.category] || [])

  const hasLongContent = interpretation || faqs.length > 0 || (calculator.keywords.length > 0)

  const tocSections = [
    ...(interpretation ? [{ id: 'what-this-means', label: 'What This Means' }] : []),
    ...(formula || (steps && steps.length > 0) ? [{ id: 'formula', label: 'Formula & Calculation' }] : []),
    ...(example && example.length > 0 ? [{ id: 'example', label: 'Example' }] : []),
    ...(calcContent.useCases.length > 0 ? [{ id: 'use-cases', label: 'Use Cases' }] : []),
    ...(calcContent.commonMistakes.length > 0 ? [{ id: 'common-mistakes', label: 'Common Mistakes' }] : []),
    ...(calcContent.comparisons.length > 0 ? [{ id: 'comparison-0', label: 'Comparison' }] : []),
    ...(calcContent.glossary.length > 0 ? [{ id: 'glossary', label: 'Glossary' }] : []),
    ...(calcContent.longFormArticle && calcContent.longFormArticle.length > 0 ? [{ id: 'educational-guide', label: 'Complete Guide' }] : []),
    { id: 'guide', label: 'Educational Guide' },
    ...(faqs.length > 0 ? [{ id: 'faq', label: 'FAQ' }] : []),
  ]
  const schemaFaqs = faqs.map(f => ({ question: f.q, answer: f.a }))

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

  return (
    <CalculatorLayout
      title={calculator.title}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: calculator.hubName, href: `/${calculator.hubSlug}` },
        { label: calculator.title, href: `/${calculator.hubSlug}/${calculator.slug}` },
      ]}
    >
      <div className="space-y-6">
        <BreadcrumbNav items={[
          { label: 'Home', href: '/' },
          { label: calculator.hubName, href: `/${calculator.hubSlug}` },
          { label: calculator.title, href: `/${calculator.hubSlug}/${calculator.slug}` },
        ]} />

        <CalculatorIntro
          title={calculator.title}
          description={calculator.description}
          category={calculator.category}
        />

        {/* Table of Contents */}
        {tocSections.length > 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <button onClick={() => setShowToC(!showToC)} className="flex items-center justify-between w-full text-sm font-medium text-gray-700 dark:text-gray-300">
              On this page
              {showToC ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showToC && (
              <nav className="mt-3 space-y-1">
                {tocSections.map(s => (
                  <a key={s.id} href={`#${s.id}`} onClick={() => setShowToC(false)}
                    className="block text-sm text-gray-500 dark:text-gray-400 hover:text-[#06b6d4] transition-colors py-0.5">
                    {s.label}
                  </a>
                ))}
              </nav>
            )}
          </div>
        )}

        {/* Calculator Engine */}
        <CalculatorErrorBoundary>
        {loading ? <CalculatorLoadingSkeleton /> : calcError ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            <CalculatorEmptyState title={calculator.title} />
          </div>
        ) : (
        <CalculatorModeProvider mode={mode}>
        <div id="calculator" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
          {/* Calculator Mode Toggle & Toolbar */}
          {tierFeatures.modes && (
            <div className="mb-6">
              <div className="flex items-center justify-between flex-wrap gap-y-2">
                <div className="flex items-center gap-3">
                  <CalculatorModeToggle mode={mode} onChange={handleModeChange} availableModes={availableModes} />
                  <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-500">
                    {mode === 'basic' && 'Essential — just the result'}
                    {mode === 'advanced' && 'Formula, steps & interpretation'}
                    {mode === 'professional' && 'Charts, examples & deep explanations'}
                    {mode === 'expert' && 'Scenarios, batch & quality audit'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {tierFeatures.i18n && (
                    <InternationalizationPanel
                      country={country} currency={currency} measurement={measSystem}
                      onCountryChange={handleCountryChange} onCurrencyChange={handleCurrencyChange}
                      onMeasurementChange={handleMeasurementChange}
                    />
                  )}
                  <ExportPanel
                    slug={calculator.slug} title={calculator.title}
                    inputs={inputs} resultSummary={copyResultText} steps={steps}
                    resultValue={copyResultText} category={calculator.category}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4 max-w-full overflow-x-auto">
              <ExtraFieldsProvider extraFields={extraFieldValues}>
              <ExtraFieldInjector
                slug={calculator.slug}
                hubSlug={calculator.hubSlug}
                extraFields={getExtraFieldsForCalculator(calculator.slug, calculator.hubSlug)}
                onFieldsChange={setExtraFieldValues}
              >
                {form}
              </ExtraFieldInjector>
              </ExtraFieldsProvider>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 sm:p-6 flex flex-col justify-center max-w-full overflow-x-auto">
              {showTabs && modeLevel >= 1 ? (
                <ResultTabs
                  mainResult={result}
                  charts={charts}
                  breakdown={breakdown}
                  schedule={schedule}
                  inputs={inputs}
                  slug={calculator.slug}
                />
              ) : (
                <div className="space-y-3">
                  {result}
                  <ResultQualityBadge quality={getQualityInfo(calculator.slug, calculator.category)} />
                  <InputRangeValidator ranges={getInputRanges(calculator.slug) || {}} inputs={inputs} />
                </div>
              )}
            </div>
          </div>

          {/* Range Visualizer */}
          {rangeVisualizer && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
              {rangeVisualizer}
            </div>
          )}

          {/* Restore saved values banner */}
          {showRestore && onRestoreValues && (
            <div className="flex items-center justify-between gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <RefreshCw className="w-4 h-4 shrink-0" />
                <span>Restore your previous values?</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    const saved = autoSave.restore()
                    if (saved && onRestoreValues) { onRestoreValues(saved) }
                    setShowRestore(false)
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors min-h-[44px]"
                >
                  Restore
                </button>
                <button
                  onClick={() => { setRestoreDismissed(true); autoSave.clear() }}
                  className="px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/30 rounded-lg transition-colors min-h-[44px]"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Extra Field Adjustments */}
          {Object.keys(extraFieldValues).length > 0 && mainValue !== undefined && (
            <ExtraFieldAdjustments
              hubSlug={calculator.hubSlug}
              mainValue={mainValue}
              extraFields={extraFieldValues}
            />
          )}

          {/* Presets */}
          {presets && presets.length > 0 && onPresetApply && (
            <div className="mt-4">
              <VisualPresetCards presets={presets} onApply={onPresetApply} />
            </div>
          )}

          {/* Tier action bar */}
          {(tierFeatures.export || tierFeatures.comparison || onUnitChange || extraActions || onReset || onToggleSlider) && (
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <ActionToolbar
                onReset={onReset}
                onUnitChange={onUnitChange as ((unit: string) => void) | undefined}
                unitOptions={unitOptions}
                unitSystem={unitSystem}
                onToggleSlider={onToggleSlider}
                useSlider={useSlider}
                onExport={handleExport}
                onShare={handleShare}
                shareCopied={shareCopied}
                onCopyResult={(copyResultText || inputs) ? handleCopyResult : undefined}
                copyResultText="Copy Result"
                onSaveScenario={onSaveScenario ? handleSaveScenario : undefined}
                showCSV={!!(tierFeatures.export && onExportCSV)}
                modeLevel={modeLevel}
                tierFeatures={tierFeatures}
                showBatch={showBatch}
                onToggleBatch={setShowBatch}
                shareButtons={
                  <ShareButtons url={shareUrl} title={calculator.title} description={calculator.description} />
                }
                embedWidget={
                  <EmbedWidget slug={calculator.slug} title={calculator.title} hubSlug={calculator.hubSlug} />
                }
                citationGenerator={
                  <CitationGenerator title={calculator.title} url={shareUrl} />
                }
                extraActions={extraActions}
              />
            </div>
          )}

          {/* Scenario comparison (Expert+) */}
          {modeLevel >= 3 && tierFeatures.comparison && (
            <ScenarioComparison
              scenarios={scenarios.map(s => ({
                ...s,
                inputs: Object.fromEntries(s.snapshot.split('\n').filter(Boolean).map(l => {
                  const [k, ...v] = l.split(': ')
                  return [k, v.join(': ')]
                })),
                mainValue: s.mainValue,
              }))}
              mainValueLabel={calculator.title}
              onRemove={removeScenario}
              onApply={(vals) => {
                if (onRestoreValues) {
                  onRestoreValues(vals)
                } else {
                  for (const [key, val] of Object.entries(vals)) {
                    try { (document.querySelector(`[name="${key}"]`) as HTMLInputElement)?.focus() } catch {}
                  }
                }
              }}
              onSave={handleSaveScenario}
              scenarioLabel={scenarioLabel}
            />
          )}
          </div>
        </CalculatorModeProvider>
        )}
        </CalculatorErrorBoundary>

        {/* Calculation History */}
          {/* Batch Calculator (Expert+) */}
          {modeLevel >= 3 && tierFeatures.comparison && (
            <BatchCalculator
            title={calculator.title}
            fields={[{ name: 'value1', label: 'Value 1', type: 'number' }, { name: 'value2', label: 'Value 2', type: 'number' }]}
            onCalculate={(rows) => rows.map(() => [{ label: 'Result', value: '—' }])}
            show={showBatch}
            onToggle={() => setShowBatch(!showBatch)}
          />
        )}

        {inputs && (
          <CalculationHistory
            entries={history}
            onApply={(vals) => {
              const inputsEl = document.querySelector('[name]')
              if (inputsEl) inputsEl.closest('form')?.requestSubmit?.()
            }}
            onRemove={removeEntry}
            onClear={clearHistory}
            onExportCSV={exportCSV}
            show={showHistory}
            onToggle={() => setShowHistory(!showHistory)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            clearConfirm={clearConfirm}
            onClearConfirm={setClearConfirm}
            calcStats={calcStats}
          />
        )}

        {/* Data dependent notice */}
        {calculator.dataDependent && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-200">
            <strong>Data-dependent calculator:</strong> This calculator uses periodically refreshed data.
            {calculator.dataRefreshCadence && <span> Refresh cadence: {calculator.dataRefreshCadence}.</span>}
          </div>
        )}

        {/* Tier badges & features */}
        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full font-medium ${
            tier === 'tier3' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' :
            tier === 'tier2' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' :
            'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          }`}>
            {tier === 'tier3' ? 'Premium' : tier === 'tier2' ? 'Standard' : 'Essential'}
          </span>
          {tierFeatures.charts && <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> Charts</span>}
          {tierFeatures.comparison && <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Comparison</span>}
          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> Guide</span>
          {unitSystem && <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3" /> {unitSystem}</span>}
          <HubIcon className="w-3 h-3 text-gray-300 dark:text-gray-600" />
          {userCount !== undefined && (
            <span className="flex items-center gap-1 text-gray-400">
              <ThumbsUp className="w-3 h-3" /> {userCount.toLocaleString()} users
            </span>
          )}
        </div>

        {/* Formula & Step-by-Step */}
        {modeLevel >= 1 && (formula || (steps && steps.length > 0)) && (
          <div id="formula" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Formula & Calculation</h2>
            {formula && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{formula}</p>
              </div>
            )}
            {steps && steps.length > 0 && (
              <div className="space-y-2">
                  {steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1a3a8a]/10 text-[#06b6d4] flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-600 dark:text-gray-400">{step.label}</p>
                      <div className="flex items-center gap-1">
                        <p className="font-mono font-medium text-gray-900 dark:text-white">{step.value}</p>
                        <button onClick={() => handleCopyValue(`${step.label}: ${step.value}`, `step-${i}`)} className="p-1 text-gray-400 hover:text-[#06b6d4] transition-colors" aria-label={`Copy ${step.label}`}>
                          {copiedValue === `step-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Educational Charts (Professional+) */}
        {modeLevel >= 2 && tierFeatures.eduCharts && (formulaVariables || conceptNodes || processSteps) && (
          <div id="educational-charts" className="space-y-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Educational Visualizations</h2>
            {formulaVariables && <FormulaChart formula={formula || ''} variables={formulaVariables} />}
            {conceptNodes && conceptNodes.length > 0 && <ConceptDiagram nodes={conceptNodes} edges={conceptEdges || []} />}
            {processSteps && <ProcessFlowChart steps={processSteps} />}
          </div>
        )}

        {/* Worked Example (Advanced+) */}
        {modeLevel >= 1 && example && example.length > 0 && (
          <div id="example" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Example Calculation</h2>
            <div className="space-y-2">
              {example.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 dark:text-gray-400">{step.label}</p>
                    <div className="flex items-center gap-1">
                      <p className="font-mono font-medium text-gray-900 dark:text-white">{step.value}</p>
                      <button onClick={() => handleCopyValue(`${step.label}: ${step.value}`, `example-${i}`)} className="p-1 text-gray-400 hover:text-amber-600 transition-colors" aria-label={`Copy ${step.label}`}>
                        {copiedValue === `example-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Example Chart Generator (Professional+) */}
        {modeLevel >= 2 && tierFeatures.examples && examples && (
          <div id="examples" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Example Calculations</h2>
            <ExampleChartGenerator
              beginner={examples.beginner} typical={examples.typical}
              advanced={examples.advanced} realworld={examples.realworld}
              chartType={exampleChartType}
            />
          </div>
        )}

        {/* Result Interpretation (Advanced+) */}
        {modeLevel >= 1 && interpretation && (
          <div id="what-this-means" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What This Means</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{interpretation}</p>
          </div>
        )}

        {/* Dynamic Explanation (Advanced+) */}
        {modeLevel >= 1 && explanation && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Your Results Explained</h2>
            <div className="prose dark:prose-invert max-w-none text-sm">
              <p className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: explanation.summary }} />
              {explanation.details.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {explanation.details.map((d, i) => (
                    <li key={i} className="text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: d }} />
                  ))}
                </ul>
              )}
            </div>
            {explanation.tips.length > 0 && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1.5">Tips</p>
                <ul className="space-y-1">
                  {explanation.tips.map((tip, i) => (
                    <li key={i} className="text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1.5">
                      <span className="mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Result Explanation (Professional+) */}
        {modeLevel >= 2 && tierFeatures.eduCharts && enhancedExplanationProp && mainValue !== undefined && (
          <div id="enhanced-results" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Results Explained</h2>
            <EnhancedResultExplanation
              value={mainValue} label={calculator.title}
              goodRange={enhancedExplanationProp.goodRange}
              benchmarks={enhancedExplanationProp.benchmarks}
              nextActions={enhancedExplanationProp.nextActions}
              optimizations={enhancedExplanationProp.optimizations}
              warnings={enhancedExplanationProp.warnings}
              resultInsights={enhancedExplanationProp.resultInsights}
              detailedExplanation={enhancedExplanationProp.detailedExplanation || (() => {
                const parsedInputs: Record<string, number> = {}
                if (inputs) Object.entries(inputs).forEach(([k, v]) => { const n = parseFloat(v); if (!isNaN(n)) parsedInputs[k] = n })
                const aiExp = generateAIExplanation(calculator.category, calculator.slug, mainValue, parsedInputs)
                return {
                  whatItMeans: aiExp.whatItMeans,
                  whyItMatters: aiExp.whyItMatters,
                  whatAffectsIt: aiExp.whatAffectsIt,
                  howToImprove: aiExp.howToImprove,
                  detailedSections: aiExp.detailedSections,
                }
              })()}
            />
          </div>
        )}

        {/* Sub-Calculations (Advanced+) */}
        {modeLevel >= 1 && subCalcs && (
          <div className="space-y-3">
            {subCalcs}
          </div>
        )}

        {/* Informational Sections (Use Cases, Mistakes, Glossary, Concepts) */}
        <InformationalSection title={calculator.title} description={calculator.description} content={calcContent} />

        {/* Commercial Section (Comparisons, Pros/Cons, Alternatives, Recommendations) */}
        <CommercialSection title={calculator.title} content={calcContent} />

        {/* Navigational Section (Audience, Hub, Related Links) */}
        <NavigationalSection calculator={calculator} content={calcContent} />

        {/* Educational Content (collapsible) */}
        <div id="guide" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowContent(!showContent)}
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
            applicationCategory: (() => {
              const map: Record<string, string> = { financial: 'FinanceApplication', health: 'HealthApplication', math: 'ScienceApplication', conversion: 'UtilitiesApplication', construction: 'BusinessApplication', statistics: 'DataAnalysisApplication', education: 'EducationalApplication', physics: 'ScienceApplication', chemistry: 'ScienceApplication', engineering: 'EngineeringApplication', everyday: 'LifestyleApplication', food: 'LifestyleApplication', biology: 'ScienceApplication', ecology: 'ScienceApplication', sports: 'SportsApplication', 'date-time': 'UtilitiesApplication' }
              return map[calculator.hubSlug] || 'UtilitiesApplication'
            })(),
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
            { name: 'Home', url: `https://www.jdcalc.com` },
            { name: calculator.hubName, url: `https://www.jdcalc.com/${calculator.hubSlug}` },
            { name: calculator.title, url: `https://www.jdcalc.com/${calculator.hubSlug}/${calculator.slug}` },
          ])} />
          <SchemaMarkup type="WebApplication" data={{
            name: calculator.title,
            description: calculator.description,
            url: `https://www.jdcalc.com/${calculator.hubSlug}/${calculator.slug}`,
            applicationCategory: (() => {
              const map: Record<string, string> = { financial: 'FinanceApplication', health: 'HealthApplication', math: 'ScienceApplication', conversion: 'UtilitiesApplication', construction: 'BusinessApplication', statistics: 'DataAnalysisApplication', education: 'EducationalApplication', physics: 'ScienceApplication', chemistry: 'ScienceApplication', engineering: 'EngineeringApplication', everyday: 'LifestyleApplication', food: 'LifestyleApplication', biology: 'ScienceApplication', ecology: 'ScienceApplication', sports: 'SportsApplication', 'date-time': 'UtilitiesApplication' }
              return map[calculator.hubSlug] || 'UtilitiesApplication'
            })(),
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }} />
          {calcContent.useCases.length > 0 && <SchemaMarkup type="ItemList" data={{
            itemListElement: calcContent.useCases.slice(0, 5).map((uc, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: uc.title,
              description: uc.description,
            })),
          }} />}
          {calcContent.glossary.length > 0 && <SchemaMarkup type="ItemList" data={{
            name: `${calculator.title} Glossary`,
            description: 'Key terms related to this calculator',
            itemListElement: calcContent.glossary.map((g, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: g.term,
              description: g.definition,
            })),
          }} />}
        </div>

        {/* Feedback widget */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">Did this calculator help you?</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFeedback('yes')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  feedback === 'yes' ? 'bg-green-50 dark:bg-green-900/20 border-green-300 text-green-700 dark:text-green-300' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" /> Yes
              </button>
              <button
                onClick={() => setFeedback('no')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  feedback === 'no' ? 'bg-red-50 dark:bg-red-900/20 border-red-300 text-red-700 dark:text-red-300' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5 rotate-180" /> No
              </button>
            </div>
          </div>
        </div>

        {/* AI Quality Audit Score (Expert+) */}
        {modeLevel >= 3 && tierFeatures.audit && (
          <div>
            <button
              onClick={() => setShowAudit(!showAudit)}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#06b6d4] transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              {showAudit ? 'Hide' : 'Show'} AI Quality Audit
              {showAudit ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showAudit && <QualityAuditScore categories={generateAuditScores(calculator, tierFeatures)} />}
          </div>
        )}

        {/* Internal Linking Grid (replaces old Related Calculators) */}
        <InternalLinkingGrid calculator={calculator} />

        {/* Related Calculators Carousel */}
        {relatedCalculators.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            <RelatedCalculatorCarousel
              calculators={relatedCalculators}
              hubPath={calculator.hubSlug}
              title="Related Calculators"
            />
          </div>
        )}
      </div>
    </CalculatorLayout>
  )
}
