import dynamic from 'next/dynamic'

const chartPlaceholder = (_height = 300, noscriptContent?: string) => (
  <>
    <div className="h-[300px] animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
    {noscriptContent && <noscript className="block p-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">{noscriptContent}</noscript>}
  </>
)

export const DynamicLoanDonutChart = dynamic(() => import('./CalculatorCharts').then(mod => ({ default: mod.LoanDonutChart })), { ssr: false, loading: () => chartPlaceholder(280, 'This chart requires JavaScript. It shows a payment breakdown comparing principal vs total interest.' )})
export const DynamicInvestmentGrowthChart = dynamic(() => import('./CalculatorCharts').then(mod => ({ default: mod.InvestmentGrowthChart })), { ssr: false, loading: () => chartPlaceholder(320, 'This chart requires JavaScript. It shows investment growth projection over time, comparing portfolio value vs total contributions.' )})
export const DynamicAmortizationChart = dynamic(() => import('./CalculatorCharts').then(mod => ({ default: mod.AmortizationChart })), { ssr: false, loading: () => chartPlaceholder(350, 'This chart requires JavaScript. It shows the amortization schedule — remaining loan balance decreasing over time.' )})
export const DynamicComparisonBarChart = dynamic(() => import('./CalculatorCharts').then(mod => ({ default: mod.ComparisonBarChart })), { ssr: false, loading: () => chartPlaceholder(300, 'This chart requires JavaScript. It compares multiple values side by side in a bar chart.' )})

export const DynamicFormulaChart = dynamic(() => import('./EducationalCharts').then(mod => ({ default: mod.FormulaChart })), { ssr: false, loading: () => chartPlaceholder(250, 'This chart requires JavaScript. It visualizes how formula variables affect the result.' )})
export const DynamicConceptDiagram = dynamic(() => import('./EducationalCharts').then(mod => ({ default: mod.ConceptDiagram })), { ssr: false, loading: () => chartPlaceholder(300, 'This chart requires JavaScript. It displays a concept diagram showing relationships between key terms.' )})
export const DynamicProcessFlowChart = dynamic(() => import('./EducationalCharts').then(mod => ({ default: mod.ProcessFlowChart })), { ssr: false, loading: () => chartPlaceholder(280, 'This chart requires JavaScript. It shows a step-by-step process flow diagram.' )})

export const DynamicExampleChartGenerator = dynamic(() => import('./ExampleChartGenerator').then(mod => ({ default: mod.ExampleChartGenerator })), { ssr: false, loading: () => chartPlaceholder(350, 'This chart requires JavaScript. It generates example calculations with visual charts based on the selected difficulty level.' )})

export const DynamicHealthBarChart = dynamic(() => import('./HubCharts').then(mod => ({ default: mod.HealthBarChart })), { ssr: false, loading: () => chartPlaceholder(300, 'This chart requires JavaScript. It displays health metrics comparing current values to targets.' )})
export const DynamicMathPieChart = dynamic(() => import('./HubCharts').then(mod => ({ default: mod.MathPieChart })), { ssr: false, loading: () => chartPlaceholder(300, 'This chart requires JavaScript. It shows a pie chart distribution of values.' )})
export const DynamicEngineeringRadarChart = dynamic(() => import('./HubCharts').then(mod => ({ default: mod.EngineeringRadarChart })), { ssr: false, loading: () => chartPlaceholder(300, 'This chart requires JavaScript. It displays a radar chart comparing performance metrics.' )})
export const DynamicProgressBarChart = dynamic(() => import('./HubCharts').then(mod => ({ default: mod.ProgressBarChart })), { ssr: false, loading: () => chartPlaceholder(250, 'This chart requires JavaScript. It shows progress toward goals with horizontal bars.' )})
export const DynamicTimelineChart = dynamic(() => import('./HubCharts').then(mod => ({ default: mod.TimelineChart })), { ssr: false, loading: () => chartPlaceholder(300, 'This chart requires JavaScript. It shows a timeline or trend line over periods.' )})
export const DynamicComparisonPieChart = dynamic(() => import('./HubCharts').then(mod => ({ default: mod.ComparisonPieChart })), { ssr: false, loading: () => chartPlaceholder(300, 'This chart requires JavaScript. It shows a breakdown comparison using a donut chart.' )})
