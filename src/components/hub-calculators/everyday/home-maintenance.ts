import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ homeValueMaintenance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rulePercent: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), homeAge: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'homeValueMaintenance', label: 'Home Value ($)', type: 'number', min: 50000, step: '50000' },
    { name: 'rulePercent', label: 'Rule (% of Home Value)', type: 'number', min: 0.5, max: 5, step: '0.5' },
    { name: 'homeAge', label: 'Home Age (years)', type: 'number', min: 0, step: '5' },
  ],
  compute: (v) => {
    const annualBudget = v.homeValueMaintenance * (v.rulePercent / 100)
    const monthlyBudget = annualBudget / 12
    const ageFactor = v.homeAge < 5 ? 0.7 : v.homeAge < 15 ? 1 : v.homeAge < 30 ? 1.5 : 2
    const adjustedAnnual = annualBudget * ageFactor
    const adjustedMonthly = adjustedAnnual / 12
    return { result: adjustedAnnual, label: 'Annual Maintenance Budget', unit: '$', steps: [{ label: 'Home Value', value: `$${v.homeValueMaintenance.toFixed(0)}` }, { label: 'Rule', value: `${v.rulePercent}% = $${annualBudget.toFixed(0)}/yr` }, { label: 'Age Factor', value: `${ageFactor.toFixed(1)}×` }, { label: 'Adjusted Annual', value: `$${adjustedAnnual.toFixed(0)}` }, { label: 'Monthly Set Aside', value: `$${adjustedMonthly.toFixed(0)}` }] }
  },
  description: 'Calculate your annual home maintenance budget using the percentage rule, adjusted for home age. Older homes require more maintenance.',
  formula: 'Annual Budget = Home Value × Rule% × Age Factor | Monthly = Annual / 12',
  interpretation: 'The 1% rule: set aside 1% of home value annually for maintenance. New homes: 0.5-1%. Homes 15+ years: 1.5-2%. Major systems (roof, HVAC, water heater) have 15-30 year lifespans.'
}

export default calcDef
