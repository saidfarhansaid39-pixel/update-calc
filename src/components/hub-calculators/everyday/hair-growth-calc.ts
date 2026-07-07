import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ months: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), growthPerMonth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'months', label: 'Number of Months', type: 'number', min: 1, step: '1' },
    { name: 'growthPerMonth', label: 'Growth Rate (in/month)', type: 'number', min: 0.1, step: '0.1' },
  ],
  compute: (v) => { const m = parseFloat(v.months)||0; const g = parseFloat(v.growthPerMonth)||0; const totalInches = m * g; const totalCm = totalInches * 2.54; return { result: totalInches, label: 'Total Hair Growth', unit: 'in', steps: [{ label: 'Months Growing', value: `${m}` }, { label: 'Rate per Month', value: `${g.toFixed(1)} in` }, { label: 'Total Growth', value: `${totalInches.toFixed(2)} in (${totalCm.toFixed(1)} cm)` }] } },
  description: 'Estimate total hair growth over time based on average growth rate. Track hair growth goals and compare to average rates.',
  formula: 'Total Growth = Months × Growth Rate per Month',
  interpretation: 'Average hair growth: 0.5 in/month (6 in/year). Scalp hair grows faster in summer. Biotin, protein, and regular trims promote healthy growth. Max length varies by genetics.'
}

export default calcDef
