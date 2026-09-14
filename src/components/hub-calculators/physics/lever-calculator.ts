import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ effortDist: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), loadDist: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), load: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'effortDist', label: 'Effort Arm Distance', type: 'number', unit: 'm', min: 0.01, step: '0.01' }, { name: 'loadDist', label: 'Load Arm Distance', type: 'number', unit: 'm', min: 0.01, step: '0.01' }, { name: 'load', label: 'Load Force', type: 'number', unit: 'N', min: 0.1, step: '0.1' }],
  defaults: { effortDist: '1', loadDist: '1', load: '1' },
  presets: [
    { label: 'Standard example 1', values: { effortDist: '1', loadDist: '1', load: '1' } },
    { label: 'Standard example 2', values: { effortDist: '10', loadDist: '10', load: '10' } },
    { label: 'Standard example 3', values: { effortDist: '100', loadDist: '100', load: '100' } },
  ],
  compute: (v) => ({ result: v.load * v.loadDist / v.effortDist, label: 'Effort Force', unit: 'N', steps: [{ label: 'Formula', value: 'Fₑ·dₑ = Fₗ·dₗ' }, { label: 'MA', value: `${(v.effortDist / v.loadDist).toFixed(2)}×` }, { label: 'Result', value: `${(v.load * v.loadDist / v.effortDist).toFixed(2)} N` }],
      extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ] }),
  description: 'A lever amplifies force by rotating about a fulcrum. Mechanical advantage is the ratio of effort arm to load arm.',
  formula: 'F1d1 = F2d2 (torque balance)',
  interpretation: 'A longer effort arm relative to load arm gives greater mechanical advantage. Class 1 levers have the fulcrum between force and load.'
}

export default calcDef
