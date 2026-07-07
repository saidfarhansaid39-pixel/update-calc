import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ packsPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), costPerPack: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), yearsSmoked: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), quitYears: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'packsPerDay', label: 'Packs per Day', type: 'number', min: 0.25, step: '0.25' },
    { name: 'costPerPack', label: 'Cost per Pack ($)', type: 'number', min: 5, step: '2' },
    { name: 'yearsSmoked', label: 'Years Smoked', type: 'number', min: 1, step: '1' },
    { name: 'quitYears', label: 'Years Since Quitting', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const annualCost = v.packsPerDay * v.costPerPack * 365
    const totalSpent = annualCost * v.yearsSmoked
    const moneySaved = annualCost * v.quitYears
    const cigarettes = v.packsPerDay * 20
    const totalCigarettes = cigarettes * 365 * v.yearsSmoked
    return { result: totalSpent, label: 'Total Spent on Cigarettes', unit: '$', steps: [{ label: 'Annual Cost', value: `$${annualCost.toFixed(2)}/yr` }, { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}` }, { label: 'Total Cigarettes', value: `${totalCigarettes.toLocaleString()} smokes` }, { label: 'Money Saved by Quitting', value: `$${moneySaved.toFixed(2)} saved since quitting` }] }
  },
  description: 'Calculate how much you have spent on cigarettes over your smoking history and how much you save by quitting.',
  formula: 'Annual = Packs/Day × Cost/Pack × 365 | Total = Annual × Years | Cigarettes = Packs × 20 × 365 × Years',
  interpretation: 'A pack-a-day smoker at $10/pack spends $3,650/yr. Over 20 years: $73,000. Quitting saves not just money — adding 10 years to life expectancy. Cigarette prices vary by state ($6-16/pack). Consider investing the savings.'
}

export default calcDef
