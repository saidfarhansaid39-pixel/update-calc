import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ initial: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), halfLife: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), time: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'initial', label: 'Initial Amount N₀', type: 'number', unit: 'atoms', min: 1, step: '1' }, { name: 'halfLife', label: 'Half-Life t½', type: 'number', unit: 's', min: 0.001, step: '0.001' }, { name: 'time', label: 'Elapsed Time', type: 'number', unit: 's', min: 0, step: '1' }],
  defaults: { initial: '1', halfLife: '1', time: '1' },
  presets: [
    { label: 'Standard example 1', values: { initial: '1', halfLife: '1', time: '1' } },
    { label: 'Standard example 2', values: { initial: '10', halfLife: '10', time: '10' } },
    { label: 'Standard example 3', values: { initial: '100', halfLife: '100', time: '100' } },
  ],
  compute: (v) => { const lambda = Math.LN2 / v.halfLife; const remaining = v.initial * Math.exp(-lambda * v.time); const activity = lambda * remaining; return { result: remaining, label: 'Remaining Atoms', unit: '', steps: [{ label: 'Formula', value: 'N = N₀e^{-λt}' }, { label: 'Decay constant λ', value: `${lambda.toExponential(4)} s^-1` }, { label: 'Remaining', value: `${remaining.toFixed(2)}` }, { label: 'Activity A = λN', value: `${activity.toExponential(4)} Bq` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Radioactive decay follows first-order kinetics. The decay rate is proportional to the number of undecayed atoms.',
  formula: 'N = N₀·e^{-λt}, λ = ln(2)/t½',
  interpretation: 'After one half-life, 50% remains. After n half-lives, fraction = (½)^n remains. Activity is measured in becquerels (1 Bq = 1 decay/s). Used in radiometric dating and medical imaging.'
}

export default calcDef
