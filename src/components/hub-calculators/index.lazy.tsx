import dynamic from 'next/dynamic'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'

export type GenericCalculatorComponent = React.ComponentType<{ calculator: CalculatorEntry }>

function LoadingFallback() {
  return (
    <>
      <div className="animate-pulse space-y-4 p-6">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <noscript className="block p-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        This interactive calculator requires JavaScript. Enable JavaScript in your browser settings to calculate results, view charts, and use all features including scenario comparison, export, and history.
      </noscript>
    </>
  )
}

// Each hub is code-split into its own chunk and client-only rendered so the
// shared bundle stays small. Charts (recharts) are additionally lazy-loaded
// inside each hub via `components/premium/DynamicCharts`.
export const GenericMathCalculator = dynamic(() => import('./GenericMathCalculator'), { ssr: false, loading: LoadingFallback })
export const GenericHealthCalculator = dynamic(() => import('./GenericHealthCalculator').then(m => ({ default: m.GenericHealthCalculator })), { ssr: false, loading: LoadingFallback })
export const GenericFinanceCalculator = dynamic(() => import('./GenericFinancialCalculator').then(m => ({ default: m.GenericFinancialCalculator })), { ssr: false, loading: LoadingFallback })
export const GenericConversionCalculator = dynamic(() => import('./GenericConversionCalculator').then(m => ({ default: m.GenericConversionCalculator })), { ssr: false, loading: LoadingFallback })
export const GenericDateTimeCalculator = dynamic(() => import('./GenericDateTimeCalculator').then(m => ({ default: m.GenericDateTimeCalculator })), { ssr: false, loading: LoadingFallback })
export const GenericConstructionCalculator = dynamic(() => import('./GenericConstructionCalculator').then(m => ({ default: m.GenericConstructionCalculator })), { ssr: false, loading: LoadingFallback })
export const GenericStatisticsCalculator = dynamic(() => import('./GenericStatisticsCalculator').then(m => ({ default: m.GenericStatisticsCalculator })), { ssr: false, loading: LoadingFallback })
export const GenericEducationCalculator = dynamic(() => import('./GenericEducationCalculator').then(m => ({ default: m.GenericEducationCalculator })), { ssr: false, loading: LoadingFallback })
export const GenericPhysicsCalculator = dynamic(() => import('./GenericPhysicsCalculator').then(m => ({ default: m.GenericPhysicsCalculator })), { ssr: false, loading: LoadingFallback })
export const GenericChemistryCalculator = dynamic(() => import('./GenericChemistryCalculator'), { ssr: false, loading: LoadingFallback })
export const GenericEngineeringCalculator = dynamic(() => import('./GenericEngineeringCalculator').then(m => ({ default: m.GenericEngineeringCalculator })), { ssr: false, loading: LoadingFallback })
export const GenericEverydayCalculator = dynamic(() => import('./GenericEverydayCalculator').then(m => ({ default: m.GenericEverydayCalculator })), { ssr: false, loading: LoadingFallback })
export const GenericFoodCalculator = dynamic(() => import('./GenericFoodCalculator').then(m => ({ default: m.GenericFoodCalculator })), { ssr: false, loading: LoadingFallback })
export const GenericBiologyCalculator = dynamic(() => import('./GenericBiologyCalculator').then(m => ({ default: m.GenericBiologyCalculator })), { ssr: false, loading: LoadingFallback })
export const GenericEcologyCalculator = dynamic(() => import('./GenericEcologyCalculator').then(m => ({ default: m.GenericEcologyCalculator })), { ssr: false, loading: LoadingFallback })
export const GenericSportsCalculator = dynamic(() => import('./GenericSportsCalculator').then(m => ({ default: m.GenericSportsCalculator })), { ssr: false, loading: LoadingFallback })
