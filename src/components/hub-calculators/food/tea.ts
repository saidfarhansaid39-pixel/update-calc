import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'teaType', label: 'Tea Type', type: 'select', options: [
        { label: 'Green tea — 2-3 min at 75°C', value: '3_75' }, { label: 'Black tea — 3-5 min at 95°C', value: '4_95' },
        { label: 'White tea — 2-3 min at 80°C', value: '3_80' }, { label: 'Oolong — 3-5 min at 85°C', value: '4_85' },
        { label: 'Herbal — 5-7 min at 100°C', value: '6_100' }, { label: 'Rooibos — 5-7 min at 95°C', value: '6_95' },
      ] },
      { name: 'cups', label: 'Cups', type: 'number', min: 1, step: '1' },
    ],
    compute: (v) => {
      const parts = v.teaType.split('_'); const mins = parseFloat(parts[0]); const temp = parseFloat(parts[1])
      return { result: mins, label: 'Steep Time', unit: 'min', steps: [
        { label: 'Tea type', value: `${['Green', 'Black', 'White', 'Oolong', 'Herbal', 'Rooibos'][['3_75', '4_95', '3_80', '4_85', '6_100', '6_95'].indexOf(v.teaType)] || 'Tea'}` },
        { label: 'Water temperature', value: `${temp}°C` },
        { label: 'Steep time', value: `${mins} min` },
        { label: 'For', value: `${v.cups} cup${v.cups > 1 ? 's' : ''}` },
      ]}
    },
    description: 'Perfect tea steeping parameters based on tea variety. Water temperature and steep time dramatically affect flavor — too hot or too long makes tea bitter.',
    example: { label: 'Green tea, 2 cups', value: 'Steep 3 min at 75°C' }
}

export default calcDef
