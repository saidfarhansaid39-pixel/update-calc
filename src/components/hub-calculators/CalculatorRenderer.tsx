'use client'

import type { CalculatorEntry } from '@calcuniverse/calculator-registry'
import {
  GenericMathCalculator as MathCalculator,
  GenericHealthCalculator as HealthCalculator,
  GenericFinanceCalculator as FinancialCalculator,
  GenericConversionCalculator as ConversionCalculator,
  GenericDateTimeCalculator as DateTimeCalculator,
  GenericConstructionCalculator as ConstructionCalculator,
  GenericStatisticsCalculator as StatisticsCalculator,
  GenericEducationCalculator as EducationCalculator,
  GenericPhysicsCalculator as PhysicsCalculator,
  GenericChemistryCalculator as ChemistryCalculator,
  GenericEngineeringCalculator as EngineeringCalculator,
  GenericEverydayCalculator as EverydayCalculator,
  GenericFoodCalculator as FoodCalculator,
  GenericBiologyCalculator as BiologyCalculator,
  GenericEcologyCalculator as EcologyCalculator,
  GenericSportsCalculator as SportsCalculator,
} from './index.lazy'

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
