import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ current: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), field: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), thickness: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), density: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'current', label: 'Current', type: 'number', unit: 'A', min: 0.001, step: '0.001' }, { name: 'field', label: 'Magnetic Field', type: 'number', unit: 'T', min: 0.001, step: '0.001' }, { name: 'thickness', label: 'Conductor Thickness', type: 'number', unit: 'm', min: 1e-6, step: '1e-6' }, { name: 'density', label: 'Charge Carrier Density', type: 'number', unit: 'm^-3', min: 1e28, step: '1e27' }],
  compute: (v) => { const q = 1.602e-19; const Vh = v.current * v.field / (v.density * q * v.thickness); return { result: Vh, label: 'Hall Voltage', unit: 'V', steps: [{ label: 'Formula', value: 'V_H = IB/(nqd)' }, { label: 'Elementary charge e', value: '1.602×10^-19 C' }, { label: 'Result', value: `${Vh.toExponential(4)} V` }] } },
  description: 'The Hall effect produces a transverse voltage across a conductor when a magnetic field is applied perpendicular to the current flow.',
  formula: 'V_H = I·B / (n·e·d)',
  interpretation: 'The Hall voltage sign indicates charge carrier type (positive for holes, negative for electrons). n is the carrier density (~10^28-10^29 m^-3 for metals). Used in magnetic field sensors.'
}

export default calcDef
