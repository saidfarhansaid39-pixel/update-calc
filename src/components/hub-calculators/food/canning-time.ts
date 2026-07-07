import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'food', label: 'Food Type', type: 'select', options: [{ label: 'Green beans (20 min pints, 25 min quarts)', value: '20_25' }, { label: 'Tomatoes (40 min pints or quarts)', value: '40_40' }, { label: 'Corn (55 min pints, 85 min quarts)', value: '55_85' }, { label: 'Stock/broth (20 min pints, 25 min quarts)', value: '20_25' }, { label: 'Jam/jelly (10 min half-pints)', value: '10_10' }] },
      { name: 'size', label: 'Jar Size', type: 'select', options: [{ label: 'Pint (500 mL)', value: 'pint' }, { label: 'Quart (1 L)', value: 'quart' }] },
      { name: 'altitude', label: 'Altitude Adjustment', type: 'select', options: [{ label: 'Sea level-300m (+0 min)', value: '0' }, { label: '300-900m (+5 min)', value: '5' }, { label: '900-1800m (+10 min)', value: '10' }, { label: 'Above 1800m (+15 min)', value: '15' }] }
    ],
    compute: (v) => {
      const p = v.food.split('_'); const tm = v.size === 'quart' ? parseInt(p[1]) : parseInt(p[0]); const adj = tm + parseInt(v.altitude); return { result: adj, label: 'Processing Time', unit: 'min', steps: [{ label: 'Food', value: p.join(' ') }, { label: 'Jar size', value: v.size }, { label: 'Base time', value: tm + ' min' }, { label: 'Altitude adj', value: '+' + v.altitude + ' min' }, { label: 'Total', value: adj + ' min' }] }
    },
    description: 'Canning processing times by food type and jar size. Adjust for altitude above 300m. Use pressure canner for low-acid foods.',
    example: { label: 'Green beans, quarts, 500m altitude', value: '30 min' }
}

export default calcDef
