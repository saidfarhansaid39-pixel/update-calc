import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ field: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'field', label: 'External Magnetic Field', type: 'number', unit: 'T', min: 0.001, step: '0.001' }],
  compute: (v) => { const muB = 9.274e-24; const e = 1.602e-19; const dE = muB * v.field; const dE_eV = dE / e; return { result: dE_eV, label: 'Zeeman Splitting ΔE', unit: 'eV', steps: [{ label: 'Formula', value: 'ΔE = μ_B·B' }, { label: 'Bohr magneton μ_B', value: '9.274×10^-24 J/T' }, { label: 'Splitting', value: `${dE_eV.toExponential(4)} eV` }, { label: 'Splitting per tesla', value: '5.79×10^-5 eV/T' }] } },
  description: 'The Zeeman effect: spectral lines split in the presence of an external magnetic field due to the interaction between the magnetic moment and the field.',
  formula: 'ΔE = μ_B·B·m_l',
  interpretation: 'μ_B = 9.274×10^-24 J/T = 5.79×10^-5 eV/T. The splitting magnitude is proportional to B. The normal Zeeman effect splits a line into 3 components. Used in magnetometry and astronomy.'
}

export default calcDef
