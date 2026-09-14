import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Fissionable Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }],
  defaults: { massBefore: '236.0526', massAfter: '235.8493' },
  presets: [
    { label: 'U-235 + n → Ba-141 + Kr-92', values: { massBefore: '236.0526', massAfter: '235.8493' } },
    { label: 'U-235 typical fission (200 MeV)', values: { massBefore: '236.0526', massAfter: '235.850' } },
    { label: 'Pu-239 fission (210 MeV)', values: { massBefore: '240.0538', massAfter: '239.850' } },
  ],
  compute: (v) => { const energyPerKg = 8.2e13; const E = v.mass * energyPerKg; const TNT = E / 4.184e9; return { result: E, label: 'Energy Released', unit: 'J', steps: [{ label: 'Formula', value: 'E = m × 8.2×10^13 J/kg (approx)' }, { label: 'Energy', value: `${E.toExponential(4)} J` }, { label: 'TNT equivalent', value: `${TNT.toFixed(1)} kg TNT` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Nuclear fission powers 10% of global electricity. One U-235 fission releases ~200 MeV. 1 kg U-235 = 24 GWh ≈ 3000 tons of coal.' },
        { label: 'Common Values', value: 'U-235 fission: ~200 MeV released. Mass defect: ~0.1 u (0.1%). Energy: E = Δm·c². 1 u = 931.5 MeV/c².' },
        { label: 'Precision Tip', value: 'Δm = mass_before - mass_after. E = Δm × c². 1 atomic mass unit (u) = 1.6605×10⁻²⁷ kg = 931.5 MeV/c².' },
        { label: 'Related Formula', value: 'E = Δmc². Binding energy per nucleon. Chain reaction: neutron multiplication factor k. Critical mass for U-235: ~52 kg.' },
        { label: 'Unit Conversion Note', value: 'Mass in u (atomic mass units). 1 u = 1.6605×10⁻²⁷ kg. c = 2.998×10⁸ m/s. 1 MeV = 1.602×10⁻¹³ J.' }
      ]} },
  description: 'Nuclear fission releases energy when a heavy nucleus splits into lighter nuclei. ~200 MeV is released per fission event (²³⁵U).',
  formula: 'E ≈ 200 MeV per fission ≈ 8.2×10^13 J/kg',
  interpretation: '1 kg of ²³⁵U releases as much energy as ~2,700 tonnes of coal. Fission produces neutron-rich daughter products. Chain reactions sustain nuclear reactors and weapons.'
}

export default calcDef
