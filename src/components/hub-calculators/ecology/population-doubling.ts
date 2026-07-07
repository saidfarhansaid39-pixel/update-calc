import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ growthRate: z.string().min(1).refine(v => parseFloat(v) !== 0, 'Non-zero'), time: z.string().optional() }),
  fields: [
    { name: 'growthRate', label: 'Growth rate (r, % per year)', type: 'number', step: '0.1' },
    { name: 'time', label: 'Time (years, for projection)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const r = parseFloat(v.growthRate)/100; const t = parseInt(v.time)||10; const doublingTime = r>0?Math.LN2/r:Infinity; const factor = Math.exp(r*t); return { result: doublingTime===Infinity?-1:doublingTime, label: 'Population Doubling Time', unit: 'years', steps: [{ label: 'Growth rate r', value: `${v.growthRate}%/yr` }, { label: 't_d = ln(2)/r', value: doublingTime===Infinity?'N/A (declining)':`${doublingTime.toFixed(1)} yr` }, { label: 'After {t} years', value: factor>1?`×${factor.toFixed(2)} growth`:`×${factor.toFixed(2)} decline` }, { label: 'Rule of 70', value: `${(70/parseFloat(v.growthRate)).toFixed(1)} yr (approx)` }] } },
  description: 'Doubling time is the period needed for a population to double in size at a constant growth rate. It follows from exponential growth: t_d = ln(2)/r.',
  formula: 't_d = ln(2)/r | Rule of 70: t_d ≈ 70/growth_rate_%',
  interpretation: 'A 1%/yr growth rate doubles population in ~70 years. A 2%/yr rate doubles in ~35 years. Negative rates mean population decline, not doubling.'
}

export default calcDef
