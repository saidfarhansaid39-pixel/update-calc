import dynamic from 'next/dynamic'

const chartPlaceholder = (height = 300) => (
  <div className="animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" style={{ height }} />
)

export const DynamicLoanDonutChart = dynamic(() => import('./CalculatorCharts').then(mod => ({ default: mod.LoanDonutChart })), { ssr: false, loading: () => chartPlaceholder(280) })
export const DynamicInvestmentGrowthChart = dynamic(() => import('./CalculatorCharts').then(mod => ({ default: mod.InvestmentGrowthChart })), { ssr: false, loading: () => chartPlaceholder(320) })
export const DynamicAmortizationChart = dynamic(() => import('./CalculatorCharts').then(mod => ({ default: mod.AmortizationChart })), { ssr: false, loading: () => chartPlaceholder(350) })
export const DynamicComparisonBarChart = dynamic(() => import('./CalculatorCharts').then(mod => ({ default: mod.ComparisonBarChart })), { ssr: false, loading: () => chartPlaceholder(300) })

export const DynamicFormulaChart = dynamic(() => import('./EducationalCharts').then(mod => ({ default: mod.FormulaChart })), { ssr: false, loading: () => chartPlaceholder(250) })
export const DynamicConceptDiagram = dynamic(() => import('./EducationalCharts').then(mod => ({ default: mod.ConceptDiagram })), { ssr: false, loading: () => chartPlaceholder(300) })
export const DynamicProcessFlowChart = dynamic(() => import('./EducationalCharts').then(mod => ({ default: mod.ProcessFlowChart })), { ssr: false, loading: () => chartPlaceholder(280) })

export const DynamicExampleChartGenerator = dynamic(() => import('./ExampleChartGenerator').then(mod => ({ default: mod.ExampleChartGenerator })), { ssr: false, loading: () => chartPlaceholder(350) })

export const DynamicHealthBarChart = dynamic(() => import('./HubCharts').then(mod => ({ default: mod.HealthBarChart })), { ssr: false, loading: () => chartPlaceholder(300) })
export const DynamicMathPieChart = dynamic(() => import('./HubCharts').then(mod => ({ default: mod.MathPieChart })), { ssr: false, loading: () => chartPlaceholder(300) })
export const DynamicEngineeringRadarChart = dynamic(() => import('./HubCharts').then(mod => ({ default: mod.EngineeringRadarChart })), { ssr: false, loading: () => chartPlaceholder(300) })
export const DynamicProgressBarChart = dynamic(() => import('./HubCharts').then(mod => ({ default: mod.ProgressBarChart })), { ssr: false, loading: () => chartPlaceholder(250) })
export const DynamicTimelineChart = dynamic(() => import('./HubCharts').then(mod => ({ default: mod.TimelineChart })), { ssr: false, loading: () => chartPlaceholder(300) })
export const DynamicComparisonPieChart = dynamic(() => import('./HubCharts').then(mod => ({ default: mod.ComparisonPieChart })), { ssr: false, loading: () => chartPlaceholder(300) })
