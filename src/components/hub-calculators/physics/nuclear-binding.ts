import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ z: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 118 }, '1-118'), a: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 300 }, '1-300'), mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'z', label: 'Atomic Number Z', type: 'number', unit: '', min: 1, max: 118, step: '1' }, { name: 'a', label: 'Mass Number A', type: 'number', unit: '', min: 1, max: 300, step: '1' }, { name: 'mass', label: 'Nuclear Mass', type: 'number', unit: 'u', min: 1, step: '0.001' }],
  defaults: { z: '1', a: '1', mass: '1' },
  presets: [
    { label: 'Standard example 1', values: { z: '1', a: '1', mass: '1' } },
    { label: 'Standard example 2', values: { z: '10', a: '10', mass: '10' } },
    { label: 'Standard example 3', values: { z: '100', a: '100', mass: '100' } },
  ],
  compute: (v) => { const u = 1.6605e-27; const c = 299792458; const mp = 1.007276 * u; const mn = 1.008665 * u; const mN = v.mass * u; const be = (v.z * mp + (v.a - v.z) * mn - mN) * c * c; const be_MeV = be / (1.602e-13); const bePerNucleon = be_MeV / v.a; return { result: be_MeV, label: 'Binding Energy', unit: 'MeV', steps: [{ label: 'Formula', value: 'BE = (Zm_p+Nm_n-m_N)c²' }, { label: 'Result', value: `${be_MeV.toFixed(2)} MeV` }, { label: 'BE per nucleon', value: `${bePerNucleon.toFixed(2)} MeV/nucleon` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Nuclear binding energy is the energy released when nucleons bind together to form a nucleus. It represents the mass defect according to E = mc².',
  formula: 'BE = (Z·m_p + N·m_n - m_nucleus)c²',
  interpretation: 'Binding energy per nucleon peaks at A ≈ 56 (iron-56) at ~8.79 MeV/nucleon. This peak explains why fusion of light elements and fission of heavy elements both release energy.'
}

export default calcDef
