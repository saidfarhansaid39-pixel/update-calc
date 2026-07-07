import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    massCrude: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    massPure: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    solVol: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'massCrude', label: 'Mass of Crude Solid', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'massPure', label: 'Mass of Recovered Pure Solid', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'solVol', label: 'Volume of Solvent Used', type: 'number', unit: 'mL', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const recovery = (v.massPure / v.massCrude) * 100
    const loss = v.massCrude - v.massPure
    const conc = v.massPure / v.solVol
    return {
      result: recovery, label: 'Recrystallization Recovery Yield', unit: '%',
      steps: [
        { label: 'Crude mass', value: `${v.massCrude} g` },
        { label: 'Pure recovered mass', value: `${v.massPure} g` },
        { label: 'Solvent volume', value: `${v.solVol} mL` },
        { label: '% recovery = (pure / crude) × 100%', value: `${recovery.toFixed(2)}%` },
        { label: 'Mass lost', value: `${loss.toFixed(3)} g` },
        { label: 'Concentration in solution', value: `${conc.toFixed(4)} g/mL` },
      ]
}
  },
  description: 'Recrystallization is a purification technique that dissolves a crude solid in hot solvent and allows it to crystallize upon cooling. The percent recovery measures the efficiency of the purification.',
  formula: '% Recovery = (mass of pure solid / mass of crude solid) × 100%',
  interpretation: 'Recovery yields typically range from 50-90%. Low recovery may indicate high solubility of the compound in the cold solvent, while high recovery may suggest incomplete removal of impurities. The ideal solvent dissolves the compound when hot but not when cold.'
}

export default calcDef
