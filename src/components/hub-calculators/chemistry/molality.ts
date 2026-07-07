import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    moles: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    mass: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'moles', label: 'Moles of Solute (n)', type: 'number', unit: 'mol', min: 0.0001, step: '0.01' },
    { name: 'mass', label: 'Mass of Solvent', type: 'number', unit: 'kg', min: 0.001, step: '0.1' },
  ],
  compute: (v) => {
    const m = v.moles / v.mass
    return {
      result: m, label: 'Molality (m)', unit: 'mol/kg',
      steps: [
        { label: 'Solute moles', value: `${v.moles} mol` },
        { label: 'Solvent mass', value: `${v.mass} kg` },
        { label: 'm = n / kg solvent', value: `${v.moles} / ${v.mass}` },
        { label: 'Molality', value: `${m.toFixed(4)} mol/kg` },
      ]
}
  },
  description: 'Molality (m) is the moles of solute per kilogram of solvent, not solution. Unlike molarity, molality is temperature-independent because mass does not change with temperature.',
  formula: 'm = n_solute / m_solvent (kg) | Convert from molarity: m ≈ M / (ρ - M × M_solute / 1000)',
  interpretation: 'For dilute aqueous solutions, molality ≈ molarity because 1 kg water ≈ 1 L. Molality is preferred for colligative properties (ΔT_b, ΔT_f) because it is independent of temperature.'
}

export default calcDef
