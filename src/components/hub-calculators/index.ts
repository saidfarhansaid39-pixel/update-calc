import dynamic from 'next/dynamic'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'

export type GenericCalculatorComponent = React.ComponentType<{ calculator: CalculatorEntry }>

const componentMap: Record<string, GenericCalculatorComponent> = {
  'financial-calculators': dynamic(() => import('./GenericFinancialCalculator').then(m => ({ default: m.GenericFinancialCalculator }))) as GenericCalculatorComponent,
  'health-calculators': dynamic(() => import('./GenericHealthCalculator').then(m => ({ default: m.GenericHealthCalculator }))) as GenericCalculatorComponent,
  'math-calculators': dynamic(() => import('./GenericMathCalculator')) as GenericCalculatorComponent,
  'conversion-calculators': dynamic(() => import('./GenericConversionCalculator').then(m => ({ default: m.GenericConversionCalculator }))) as GenericCalculatorComponent,
  'date-time-calculators': dynamic(() => import('./GenericDateTimeCalculator').then(m => ({ default: m.GenericDateTimeCalculator }))) as GenericCalculatorComponent,
  'construction-calculators': dynamic(() => import('./GenericConstructionCalculator').then(m => ({ default: m.GenericConstructionCalculator }))) as GenericCalculatorComponent,
  'statistics-calculators': dynamic(() => import('./GenericStatisticsCalculator').then(m => ({ default: m.GenericStatisticsCalculator }))) as GenericCalculatorComponent,
  'education-calculators': dynamic(() => import('./GenericEducationCalculator').then(m => ({ default: m.GenericEducationCalculator }))) as GenericCalculatorComponent,
  'physics-calculators': dynamic(() => import('./GenericPhysicsCalculator').then(m => ({ default: m.GenericPhysicsCalculator }))) as GenericCalculatorComponent,
  'chemistry-calculators': dynamic(() => import('./GenericChemistryCalculator')) as GenericCalculatorComponent,
  'engineering-calculators': dynamic(() => import('./GenericEngineeringCalculator').then(m => ({ default: m.GenericEngineeringCalculator }))) as GenericCalculatorComponent,
  'everyday-calculators': dynamic(() => import('./GenericEverydayCalculator').then(m => ({ default: m.GenericEverydayCalculator }))) as GenericCalculatorComponent,
  'food-calculators': dynamic(() => import('./GenericFoodCalculator').then(m => ({ default: m.GenericFoodCalculator }))) as GenericCalculatorComponent,
  'biology-calculators': dynamic(() => import('./GenericBiologyCalculator').then(m => ({ default: m.GenericBiologyCalculator }))) as GenericCalculatorComponent,
  'ecology-calculators': dynamic(() => import('./GenericEcologyCalculator').then(m => ({ default: m.GenericEcologyCalculator }))) as GenericCalculatorComponent,
  'sports-calculators': dynamic(() => import('./GenericSportsCalculator').then(m => ({ default: m.GenericSportsCalculator }))) as GenericCalculatorComponent,
}

export function getCalculatorComponent(hubSlug: string): GenericCalculatorComponent | undefined {
  return componentMap[hubSlug]
}
