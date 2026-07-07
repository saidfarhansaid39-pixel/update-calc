import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'water', label: 'Water Volume', type: 'number', unit: 'mL', min: 100, step: '100' },
      { name: 'pct', label: 'Salt %', type: 'select', options: [{ label: '2% (sauerkraut, peppers)', value: '2' }, { label: '3% (pickles, hot sauce)', value: '3' }, { label: '5% (olives, strong brine)', value: '5' }] }
    ],
    compute: (v) => {
      const s = v.water * parseFloat(v.pct) / 100; return { result: s, label: 'Salt Needed', unit: 'g', steps: [{ label: 'Water', value: v.water + ' mL' }, { label: v.pct + '% brine', value: s.toFixed(1) + ' g salt' }, { label: 'Tip', value: 'Use non-iodized salt. Weigh, don\'t measure by volume!' }] }
    },
    description: 'Fermentation brine salinity. 2% for most vegetables, 3% for pickles, 5% for strong brines. Use non-iodized salt.',
    example: { label: '1L water, 2% brine', value: '20g salt' }
}

export default calcDef
