import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'flour', label: 'Total Flour', type: 'number', unit: 'g', min: 100, step: '10' },
      { name: 'waterPct', label: 'Water %', type: 'number', min: 50, max: 100, step: '1', unit: '%' },
      { name: 'saltPct', label: 'Salt %', type: 'number', min: 1, max: 3, step: '0.1', unit: '%' },
      { name: 'yeastPct', label: 'Yeast %', type: 'number', min: 0.1, max: 3, step: '0.1', unit: '%' }
    ],
    compute: (v) => {
      const w = v.flour * v.waterPct / 100; const sa = v.flour * v.saltPct / 100; const y = v.flour * v.yeastPct / 100; const t = v.flour + w + sa + y; return { result: t, label: 'Total Dough', unit: 'g', steps: [{ label: 'Flour (100%)', value: v.flour + ' g' }, { label: 'Water (' + v.waterPct + '%)', value: w.toFixed(0) + ' g' }, { label: 'Salt (' + v.saltPct + '%)', value: sa.toFixed(1) + ' g' }, { label: 'Yeast (' + v.yeastPct + '%)', value: y.toFixed(1) + ' g' }, { label: 'Total dough', value: t.toFixed(0) + ' g' }] }
    },
    description: 'Baker\'s percentage calculations. Flour is always 100%; other ingredients are % of flour weight.',
    example: { label: '1000g flour, 70% water, 2% salt, 1% yeast', value: '1,730g dough' }
}

export default calcDef
