import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'pans', label: 'Number of Pans', type: 'number', min: 1, step: '1' },
      { name: 'panSize', label: 'Pan Size', type: 'select', options: [{ label: '8" round (4 cups)', value: '4' }, { label: '9" round (5 cups)', value: '5' }, { label: '8x8" square (6 cups)', value: '6' }, { label: '9x13" (10 cups)', value: '10' }, { label: 'Cupcake (12 per batch)', value: '2.5' }] }
    ],
    compute: (v) => {
      const cups = parseFloat(v.panSize); const tc = v.pans * cups; return { result: tc, label: 'Total Batter', unit: 'cups', steps: [{ label: 'Pan type', value: cups + ' cups capacity' }, { label: 'Pans', value: v.pans }, { label: 'Total batter', value: tc.toFixed(1) + ' cups' }, { label: 'Fill rule', value: 'Fill 1/2 to 2/3 full' }] }
    },
    description: 'Cake batter quantities. Fill pans 1/2 to 2/3 full. 9" round = 5 cups.',
    example: { label: '2 x 9" round pans', value: '10 cups batter' }
}

export default calcDef
