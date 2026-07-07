import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ min: z.string().min(1).refine(v => parseFloat(v) >= -999999, 'min'), max: z.string().min(1).refine(v => parseFloat(v) <= 999999, 'max'), count: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), allowDuplicates: z.string().min(1) }),
  fields: [
    { name: 'min', label: 'Minimum Value', type: 'number', min: -999999, step: '1' },
    { name: 'max', label: 'Maximum Value', type: 'number', max: 999999, step: '1' },
    { name: 'count', label: 'How Many Numbers', type: 'number', min: 1, max: 100, step: '1' },
    { name: 'allowDuplicates', label: 'Allow Duplicates', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
  ],
  compute: (v) => {
    const lo = Math.ceil(v.min)
    const hi = Math.floor(v.max)
    const results: number[] = []
    const available = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
    const desired = Math.min(v.count, v.allowDuplicates === 'no' ? available.length : v.count)
    for (let i = 0; i < desired; i++) {
      if (v.allowDuplicates === 'no' && available.length === 0) break
      const idx = Math.floor(Math.random() * (v.allowDuplicates === 'no' ? available.length : (hi - lo + 1)))
      const val = v.allowDuplicates === 'no' ? available.splice(idx, 1)[0] : lo + Math.floor(Math.random() * (hi - lo + 1))
      results.push(val)
    }
    return { result: results[0], label: 'Random Number(s)', unit: '', steps: [{ label: 'Range', value: `${lo} to ${hi}` }, { label: 'Generated', value: results.join(', ') }] }
  },
  description: 'Generate one or more random numbers within a specified range with optional duplicate control.',
  formula: 'Math.random() × (max - min + 1) + min | Uses Fisher-Yates shuffle when no duplicates',
  interpretation: 'True randomness is difficult to achieve with software (pseudo-random). For cryptographic use, use dedicated secure random generators. For games and everyday use, this provides adequate randomness.'
}

export default calcDef
