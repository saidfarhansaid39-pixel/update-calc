import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    stressType: z.string().min(1, 'Required'),
    delta: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return !isNaN(n) }, 'Must be a number'),
    exoEndo: z.string().min(1, 'Required')
}),
  fields: [
    { name: 'stressType', label: 'Type of Stress', type: 'select', options: [
      { label: 'Increase [reactant]', value: 'conc_react' },
      { label: 'Increase [product]', value: 'conc_prod' },
      { label: 'Raise temperature', value: 'temp_up' },
      { label: 'Lower temperature', value: 'temp_down' },
      { label: 'Increase pressure', value: 'pressure_up' },
    ] },
    { name: 'delta', label: 'Magnitude Change', type: 'number', unit: '×', min: 0.1, max: 100, step: '0.1' },
    { name: 'exoEndo', label: 'Reaction Type', type: 'select', options: [
      { label: 'Exothermic (ΔH < 0)', value: 'exo' },
      { label: 'Endothermic (ΔH > 0)', value: 'endo' },
    ] },
  ],
  compute: (v) => {
    const shifts: Record<string, string> = {
      'conc_react': 'Forward (→) — consumes added reactant',
      'conc_prod': 'Reverse (←) — consumes added product',
      'temp_up_exo': 'Reverse (←) — favors endothermic direction',
      'temp_up_endo': 'Forward (→) — favors endothermic direction',
      'temp_down_exo': 'Forward (→) — favors exothermic direction',
      'temp_down_endo': 'Reverse (←) — favors exothermic direction',
      'pressure_up': 'Toward fewer gas moles'
}
    const key = v.stressType === 'pressure_up' ? 'pressure_up' : `${v.stressType}_${v.exoEndo}`
    const shift = shifts[key] || 'Depends on stoichiometry'
    return {
      result: shift, label: 'Equilibrium Shift Direction', unit: '',
      steps: [
        { label: 'Stress applied', value: v.stressType.replace(/_/g, ' ') },
        { label: 'Magnitude', value: `${v.delta}×` },
        { label: 'Le Chatelier response', value: shift },
      ]
}
  },
  description: 'Le Chatelier\'s principle: when a system at equilibrium is disturbed, it shifts to counteract the disturbance and restore equilibrium.',
  formula: 'Adding reactant → forward. Adding product → reverse. Heating → endothermic direction. Pressurizing → fewer gas moles.',
  interpretation: 'For exothermic reactions, heat is a product (cooling favors forward). For endothermic reactions, heat is a reactant (heating favors forward). Pressure changes affect only gas-phase equilibria.'
}

export default calcDef
