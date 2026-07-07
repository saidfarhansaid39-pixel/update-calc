import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, step: '1' },
      { name: 'sunExposure', label: 'Sun Exposure', type: 'select', options: [{ label: 'Minimal (<15 min/day)', value: '0.5' }, { label: 'Moderate (15-30 min)', value: '1' }, { label: 'Regular (>30 min)', value: '1.5' }] },
      { name: 'skin', label: 'Skin Type', type: 'select', options: [{ label: 'Light (I-II)', value: '1' }, { label: 'Medium (III-IV)', value: '0.7' }, { label: 'Dark (V-VI)', value: '0.4' }] }
    ],
    compute: (v) => {
      const b = v.age < 1 ? 400 : v.age < 70 ? 600 : 800; const adj = Math.round(b * (1.5 - v.sunExposure * v.skin * 0.3)); const r = Math.max(200, Math.min(4000, adj)); return { result: r, label: 'Vitamin D', unit: 'IU/day', steps: [{ label: 'Base RDA', value: b + ' IU' }, { label: 'Sun factor', value: v.sunExposure + 'x' }, { label: 'Skin factor', value: v.skin + 'x' }, { label: 'Recommended', value: r + ' IU/day' }] }
    },
    description: 'Daily vitamin D needs based on age, sun exposure, and skin type. Vitamin D is essential for bone health and immune function.',
    example: { label: '30yr, minimal sun, light skin', value: '~600 IU/day' }
}

export default calcDef
