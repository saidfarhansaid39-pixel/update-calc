import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'meatWeight', label: 'Meat Weight', type: 'number', unit: 'g', min: 100, step: '50' },
      { name: 'intensity', label: 'Intensity', type: 'select', options: [{ label: 'Light (30%)', value: '0.3' }, { label: 'Medium (50%)', value: '0.5' }, { label: 'Generous (75%)', value: '0.75' }, { label: 'Full (100%)', value: '1' }] }
    ],
    compute: (v) => {
      const t = v.meatWeight * v.intensity; const oil = t * 0.5; const acid = t * 0.25; const seas = t * 0.25; return { result: t, label: 'Total Marinade', unit: 'g', steps: [{ label: 'Meat', value: v.meatWeight + ' g' }, { label: 'Total', value: t.toFixed(0) + ' g' }, { label: 'Oil (50%)', value: oil.toFixed(0) + ' g' }, { label: 'Acid (25%)', value: acid.toFixed(0) + ' g' }, { label: 'Seasoning (25%)', value: seas.toFixed(0) + ' g' }] }
    },
    description: 'Marinade: 50% oil, 25% acid, 25% seasonings. Marinate 30 min (fish) to 12 hrs (beef).',
    example: { label: '500g chicken, medium (50%)', value: '250g total marinade' }
}

export default calcDef
