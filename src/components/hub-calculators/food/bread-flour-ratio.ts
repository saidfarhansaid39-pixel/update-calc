import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'flour', label: 'Flour', type: 'number', unit: 'g', min: 100, step: '10' },
      { name: 'breadType', label: 'Bread Type', type: 'select', options: [{ label: 'Sandwich (65%, 2% salt, 1% yeast)', value: '65_2_1' }, { label: 'Artisan (75%, 2% salt, 0.5% yeast)', value: '75_2_0.5' }, { label: 'Whole wheat (70%, 2%, 1.5%)', value: '70_2_1.5' }, { label: 'Focaccia (80%, 2.5%, 1%)', value: '80_2.5_1' }, { label: 'Bagels (55%, 2%, 1%)', value: '55_2_1' }] }
    ],
    compute: (v) => {
      const p = v.breadType.split('_').map(Number); const w = v.flour * p[0] / 100; const sa = v.flour * p[1] / 100; const y = v.flour * p[2] / 100; const t = v.flour + w + sa + y; return { result: t, label: 'Total Dough', unit: 'g', steps: [{ label: 'Flour', value: v.flour + ' g' }, { label: 'Water (' + p[0] + '%)', value: w.toFixed(0) + ' g' }, { label: 'Salt (' + p[1] + '%)', value: sa.toFixed(1) + ' g' }, { label: 'Yeast (' + p[2] + '%)', value: y.toFixed(2) + ' g' }, { label: 'Total', value: t.toFixed(0) + ' g' }] }
    },
    description: 'Bread ingredient ratios for popular styles. Bagels are low hydration; focaccia is high hydration.',
    example: { label: '500g flour, artisan boule', value: '~887g dough' }
}

export default calcDef
