import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    ionicStrength: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    charge: z.string().min(1, 'Required').refine(v => { const z = parseInt(v); return z >= 1 && z <= 4 }, '1-4')
}),
  fields: [
    { name: 'ionicStrength', label: 'Ionic Strength (I)', type: 'number', unit: 'M', min: 0, step: '0.01' },
    { name: 'charge', label: 'Ion Charge (z)', type: 'number', unit: '', min: 1, max: 4, step: '1' },
  ],
  compute: (v) => {
    const I = v.ionicStrength
    const z = v.charge
    let logγ, γ
    if (I === 0) { logγ = 0; γ = 1 }
    else {
      logγ = -0.509 * Math.pow(z, 2) * (Math.sqrt(I) / (1 + Math.sqrt(I)) - 0.2 * I)
      γ = Math.pow(10, logγ)
    }
    return {
      result: γ, label: 'Activity Coefficient (γ)', unit: '',
      steps: [
        { label: 'Ionic strength (I)', value: `${I} M` },
        { label: 'Ion charge (z)', value: `${z}` },
        { label: 'log γ₊', value: `${logγ.toFixed(4)}` },
        { label: 'γ = 10^(log γ)', value: `${γ.toFixed(4)}` },
        { label: 'Effective concentration: a = γ·c', value: `a = ${γ.toFixed(4)} × c` },
      ]
}
  },
  description: 'The activity coefficient (γ) relates the actual concentration of an ion to its thermodynamic activity: a = γ × c. The extended Debye-Hückel equation estimates γ for ionic strengths up to I ≈ 0.5 M.',
  formula: 'log γ = -0.509 z² (√I / (1 + √I) - 0.2I) | a = γ × c | For I < 0.01 M: γ ≈ 1 (ideal)',
  interpretation: 'γ < 1 indicates non-ideal behavior due to ion-ion interactions. At I = 0.1 M, for z = 1: γ ≈ 0.78, for z = 2: γ ≈ 0.36, for z = 3: γ ≈ 0.10. γ approaches 1 at infinite dilution.'
}

export default calcDef
