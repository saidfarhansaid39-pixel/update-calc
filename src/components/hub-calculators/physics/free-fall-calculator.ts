import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ height: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'height', label: 'Height', type: 'number', unit: 'm', min: 0.1, step: '0.1' }],
  defaults: { height: '1' },
  presets: [
    { label: 'Standard example 1', values: { height: '1' } },
    { label: 'Standard example 2', values: { height: '10' } },
    { label: 'Standard example 3', values: { height: '100' } },
  ],
  compute: (v) => { const t = Math.sqrt(2 * v.height / 9.81); const vf = 9.81 * t; return { result: t, label: 'Time to Impact', unit: 's', steps: [{ label: 'Formula', value: 't = sqrt(2h/g)' }, { label: 'Height', value: `${v.height} m` }, { label: 'Time', value: `${t.toFixed(3)} s` }, { label: 'Impact Velocity', value: `${vf.toFixed(2)} m/s` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Free fall calculates the time to reach the ground from a given height, ignoring air resistance.',
  formula: 't = sqrt(2h/g), v = gt',
  interpretation: 'In free fall, all objects accelerate at 9.81 m/s^2 regardless of mass. Air resistance is ignored in this ideal model.'
}

export default calcDef
