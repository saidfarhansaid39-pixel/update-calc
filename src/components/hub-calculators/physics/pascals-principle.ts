import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ force1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), area1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), area2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'force1', label: 'Input Force F₁', type: 'number', unit: 'N', min: 0.1, step: '0.1' }, { name: 'area1', label: 'Input Piston Area A₁', type: 'number', unit: 'm²', min: 0.001, step: '0.001' }, { name: 'area2', label: 'Output Piston Area A₂', type: 'number', unit: 'm²', min: 0.001, step: '0.001' }],
  defaults: { force1: '1', area1: '1', area2: '1' },
  presets: [
    { label: 'Standard example 1', values: { force1: '1', area1: '1', area2: '1' } },
    { label: 'Standard example 2', values: { force1: '10', area1: '10', area2: '10' } },
    { label: 'Standard example 3', values: { force1: '100', area1: '100', area2: '100' } },
  ],
  compute: (v) => { const F2 = v.force1 * v.area2 / v.area1; const MA = v.area2 / v.area1; return { result: F2, label: 'Output Force F₂', unit: 'N', steps: [{ label: 'Formula', value: 'F₂ = F₁·A₂/A₁' }, { label: 'Mechanical advantage', value: `${MA.toFixed(2)}×` }, { label: 'Output force', value: `${F2.toFixed(2)} N` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Pascal\'s Principle: pressure applied to an enclosed fluid is transmitted undiminished to every part of the fluid. F₁/A₁ = F₂/A₂.',
  formula: 'F₂ = F₁·A₂/A₁',
  interpretation: 'Hydraulic systems multiply force. A small force on a small piston produces a large force on a large piston. Used in car brakes, hydraulic lifts, and construction equipment. The work done is the same (conservation of energy).'
}

export default calcDef
