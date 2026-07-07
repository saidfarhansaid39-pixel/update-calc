import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'flour', label: 'Flour', type: 'number', unit: 'g', min: 50, step: '10' },
      { name: 'water', label: 'Water', type: 'number', unit: 'g', min: 30, step: '5' }
    ],
    compute: (v) => {
      const h = v.water / v.flour * 100; return { result: h, label: 'Hydration', unit: '%', steps: [{ label: 'Flour', value: v.flour + ' g' }, { label: 'Water', value: v.water + ' g' }, { label: 'Hydration', value: h.toFixed(0) + '%' }, { label: 'Feel', value: h < 60 ? 'Firm' : h < 70 ? 'Standard' : h < 80 ? 'High (sticky)' : 'Very high (very sticky)' }] }
    },
    description: 'Dough hydration = water weight / flour weight x 100. Higher hydration = more open crumb.',
    example: { label: '500g flour, 350g water', value: '70% hydration' }
}

export default calcDef
