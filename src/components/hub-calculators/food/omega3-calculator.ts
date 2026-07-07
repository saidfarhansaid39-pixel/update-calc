import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'goal', label: 'Health Goal', type: 'select', options: [{ label: 'General (500 mg)', value: '500' }, { label: 'Heart (1000 mg)', value: '1000' }, { label: 'Inflammation (2000 mg)', value: '2000' }, { label: 'Brain (1500 mg)', value: '1500' }] },
      { name: 'diet', label: 'Diet', type: 'select', options: [{ label: 'Fish 2x/week', value: '0.5' }, { label: 'Fish rarely', value: '0.8' }, { label: 'Vegan', value: '1' }] }
    ],
    compute: (v) => {
      const b = parseInt(v.goal); const adj = b * v.diet; return { result: adj, label: 'Omega-3 EPA+DHA', unit: 'mg', steps: [{ label: 'Target', value: b + ' mg' }, { label: 'Diet adjustment', value: v.diet + 'x' }, { label: 'Recommended', value: adj.toFixed(0) + ' mg' }, { label: 'Capsules (500 mg each)', value: Math.ceil(adj / 500) + '/day' }] }
    },
    description: 'Daily omega-3 (EPA+DHA) needs based on health goals. Supports heart, brain, and joint health.',
    example: { label: 'General, vegan', value: '500 mg (1 capsule)' }
}

export default calcDef
