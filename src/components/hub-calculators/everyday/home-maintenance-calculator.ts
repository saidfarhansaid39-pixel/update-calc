import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ homeValue: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), homeAgeYears: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), squareFootage: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), recentRenovations: z.string().min(1) }),
  fields: [
    { name: 'homeValue', label: 'Home Value ($)', type: 'number', min: 50000, step: '50000' },
    { name: 'homeAgeYears', label: 'Home Age (years)', type: 'number', min: 0, step: '5' },
    { name: 'squareFootage', label: 'Square Footage', type: 'number', min: 200, step: '100' },
    { name: 'recentRenovations', label: 'Recent Renovations', type: 'select', options: [{ label: 'None', value: 'none' }, { label: 'Minor (paint, fixtures)', value: 'minor' }, { label: 'Major (kitchen, bath)', value: 'major' }, { label: 'Full Renovation', value: 'full' }] },
  ],
  compute: (v) => {
    const valueBased = v.homeValue * 0.01
    const sqftBased = v.squareFootage * 1.50
    const ageMultiplier = Math.min(3, 1 + v.homeAgeYears * 0.03)
    const renoFactors: Record<string, number> = { none: 1, minor: 0.9, major: 0.7, full: 0.5 }
    const renoFactor = renoFactors[v.recentRenovations as keyof typeof renoFactors] || 1
    const annualBudget = Math.max(valueBased, sqftBased) * ageMultiplier * renoFactor
    const monthlyBudget = annualBudget / 12
    return { result: annualBudget, label: 'Annual Maintenance Reserve', unit: '$', steps: [{ label: 'Value-Based (1%)', value: `$${valueBased.toFixed(0)}` }, { label: 'SqFt-Based ($1.50/sqft)', value: `$${sqftBased.toFixed(0)}` }, { label: 'Age Factor', value: `${ageMultiplier.toFixed(2)}×` }, { label: 'Renovation Factor', value: `${renoFactor.toFixed(1)}×` }, { label: 'Annual Budget', value: `$${annualBudget.toFixed(0)}` }, { label: 'Monthly Reserve', value: `$${monthlyBudget.toFixed(0)}` }] }
  },
  description: 'Calculate a comprehensive home maintenance budget using home value, square footage, age, and recent renovation status.',
  formula: 'Annual = Max(Value×1%, Sqft×$1.50) × Age Factor × Renovation Factor | Monthly = Annual / 12',
  interpretation: 'Set aside monthly in a dedicated savings account. Common annual costs: HVAC service $150-300, roof repair 0.5-1% of home value, painting $3000-8000. Emergency fund should cover 2-3 major repairs.'
}

export default calcDef
