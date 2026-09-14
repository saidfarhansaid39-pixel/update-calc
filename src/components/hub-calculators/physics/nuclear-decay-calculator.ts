import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ initial: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), halfLife: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), time: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'initial', label: 'Initial Amount', type: 'number', unit: 'atoms', min: 1, step: '1' }, { name: 'halfLife', label: 'Half-Life', type: 'number', unit: 's', min: 0.001, step: '0.001' }, { name: 'time', label: 'Elapsed Time', type: 'number', unit: 's', min: 0, step: '1' }],
  defaults: { initial: '1', halfLife: '1', time: '1' },
  presets: [
    { label: 'Standard example 1', values: { initial: '1', halfLife: '1', time: '1' } },
    { label: 'Standard example 2', values: { initial: '10', halfLife: '10', time: '10' } },
    { label: 'Standard example 3', values: { initial: '100', halfLife: '100', time: '100' } },
  ],
  compute: (v) => { const lambda = Math.LN2 / v.halfLife; const remaining = v.initial * Math.exp(-lambda * v.time); const decayed = v.initial - remaining; return { result: remaining, label: 'Remaining', unit: 'atoms', steps: [{ label: 'Formula', value: 'N = N0·e^(-λt)' }, { label: 'Decay constant', value: `λ = ${lambda.toExponential(4)} /s` }, { label: 'Remaining', value: `${remaining.toFixed(2)}` }, { label: 'Decayed', value: `${decayed.toFixed(2)}` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Radioactive decay follows first-order kinetics. N = N0e^(-λt) where λ = ln(2)/t1/2.',
  formula: 'N = N0·e^(-λt)',
  interpretation: 'After one half-life, 50% remains. After two half-lives, 25% remains. Carbon-14 dating uses this principle with t1/2 = 5730 years.'
}

export default calcDef
