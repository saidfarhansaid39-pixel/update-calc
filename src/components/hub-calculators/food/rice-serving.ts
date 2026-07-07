import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' },
      { name: 'type', label: 'Rice Type', type: 'select', options: [{ label: 'White (75g dry)', value: '75' }, { label: 'Brown (65g dry)', value: '65' }, { label: 'Basmati (70g dry)', value: '70' }, { label: 'Sushi (80g dry)', value: '80' }] }
    ],
    compute: (v) => {
      const dry = v.servings * v.type; const cooked = dry * 3; return { result: dry, label: 'Dry Rice', unit: 'g', steps: [{ label: 'Servings', value: v.servings }, { label: 'Per serving', value: v.type + ' g dry' }, { label: 'Total dry', value: dry + ' g' }, { label: 'Cooked yield', value: cooked + ' g' }] }
    },
    description: 'Rice quantities. Rice triples in volume when cooked. 75g dry white = ~200g cooked.',
    example: { label: '4 servings white rice', value: '300g dry (~900g cooked)' }
}

export default calcDef
