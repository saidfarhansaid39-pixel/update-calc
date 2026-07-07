'use client'

import dynamic from 'next/dynamic'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'

const FinancialCalculator = dynamic(() => import('./GenericFinancialCalculator').then(m => ({ default: m.GenericFinancialCalculator })), { ssr: false })
const HealthCalculator = dynamic(() => import('./GenericHealthCalculator').then(m => ({ default: m.GenericHealthCalculator })), { ssr: false })
const MathCalculator = dynamic(() => import('./GenericMathCalculator'), { ssr: false })
const ConversionCalculator = dynamic(() => import('./GenericConversionCalculator').then(m => ({ default: m.GenericConversionCalculator })), { ssr: false })
const DateTimeCalculator = dynamic(() => import('./GenericDateTimeCalculator').then(m => ({ default: m.GenericDateTimeCalculator })), { ssr: false })
const ConstructionCalculator = dynamic(() => import('./GenericConstructionCalculator').then(m => ({ default: m.GenericConstructionCalculator })), { ssr: false })
const StatisticsCalculator = dynamic(() => import('./GenericStatisticsCalculator').then(m => ({ default: m.GenericStatisticsCalculator })), { ssr: false })
const EducationCalculator = dynamic(() => import('./GenericEducationCalculator').then(m => ({ default: m.GenericEducationCalculator })), { ssr: false })
const PhysicsCalculator = dynamic(() => import('./GenericPhysicsCalculator').then(m => ({ default: m.GenericPhysicsCalculator })), { ssr: false })
const ChemistryCalculator = dynamic(() => import('./GenericChemistryCalculator'), { ssr: false })
const EngineeringCalculator = dynamic(() => import('./GenericEngineeringCalculator').then(m => ({ default: m.GenericEngineeringCalculator })), { ssr: false })
const EverydayCalculator = dynamic(() => import('./GenericEverydayCalculator').then(m => ({ default: m.GenericEverydayCalculator })), { ssr: false })
const FoodCalculator = dynamic(() => import('./GenericFoodCalculator').then(m => ({ default: m.GenericFoodCalculator })), { ssr: false })
const BiologyCalculator = dynamic(() => import('./GenericBiologyCalculator').then(m => ({ default: m.GenericBiologyCalculator })), { ssr: false })
const EcologyCalculator = dynamic(() => import('./GenericEcologyCalculator').then(m => ({ default: m.GenericEcologyCalculator })), { ssr: false })
const SportsCalculator = dynamic(() => import('./GenericSportsCalculator').then(m => ({ default: m.GenericSportsCalculator })), { ssr: false })

const calcMap: Record<string, React.ComponentType<any>> = {
  'financial-calculators': FinancialCalculator,
  'health-calculators': HealthCalculator,
  'math-calculators': MathCalculator,
  'conversion-calculators': ConversionCalculator,
  'date-time-calculators': DateTimeCalculator,
  'construction-calculators': ConstructionCalculator,
  'statistics-calculators': StatisticsCalculator,
  'education-calculators': EducationCalculator,
  'physics-calculators': PhysicsCalculator,
  'chemistry-calculators': ChemistryCalculator,
  'engineering-calculators': EngineeringCalculator,
  'everyday-calculators': EverydayCalculator,
  'food-calculators': FoodCalculator,
  'biology-calculators': BiologyCalculator,
  'ecology-calculators': EcologyCalculator,
  'sports-calculators': SportsCalculator,
}

interface Props {
  hubSlug: string
  calculator: CalculatorEntry
}

export function CalculatorRenderer({ hubSlug, calculator }: Props) {
  const Comp = calcMap[hubSlug]
  if (!Comp) return <div>Calculator not found for hub: {hubSlug}</div>
  return <Comp calculator={calculator} />
}
