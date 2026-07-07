import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'water', label: 'Water Volume', type: 'number', unit: 'mL', min: 50, step: '10' },
      { name: 'ratio', label: 'Brew Ratio', type: 'select', options: [{ label: '1:15 (strong)', value: '15' }, { label: '1:16 (standard pour-over)', value: '16' }, { label: '1:17 (balanced)', value: '17' }, { label: '1:18 (mild)', value: '18' }, { label: '1:12 (French press)', value: '12' }, { label: '1:5 (cold brew)', value: '5' }] }
    ],
    compute: (v) => {
      const r = parseFloat(v.ratio); const grounds = v.water / r; return { result: grounds, label: 'Coffee Grounds', unit: 'g', steps: [{ label: 'Water', value: v.water + ' mL' }, { label: 'Ratio 1:' + r, value: grounds.toFixed(1) + ' g coffee' }, { label: 'Method', value: r <= 12 ? 'French press (4 min)' : r >= 15 ? 'Pour-over (2.5-3 min)' : 'Drip (3-4 min)' }] }
    },
    description: 'Coffee brew ratios. SCA recommends 1:16-1:18 for pour-over. French press uses 1:12, cold brew 1:5.',
    example: { label: '300mL water, 1:16 ratio', value: '18.8g coffee grounds' }
}

export default calcDef
