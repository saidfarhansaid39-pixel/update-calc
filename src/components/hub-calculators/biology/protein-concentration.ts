import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    a280: z.string().refine(v => parseFloat(v) >= 0, '>=0'),
    extinctionCoeff3: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'a280', label: 'A280 Reading', type: 'number', min: 0, step: '0.001' },
    { name: 'extinctionCoeff3', label: 'Extinction Coefficient (e, M?¹·cm?¹)', type: 'number', min: 1, step: '100' },
  ],
  compute: (v) => {
    const concM = v.a280 / v.extinctionCoeff3
    const concMgMl = concM * 1000
    return {
      result: concMgMl, label: 'Protein Concentration', unit: 'mg/mL',
      steps: [
        { label: 'A280 reading', value: `${v.a280.toFixed(3)}` },
        { label: 'Extinction coefficient e', value: `${v.extinctionCoeff3} M?¹·cm?¹` },
        { label: 'c = A / (e × l)', value: `${(concM * 1000).toFixed(4)} mg/mL (assuming 1 cm path)'` },
        { label: 'c (µM)', value: `${(concM * 1e6).toFixed(2)} µM` },
      ]
}
  },
  description: 'Protein concentration is determined by UV absorbance at 280 nm using the Beer-Lambert law. Aromatic amino acids (Trp, Tyr) primarily absorb at 280 nm.',
  formula: 'A = e × c × l | c = A / (e × l) | l = path length (typically 1 cm) | e = molar extinction coefficient',
  interpretation: 'For an unknown protein, use e ˜ 1 mg/mL?¹·cm?¹ (assuming 1 g/L gives A280 ˜ 1). For known proteins, use specific e from sequence or literature. A260/A280 ratio > 0.6 may indicate nucleic acid contamination.'
}

export default calcDef
