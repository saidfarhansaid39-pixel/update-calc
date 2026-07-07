import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    pKa: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= -2 && n <= 16 }, '-2 to 16'),
    initVol: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    initConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    titrantConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'pKa', label: 'pKa of Weak Acid', type: 'number', unit: '', min: -2, max: 16, step: '0.1' },
    { name: 'initVol', label: 'Initial Volume of Acid', type: 'number', unit: 'mL', min: 0.1, step: '0.1' },
    { name: 'initConc', label: 'Initial Concentration of Acid', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'titrantConc', label: 'Concentration of Base Titrant', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const molAcid = v.initConc * v.initVol / 1000
    const veq = molAcid / v.titrantConc * 1000
    const halfEq = veq / 2
    const phHalf = v.pKa
    const phEq = 7 + (v.pKa - 7) / 2
    return {
      result: veq, label: 'Equivalence Point Volume', unit: 'mL',
      steps: [
        { label: 'Moles of acid', value: `${molAcid.toFixed(6)} mol` },
        { label: 'Equivalence volume', value: `${veq.toFixed(2)} mL` },
        { label: 'pH at half-equivalence', value: phHalf.toFixed(2) },
        { label: 'pH at equivalence', value: phEq.toFixed(2) },
      ]
}
  },
  description: 'Titration curves plot pH against volume of titrant. For weak acid-strong base titrations, the half-equivalence point gives pH = pKa, and the equivalence point is above 7.',
  formula: 'V_eq = (M_acid × V_acid) / M_base | pH_½ = pKa | pH_eq = 7 + ½(pKa − 7)',
  interpretation: 'The steepest part of the curve is near the equivalence point. Indicators are chosen so their color change occurs within the steep region. For strong acid-strong base, pH_eq = 7.00.'
}

export default calcDef
