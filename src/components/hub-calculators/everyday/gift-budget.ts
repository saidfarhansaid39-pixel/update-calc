import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ recipients: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), perPersonBudget: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), occasions: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'recipients', label: 'Number of Recipients', type: 'number', min: 1, step: '1' },
    { name: 'perPersonBudget', label: 'Budget per Person ($)', type: 'number', min: 1, step: '5' },
    { name: 'occasions', label: 'Occasions per Year', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const perOccasion = v.recipients * v.perPersonBudget
    const annual = perOccasion * v.occasions
    return { result: annual, label: 'Annual Gift Budget', unit: '$', steps: [{ label: 'Per Occasion', value: `$${perOccasion.toFixed(2)}` }, { label: 'Annual Total', value: `$${annual.toFixed(2)}` }] }
  },
  description: 'Plan your annual gift budget based on number of recipients, budget per person, and occasions per year. Track birthdays, holidays, and special events.',
  formula: 'Annual Budget = Recipients × Budget/Person × Occasions/Year',
  interpretation: 'Annual gift spending averages $500-1000 per household. Adjust per-person budgets based on relationship type (family, friends, coworkers).'
}

export default calcDef
