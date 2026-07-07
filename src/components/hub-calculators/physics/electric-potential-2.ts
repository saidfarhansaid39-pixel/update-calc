import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ Q: z.string().min(1).refine(v => parseFloat(v) !== 0, '≠0'), r: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'Q', label: 'Point Charge Q', type: 'number', unit: 'C', min: -1e-6, step: '1e-9' }, { name: 'r', label: 'Distance from Charge r', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => { const k = 8.987551787e9; const V = k * v.Q / v.r; const E = k * Math.abs(v.Q) / (v.r * v.r); return { result: V, label: 'Electric Potential V', unit: 'V', steps: [{ label: 'Formula', value: 'V = kQ/r' }, { label: 'Field strength', value: `${E.toExponential(4)} N/C` }, { label: 'Potential', value: `${V.toExponential(4)} V` }] } },
  description: 'Electric potential (voltage) at a distance r from a point charge Q. V = kQ/r where k = 8.99×10⁹ N·m²/C².',
  formula: 'V = kQ/r',
  interpretation: 'Positive charge creates positive potential; negative charge creates negative potential. Potential difference (voltage) drives current. A 1 C charge at 1 m gives V = 8.99×10⁹ V.'
}

export default calcDef
