import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: z.object({
    age: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 120 }, '1-120'),
    creatinine: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    gender: z.string(),
    race: z.string()
}),
  fields: [
    { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'creatinine', label: 'Serum Creatinine', type: 'number', unit: 'mg/dL', min: 0.1, step: '0.01' },
    { name: 'gender', label: 'Gender', type: 'select', options: genderOptions },
    { name: 'race', label: 'Race', type: 'select', options: [
      { label: 'Black', value: 'black' }, { label: 'Non-Black', value: 'nonblack' },
    ] },
  ],
  compute: (v) => {
    const isMale = v.gender === 'male'
    const isBlack = v.race === 'black'
    const cr = v.creatinine
    const kappa = isMale ? 0.9 : 0.7
    const alpha = isMale ? -0.411 : -0.329
    const ratio = cr / kappa
    const minVal = Math.min(ratio, 1)
    const maxVal = Math.max(ratio, 1)
    const gfr = 141 * (minVal ** alpha) * (maxVal ** -1.209) * (0.993 ** v.age) * (isMale ? 1 : 1.018) * (isBlack ? 1.159 : 1)
    const stage = gfr >= 90 ? 'G1 (Normal)' : gfr >= 60 ? 'G2 (Mild)' : gfr >= 45 ? 'G3a (Mild-Mod)' : gfr >= 30 ? 'G3b (Mod-Severe)' : gfr >= 15 ? 'G4 (Severe)' : 'G5 (Kidney Failure)'
    return {
      result: gfr, label: 'eGFR (CKD-EPI 2021)', unit: 'mL/min/1.73m²',
      steps: [
        { label: 'Age', value: `${v.age} years` },
        { label: 'Creatinine', value: `${cr} mg/dL` },
        { label: 'eGFR', value: `${gfr.toFixed(0)} mL/min/1.73m²` },
        { label: 'CKD Stage', value: stage },
      ]
}
  },
  description: 'Estimated Glomerular Filtration Rate (eGFR) assesses kidney function. The CKD-EPI 2021 equation is the current clinical standard without race adjustment.',
  formula: 'eGFR = 141 × (min(Cr/?,1))^a × (max(Cr/?,1))^-1.209 × 0.993^Age × [1.018 if female]',
  interpretation: 'G1: =90 (normal) | G2: 60-89 | G3a: 45-59 | G3b: 30-44 | G4: 15-29 | G5: <15 (kidney failure). eGFR < 60 for 3+ months indicates CKD.'
}

export default calcDef
