import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Fissionable Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }],
  compute: (v) => { const energyPerKg = 8.2e13; const E = v.mass * energyPerKg; const TNT = E / 4.184e9; return { result: E, label: 'Energy Released', unit: 'J', steps: [{ label: 'Formula', value: 'E = m × 8.2×10^13 J/kg (approx)' }, { label: 'Energy', value: `${E.toExponential(4)} J` }, { label: 'TNT equivalent', value: `${TNT.toFixed(1)} kg TNT` }] } },
  description: 'Nuclear fission releases energy when a heavy nucleus splits into lighter nuclei. ~200 MeV is released per fission event (²³⁵U).',
  formula: 'E ≈ 200 MeV per fission ≈ 8.2×10^13 J/kg',
  interpretation: '1 kg of ²³⁵U releases as much energy as ~2,700 tonnes of coal. Fission produces neutron-rich daughter products. Chain reactions sustain nuclear reactors and weapons.'
}

export default calcDef
