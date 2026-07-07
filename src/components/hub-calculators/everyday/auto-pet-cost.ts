import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ apcPetType: z.string().min(1), apcPetSize: z.string().min(1), apcFoodQuality: z.string().min(1), apcVetVisitsYearly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), apcGroomingYearly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), apcPetSittingMonthly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), apcPetInsurance: z.string().min(1) }),
  fields: [
    { name: 'apcPetType', label: 'Pet Type', type: 'select', options: [{ label: 'Dog', value: 'dog' }, { label: 'Cat', value: 'cat' }, { label: 'Small Mammal', value: 'small' }, { label: 'Bird', value: 'bird' }, { label: 'Fish', value: 'fish' }] },
    { name: 'apcPetSize', label: 'Pet Size', type: 'select', options: [{ label: 'Small (0-20 lbs)', value: 'small' }, { label: 'Medium (21-50 lbs)', value: 'medium' }, { label: 'Large (51-90 lbs)', value: 'large' }, { label: 'Extra Large (91+ lbs)', value: 'xl' }] },
    { name: 'apcFoodQuality', label: 'Food Quality', type: 'select', options: [{ label: 'Economy', value: 'economy' }, { label: 'Premium', value: 'premium' }, { label: 'Prescription/Specialty', value: 'specialty' }] },
    { name: 'apcVetVisitsYearly', label: 'Vet Visits per Year', type: 'number', min: 0, step: '1' },
    { name: 'apcGroomingYearly', label: 'Grooming per Year', type: 'number', min: 0, step: '2' },
    { name: 'apcPetSittingMonthly', label: 'Pet Sitting/Walking ($/mo)', type: 'number', min: 0, step: '25' },
    { name: 'apcPetInsurance', label: 'Pet Insurance', type: 'select', options: [{ label: 'None', value: 'none' }, { label: 'Accident Only ($15/mo)', value: 'accident' }, { label: 'Comprehensive ($40/mo)', value: 'comprehensive' }] },
  ],
  compute: (v) => {
    const foodCosts: Record<string, Record<string, number>> = { dog: { small: 25, medium: 40, large: 60, xl: 80 }, cat: { small: 20, medium: 25, large: 30, xl: 35 }, small: { small: 10, medium: 15, large: 20, xl: 25 }, bird: { small: 10, medium: 15, large: 20, xl: 25 }, fish: { small: 5, medium: 10, large: 15, xl: 20 } }
    const qualityFactors: Record<string, number> = { economy: 1, premium: 1.5, specialty: 2.5 }
    const sizeMap: Record<string, string> = { small: 'small', medium: 'medium', large: 'large', xl: 'xl' }
    const baseFood = (foodCosts[v.apcPetType] || foodCosts.dog)[sizeMap[v.apcPetSize] || 'medium'] || 40
    const foodFactor = qualityFactors[v.apcFoodQuality] || 1
    const monthlyFood = baseFood * foodFactor
    const monthlyVet = (v.apcVetVisitsYearly * 60) / 12
    const monthlyGrooming = (v.apcGroomingYearly * 50) / 12
    const insuranceCosts: Record<string, number> = { none: 0, accident: 15, comprehensive: 40 }
    const monthlyInsurance = insuranceCosts[v.apcPetInsurance] || 0
    const monthlyTotal = monthlyFood + monthlyVet + monthlyGrooming + v.apcPetSittingMonthly + monthlyInsurance
    const annualTotal = monthlyTotal * 12
    const firstYear = monthlyTotal * 12 + 500
    return { result: monthlyTotal, label: 'Monthly Pet Cost', unit: '$', steps: [{ label: 'Food', value: `$${monthlyFood.toFixed(2)}` }, { label: 'Vet (annualized)', value: `$${monthlyVet.toFixed(2)}` }, { label: 'Grooming', value: `$${monthlyGrooming.toFixed(2)}` }, { label: 'Sitting/Walking', value: `$${v.apcPetSittingMonthly.toFixed(2)}` }, { label: 'Insurance', value: `$${monthlyInsurance.toFixed(2)}` }, { label: 'Monthly Total', value: `$${monthlyTotal.toFixed(2)}` }, { label: 'Annual Total', value: `$${annualTotal.toFixed(2)}` }] }
  },
  description: 'Auto pet cost calculator that estimates monthly and annual pet expenses including food, vet care, grooming, pet sitting, and insurance.',
  formula: 'Monthly = Food + Vet/12 + Grooming/12 + Sitting + Insurance | First Year = Monthly × 12 + $500 (setup)',
  interpretation: 'First-year pet cost: $1,000-3,000 (adoption, supplies, initial vet). Annual: dogs $500-2,000, cats $300-1,500. Pet insurance ($15-50/mo) saves 70-90% on major vet bills. Budget $500-1000/year for emergency vet costs.'
}

export default calcDef
