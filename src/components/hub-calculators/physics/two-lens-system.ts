import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ f1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), f2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), d: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'f1', label: 'Focal Length 1', type: 'number', unit: 'cm', min: 0.1, step: '0.1' }, { name: 'f2', label: 'Focal Length 2', type: 'number', unit: 'cm', min: 0.1, step: '0.1' }, { name: 'd', label: 'Separation', type: 'number', unit: 'cm', min: 0, step: '0.1' }],
  defaults: { f1: '1', f2: '1', d: '1' },
  presets: [
    { label: 'Standard example 1', values: { f1: '1', f2: '1', d: '1' } },
    { label: 'Standard example 2', values: { f1: '10', f2: '10', d: '10' } },
    { label: 'Standard example 3', values: { f1: '100', f2: '100', d: '100' } },
  ],
  compute: (v) => { const P1 = 1 / v.f1; const P2 = 1 / v.f2; const P = P1 + P2 - v.d * P1 * P2; const f = 1 / P; return { result: f, label: 'Combined Focal Length', unit: 'cm', steps: [{ label: 'Formula', value: 'P = P₁ + P₂ - d·P₁P₂' }, { label: 'P₁, P₂', value: `${P1.toFixed(2)} D, ${P2.toFixed(2)} D` }, { label: 'Combined P', value: `${P.toFixed(2)} D` }, { label: 'Focal length', value: `${f.toFixed(2)} cm` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'For two thin lenses separated by distance d, the combined power is P = P₁ + P₂ - d·P₁P₂.',
  formula: 'P = P₁ + P₂ - d·P₁P₂',
  interpretation: 'When d = 0 (lenses in contact), powers simply add. Increasing separation between converging lenses increases combined focal length. Used in zoom lenses and telescopes.'
}

export default calcDef
