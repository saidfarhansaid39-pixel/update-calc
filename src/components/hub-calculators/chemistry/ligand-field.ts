import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    delta: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    pairingEnergy: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    dElectrons: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n >= 1 && n <= 10 }, '1-10')
}),
  fields: [
    { name: 'delta', label: 'Crystal Field Splitting Δₒ', type: 'number', unit: 'cm⁻¹', min: 1000, step: '100' },
    { name: 'pairingEnergy', label: 'Pairing Energy (P)', type: 'number', unit: 'cm⁻¹', min: 1000, step: '100' },
    { name: 'dElectrons', label: 'Number of d Electrons', type: 'number', unit: '', min: 1, max: 10, step: '1' },
  ],
  compute: (v) => {
    const e = parseInt(v.dElectrons)
    const P = v.pairingEnergy
    const Δ = v.delta
    const hsStable = Δ < P
    const lowSpin = !hsStable && e >= 4 && e <= 7
    let unpaired = 0
    if (e <= 3) unpaired = e
    else if (e === 4) unpaired = lowSpin ? 2 : 4
    else if (e === 5) unpaired = lowSpin ? 1 : 5
    else if (e === 6) unpaired = lowSpin ? 0 : 4
    else if (e === 7) unpaired = lowSpin ? 1 : 3
    else unpaired = e - 4
    const magnetism = unpaired === 0 ? 'Diamagnetic' : 'Paramagnetic'
    const μ = Math.sqrt(unpaired * (unpaired + 2))
    return {
      result: μ, label: 'Magnetic Moment (spin-only)', unit: 'BM',
      steps: [
        { label: 'd electrons', value: `${e}` },
        { label: 'Δₒ vs P', value: Δ > P ? 'Δₒ > P (low spin favored)' : 'Δₒ < P (high spin favored)' },
        { label: 'Spin state', value: lowSpin ? 'Low spin' : 'High spin' },
        { label: 'Unpaired electrons', value: `${unpaired}` },
        { label: 'Magnetism', value: magnetism },
        { label: 'μ = √(n(n+2))', value: `${μ.toFixed(2)} BM` },
      ]
}
  },
  description: 'Ligand field theory extends crystal field theory by considering covalent bonding between metal and ligands. The spin state (high/low) depends on Δ versus pairing energy P.',
  formula: 'μ = √(n(n+2)) BM | High spin when Δ < P, Low spin when Δ > P (for d⁴-d⁷)',
  interpretation: 'Strong field ligands (CN⁻, CO) cause large Δ → low spin. Weak field ligands (I⁻, Br⁻) cause small Δ → high spin. Low-spin Fe²⁺ (d⁶) in hemoglobin is diamagnetic. High-spin Fe²⁺ is paramagnetic.'
}

export default calcDef
