import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'pan', label: 'Pan Size', type: 'select', options: [{ label: 'Half sheet (18x13" — 8 servings)', value: '8' }, { label: 'Quarter sheet (13x9" — 4 servings)', value: '4' }, { label: 'Full sheet (26x18" — 16 servings)', value: '16' }] },
      { name: 'servings', label: 'Desired Servings', type: 'number', min: 1, step: '1' }
    ],
    compute: (v) => {
      const ps = parseInt(v.pan); const pn = Math.ceil(v.servings / ps); return { result: pn, label: 'Pans Needed', unit: 'pans', steps: [{ label: 'Pan capacity', value: ps + ' servings' }, { label: 'Desired', value: v.servings }, { label: 'Pans needed', value: pn }] }
    },
    description: 'Sheet pan servings. Half sheet = 8 servings, quarter = 4, full = 16.',
    example: { label: '24 servings, half sheet', value: '3 half-sheet pans' }
}

export default calcDef
