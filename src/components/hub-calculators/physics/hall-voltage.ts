import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ current: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), field: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), thickness: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), density: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'current', label: 'Current', type: 'number', unit: 'A', min: 0.001, step: '0.001' }, { name: 'field', label: 'Magnetic Field', type: 'number', unit: 'T', min: 0.001, step: '0.001' }, { name: 'thickness', label: 'Conductor Thickness', type: 'number', unit: 'm', min: 1e-6, step: '1e-6' }, { name: 'density', label: 'Charge Carrier Density', type: 'number', unit: 'm^-3', min: 1e28, step: '1e27' }],
  defaults: { current: '1', field: '1', thickness: '1', density: '1' },
  presets: [
    { label: 'Standard example 1', values: { current: '1', field: '1', thickness: '1', density: '1' } },
    { label: 'Standard example 2', values: { current: '10', field: '10', thickness: '10', density: '10' } },
    { label: 'Standard example 3', values: { current: '100', field: '100', thickness: '100', density: '100' } },
  ],
  compute: (v) => { const q = 1.602e-19; const Vh = v.current * v.field / (v.density * q * v.thickness); return { result: Vh, label: 'Hall Voltage', unit: 'V', steps: [{ label: 'Formula', value: 'V_H = IB/(nqd)' }, { label: 'Elementary charge e', value: '1.602×10^-19 C' }, { label: 'Result', value: `${Vh.toExponential(4)} V` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'The Hall effect produces a transverse voltage across a conductor when a magnetic field is applied perpendicular to the current flow.',
  formula: 'V_H = I·B / (n·e·d)',
  interpretation: 'The Hall voltage sign indicates charge carrier type (positive for holes, negative for electrons). n is the carrier density (~10^28-10^29 m^-3 for metals). Used in magnetic field sensors.'
}

export default calcDef
