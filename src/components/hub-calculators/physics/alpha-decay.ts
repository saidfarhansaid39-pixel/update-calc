import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ parentZ: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 118 }, '1-118'), parentA: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 300 }, '1-300') }),
  fields: [{ name: 'parentZ', label: 'Parent Z', type: 'number', unit: '', min: 1, max: 118, step: '1' }, { name: 'parentA', label: 'Parent A', type: 'number', unit: '', min: 1, max: 300, step: '1' }],
  compute: (v) => { const mAlpha = 4.002603; const Z = v.parentZ; const A = v.parentA; const mDaughter = A - 4; const Q = (A - mDaughter - mAlpha) * 931.5; return { result: Q > 0 ? Q.toFixed(2) : 'Not possible', label: 'Decay Energy Q', unit: 'MeV', steps: [{ label: 'Formula', value: 'Q = (m_parent - m_daughter - m_α)c²' }, { label: 'Daughter', value: `Z-2 = ${Z - 2}, A-4 = ${A - 4}` }, { label: 'Energy', value: Q > 0 ? `${Q.toFixed(2)} MeV` : 'Decay not energetically possible' }] } },
  description: 'Alpha decay emits a helium-4 nucleus (2 protons, 2 neutrons). The Q-value determines if decay is energetically possible. Most alpha emitters have A > 210.',
  formula: 'Q = (m_parent - m_daughter - m_α)c²',
  interpretation: 'Alpha decay reduces atomic number by 2 and mass number by 4. Example: ²³⁸U → ²³⁴Th + α. The emitted alpha particle has kinetic energy typically 4-9 MeV. Alpha particles are heavily ionizing but short-ranged.'
}

export default calcDef
