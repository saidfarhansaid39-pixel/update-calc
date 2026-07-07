import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'size', label: 'Loaf Pan Size', type: 'select', options: [{ label: 'Mini (5.75x3x2" — 2 cups)', value: '2' }, { label: 'Small (7.5x3.5x2.5" — 4 cups)', value: '4' }, { label: 'Standard (8.5x4.5x2.5" — 6 cups)', value: '6' }, { label: 'Large (9x5x3" — 8 cups)', value: '8' }] },
      { name: 'loaves', label: 'Number of Loaves', type: 'number', min: 1, step: '1' }
    ],
    compute: (v) => {
      const cpl = parseInt(v.size); const tc = cpl * v.loaves; return { result: tc, label: 'Total Batter', unit: 'cups', steps: [{ label: 'Pan', value: cpl + ' cups' }, { label: 'Loaves', value: v.loaves }, { label: 'Total', value: tc + ' cups' }] }
    },
    description: 'Loaf pan batter quantities. Standard 9x5" = 8 cups. Fill 1/2 to 2/3 full.',
    example: { label: '2 standard loaves', value: '12 cups batter' }
}

export default calcDef
