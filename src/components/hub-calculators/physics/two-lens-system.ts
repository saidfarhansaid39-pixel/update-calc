import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ f1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), f2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), d: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'f1', label: 'Focal Length 1', type: 'number', unit: 'cm', min: 0.1, step: '0.1' }, { name: 'f2', label: 'Focal Length 2', type: 'number', unit: 'cm', min: 0.1, step: '0.1' }, { name: 'd', label: 'Separation', type: 'number', unit: 'cm', min: 0, step: '0.1' }],
  compute: (v) => { const P1 = 1 / v.f1; const P2 = 1 / v.f2; const P = P1 + P2 - v.d * P1 * P2; const f = 1 / P; return { result: f, label: 'Combined Focal Length', unit: 'cm', steps: [{ label: 'Formula', value: 'P = P₁ + P₂ - d·P₁P₂' }, { label: 'P₁, P₂', value: `${P1.toFixed(2)} D, ${P2.toFixed(2)} D` }, { label: 'Combined P', value: `${P.toFixed(2)} D` }, { label: 'Focal length', value: `${f.toFixed(2)} cm` }] } },
  description: 'For two thin lenses separated by distance d, the combined power is P = P₁ + P₂ - d·P₁P₂.',
  formula: 'P = P₁ + P₂ - d·P₁P₂',
  interpretation: 'When d = 0 (lenses in contact), powers simply add. Increasing separation between converging lenses increases combined focal length. Used in zoom lenses and telescopes.'
}

export default calcDef
