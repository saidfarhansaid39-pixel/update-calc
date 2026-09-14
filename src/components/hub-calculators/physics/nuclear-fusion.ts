import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Fusible Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }],
  defaults: { massBefore: '5.0303', massAfter: '5.0112' },
  presets: [
    { label: 'p-p chain (H→He)', values: { massBefore: '4.0291', massAfter: '4.0026' } },
    { label: 'D-T fusion (reactor)', values: { massBefore: '5.0303', massAfter: '5.0112' } },
    { label: 'D-D fusion', values: { massBefore: '4.0282', massAfter: '4.0026' } },
  ],
  compute: (v) => { const c = 299792458; const E = v.mass * c * c * 0.0037; const TNT = E / 4.184e9; return { result: E, label: 'Energy Released (0.37% efficiency)', unit: 'J', steps: [{ label: 'Formula', value: 'E = Δmc²' }, { label: 'Mass defect ~0.37%', value: 'of total mass' }, { label: 'Energy', value: `${E.toExponential(4)} J` }, { label: 'TNT equivalent', value: `${TNT.toFixed(1)} kg TNT` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Nuclear fusion powers the Sun and stars. ITER aims for net energy from D-T fusion. D-T reaction releases 17.6 MeV per reaction.' },
        { label: 'Common Values', value: 'D-T fusion: 17.6 MeV. D-D: ~4.0 MeV. p-p chain: 26.73 MeV per ⁴He. Solar core: 15 million K. ITER goal: 500 MW from 50 MW input.' },
        { label: 'Precision Tip', value: 'Fusion requires overcoming Coulomb barrier (high temperature ~100 million K). Mass defect calculates energy via E = Δmc².' },
        { label: 'Related Formula', value: 'E = Δmc². Lawson criterion: nτ > 10²⁰ s/m³ for D-T. Cross-section peaks at ~100 keV for D-T. Tokamak magnetic confinement.' },
        { label: 'Unit Conversion Note', value: 'Mass in u. 1 u = 931.5 MeV/c². Temperature conversion: 1 eV = 11,605 K. 100 million K ≈ 8.6 keV.' }
      ]} },
  description: 'Nuclear fusion releases energy when light nuclei combine to form heavier ones. The mass defect (≈0.37% for D-T) converts to energy via E = mc².',
  formula: 'E = Δm·c² (D + T → ⁴He + n + 17.6 MeV)',
  interpretation: 'D-T fusion releases 17.6 MeV per reaction. Fusion powers the Sun (proton-proton chain) and hydrogen bombs. Controlled fusion (ITER) aims for sustainable energy. Fusion produces no long-lived radioactive waste.'
}

export default calcDef
