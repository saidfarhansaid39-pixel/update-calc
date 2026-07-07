import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Turkey Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 2, step: '0.5' },
      { name: 'stuffing', label: 'Stuffing', type: 'select', options: [{ label: 'Unstuffed', value: '0' }, { label: 'Stuffed', value: '15' }] }
    ],
    compute: (v) => {
      const extra = parseFloat(v.stuffing); const totalMin = v.weight * 13 + extra; return { result: totalMin, label: 'Roast Time', unit: 'min', steps: [{ label: 'Weight', value: v.weight + ' kg' }, { label: 'Base (13 min/kg)', value: (v.weight * 13).toFixed(0) + ' min' }, { label: extra > 0 ? 'Stuffed +15 min' : 'Unstuffed', value: extra > 0 ? '+15 min' : 'No adjustment' }, { label: 'Total', value: totalMin.toFixed(0) + ' min (~' + (totalMin/60).toFixed(1) + ' hrs)' }, { label: 'Target temp', value: '74°C (165°F) in thigh' }] }
    },
    description: 'Turkey roasting times. 13 min/kg unstuffed. Cook to 74°C (165°F) in the thigh.',
    example: { label: '5kg turkey, unstuffed', value: '~65 min (~1.1 hrs)' }
}

export default calcDef
