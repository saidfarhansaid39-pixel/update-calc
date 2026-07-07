import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ frequency: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'frequency', label: 'Frequency', type: 'number', unit: 'Hz', min: 1, step: '1' }],
  compute: (v) => { const h = 6.626e-34; const E = h * v.frequency; const eV = E / 1.602e-19; return { result: E, label: 'Photon Energy', unit: 'J', steps: [{ label: 'Formula', value: 'E = hf = hc/λ' }, { label: 'Planck constant', value: '6.626×10⁻^3^4 J·s' }, { label: 'Energy in J', value: `${E.toExponential(4)} J` }, { label: 'Energy in eV', value: `${eV.toExponential(4)} eV` }] } },
  description: 'Photon energy is proportional to frequency, with Planck\'s constant as the proportionality constant.',
  formula: 'E = hf',
  interpretation: 'Visible light photons have energies of ~1.65-3.1 eV. Higher frequency means higher energy. X-rays and gamma rays have the highest photon energies.'
}

export default calcDef
