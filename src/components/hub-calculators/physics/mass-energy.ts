import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 1e-9, step: '1e-9' }],
  defaults: { mass: '1' },
  presets: [
    { label: '1 kg mass-energy equivalent', values: { mass: '1' } },
    { label: '1 g to energy', values: { mass: '0.001' } },
    { label: '1 atomic mass unit', values: { mass: '1.66e-27' } },
    { label: 'Electron mass', values: { mass: '9.11e-31' } },
  ],
  compute: (v) => { const c = 299792458; const E = v.mass * c * c; const E_TNT = E / 4.184e9; return { result: E, label: 'Rest Energy E = mc²', unit: 'J', steps: [{ label: 'Formula', value: 'E = mc²' }, { label: 'c', value: '2.9979×10^8 m/s' }, { label: 'Energy', value: `${E.toExponential(4)} J` }, { label: 'TNT equivalent', value: `${E_TNT.toExponential(4)} kg TNT` }] ,
    extras: [
        { label: 'Real-World Application', value: 'E=mc² is the most famous equation in physics. 1 kg of mass converts to 9×10¹⁶ J — enough to power a city for a year.' },
        { label: 'Common Values', value: '1 kg → 9×10¹⁶ J. 1 g → 9×10¹³ J. 1 u (1.66×10⁻²⁷ kg) → 931.5 MeV. Electron mass → 511 keV. Proton mass → 938.3 MeV.' },
        { label: 'Precision Tip', value: 'Mass-energy equivalence applies to all forms of energy. Chemical reactions release ~1 eV per atom, nuclear reactions release ~1-200 MeV per nucleus.' },
        { label: 'Related Formula', value: 'E = mc². 1 u = 931.494 MeV/c². Binding energy: B = (Zm_p + Nm_n - M_nucleus)c². Annihilation: e⁺ + e⁻ → 2γ (1.022 MeV).' },
        { label: 'Unit Conversion Note', value: 'c = 2.998×10⁸ m/s. 1 J = 1 kg·m²/s². 1 eV = 1.602×10⁻¹⁹ J. 1 kWh = 3.6×10⁶ J. Mass in kg.' }
      ]} },
  description: 'Einstein\'s mass-energy equivalence: mass can be converted to energy and vice versa. E = mc² is the most famous equation in physics.',
  formula: 'E = m·c²',
  interpretation: 'c = 2.9979×10^8 m/s. 1 kg of mass releases 9×10^16 J — equivalent to ~21 megatons of TNT. This is the principle behind nuclear energy and annihilation reactions.'
}

export default calcDef
