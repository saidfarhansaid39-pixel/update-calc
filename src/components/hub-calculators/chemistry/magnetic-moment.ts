import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    unpaired: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n >= 0 && n <= 10 }, '0-10')
}),
  fields: [
    { name: 'unpaired', label: 'Number of Unpaired Electrons', type: 'number', unit: '', min: 0, max: 10, step: '1' },
  ],
  compute: (v) => {
    const n = v.unpaired
    const μ = Math.sqrt(n * (n + 2))
    const magnetism = n === 0 ? 'Diamagnetic' : 'Paramagnetic'
    return {
      result: μ, label: 'Spin-Only Magnetic Moment μ', unit: 'BM',
      steps: [
        { label: 'Unpaired electrons (n)', value: `${n}` },
        { label: 'μ = √(n(n+2))', value: `${μ.toFixed(3)} BM` },
        { label: 'Magnetic behavior', value: magnetism },
        { label: 'Formula', value: n === 0 ? 'Diamagnetic (no unpaired e⁻)' : `n(n+2) = ${n}×${n + 2} = ${n * (n + 2)}` },
      ]
}
  },
  description: 'The magnetic moment (μ) of a transition metal complex is determined by the number of unpaired electrons: μ = √(n(n+2)) Bohr magnetons. This is the spin-only formula.',
  formula: 'μ = √(n(n+2)) BM (Bohr magnetons)',
  interpretation: 'n = 0: diamagnetic (repelled by magnet). n > 0: paramagnetic (attracted). Fe³⁺ (d⁵, high spin) has n = 5, μ = 5.92 BM. Cu²⁺ (d⁹) has n = 1, μ = 1.73 BM.'
}

export default calcDef
