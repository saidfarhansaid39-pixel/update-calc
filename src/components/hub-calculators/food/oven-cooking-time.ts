import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Food Weight', type: 'number', unit: 'g', min: 100, step: '50' },
      { name: 'type', label: 'Food Type', type: 'select', options: [{ label: 'Whole chicken (45 min/kg + 20)', value: '45_20' }, { label: 'Beef roast (30 min/kg + 15)', value: '30_15' }, { label: 'Pork roast (35 min/kg + 25)', value: '35_25' }, { label: 'Veggies (25 min at 200°C)', value: '25_0' }, { label: 'Fish (10 min at 200°C)', value: '10_0' }] }
    ],
    compute: (v) => {
      const p = v.type.split('_'); const mpkg = parseFloat(p[0]); const extra = parseFloat(p[1]); const mins = (v.weight / 1000) * mpkg + extra; return { result: mins, label: 'Oven Time', unit: 'min', steps: [{ label: 'Weight', value: (v.weight / 1000).toFixed(2) + ' kg' }, { label: 'Base rate', value: mpkg + ' min/kg' }, { label: 'Extra', value: extra > 0 ? extra + ' min' : 'none' }, { label: 'Total', value: mins.toFixed(0) + ' min' }] }
    },
    description: 'Oven cooking times by food weight and type. Always use a meat thermometer.',
    example: { label: '2kg whole chicken', value: '~110 min' }
}

export default calcDef
