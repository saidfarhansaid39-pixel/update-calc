import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 120 }, '1-120') }),
  fields: [ { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, max: 120, step: '1' } ],
  compute: (v) => {
    const fox = 220 - v.age; const tanaka = 208 - 0.7 * v.age
    return { result: fox, label: 'Max HR (Fox)', unit: 'bpm', steps: [
      { label: 'Fox (220-age)', value: fox+' bpm' }, { label: 'Tanaka (208-0.7×age)', value: tanaka.toFixed(0)+' bpm' },
      { label: 'Range', value: Math.min(fox,tanaka).toFixed(0)+'-'+Math.max(fox,tanaka).toFixed(0)+' bpm' },
    ]}
  }, description: 'Estimate max heart rate via Fox (220-age) and Tanaka (208-0.7×age) formulas.', formula: 'HRmax = 220 - age; HRmax = 208 - 0.7 × age', interpretation: 'Max HR declines ~1 bpm/year. Individual variation is ±10-15 bpm.'
}

export default calcDef
