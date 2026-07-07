import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'flour', label: 'Flour', type: 'number', unit: 'g', min: 50, step: '10' },
      { name: 'water', label: 'Water', type: 'number', unit: 'g', min: 30, step: '5' },
      { name: 'starterPct', label: 'Starter %', type: 'select', options: [{ label: '20% (long ferment)', value: '20' }, { label: '30% (standard)', value: '30' }, { label: '40% (quick rise)', value: '40' }] }
    ],
    compute: (v) => {
      const h = v.water / v.flour * 100; const s = v.flour * (parseFloat(v.starterPct) / 100); const tf = v.flour + s * 0.5; const tw = v.water + s * 0.5; const th = tw / tf * 100; return { result: h, label: 'Hydration', unit: '%', steps: [{ label: 'Added', value: v.flour + ' g flour + ' + v.water + ' g water = ' + h.toFixed(0) + '%' }, { label: 'Starter', value: s.toFixed(0) + ' g (' + v.starterPct + '%)' }, { label: 'True hydration', value: th.toFixed(0) + '%' }] }
    },
    description: 'Dough hydration including starter contribution. Higher hydration yields more open crumb.',
    example: { label: '500g flour, 375g water, 30% starter', value: '75% hydration' }
}

export default calcDef
