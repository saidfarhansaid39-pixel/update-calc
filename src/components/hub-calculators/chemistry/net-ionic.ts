import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    ionicLeft: z.string().min(1, 'Required'),
    ionicRight: z.string().min(1, 'Required'),
    spectator: z.string().min(1, 'Required')
}),
  fields: [
    { name: 'ionicLeft', label: 'Full Ionic Equation (left side)', type: 'number', unit: '', min: 0 },
    { name: 'ionicRight', label: 'Full Ionic Equation (right side)', type: 'number', unit: '', min: 0 },
    { name: 'spectator', label: 'Spectator Ions Present', type: 'number', unit: '', min: 0 },
  ],
  compute: (v) => {
    const netLeft = v.ionicLeft - v.spectator
    const netRight = v.ionicRight - v.spectator
    return {
      result: `Left: ${netLeft}, Right: ${netRight}`, label: 'Net Ionic Species', unit: '',
      steps: [
        { label: 'Total species on left', value: `${v.ionicLeft}` },
        { label: 'Spectator ions', value: `${v.spectator}` },
        { label: 'Net species on left', value: `${netLeft}` },
        { label: 'Net species on right', value: `${netRight}` },
      ]
}
  },
  description: 'A net ionic equation removes spectator ions that appear unchanged on both sides, showing only the species that participate in the chemical reaction.',
  formula: 'Net ionic = complete ionic equation − spectator ions',
  interpretation: 'For AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq), the net ionic equation is Ag⁺(aq) + Cl⁻(aq) → AgCl(s). Na⁺ and NO₃⁻ are spectators.'
}

export default calcDef
