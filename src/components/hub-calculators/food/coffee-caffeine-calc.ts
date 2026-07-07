import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'cups', label: 'Cups', type: 'number', min: 0, step: '0.5' },
      { name: 'type', label: 'Coffee Type', type: 'select', options: [{ label: 'Drip (95 mg)', value: '95' }, { label: 'Espresso (63 mg)', value: '63' }, { label: 'French press (80 mg)', value: '80' }, { label: 'Cold brew (100 mg)', value: '100' }, { label: 'Instant (60 mg)', value: '60' }] },
      { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 20, step: '0.1' }
    ],
    compute: (v) => {
      const t = v.cups * parseFloat(v.type); const s = v.weight * 6; return { result: t, label: 'Caffeine', unit: 'mg', steps: [{ label: 'Intake', value: v.cups + ' x ' + v.type + ' mg = ' + t.toFixed(0) + ' mg' }, { label: 'Safe limit (6 mg/kg)', value: s.toFixed(0) + ' mg' }, t > s ? { label: 'Over limit', value: 'Reduce by ' + (t - s).toFixed(0) + ' mg' } : { label: 'Within range', value: (s - t).toFixed(0) + ' mg below limit' }] }
    },
    description: 'Caffeine intake vs safe limits. Health authorities recommend up to 400 mg/day (6 mg/kg body weight).',
    example: { label: '3 cups drip coffee, 70kg', value: '285 mg — within limit' }
}

export default calcDef
