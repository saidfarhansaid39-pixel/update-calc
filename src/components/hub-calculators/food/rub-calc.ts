import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'meatWeight', label: 'Meat Weight', type: 'number', unit: 'g', min: 200, step: '100' },
      { name: 'intensity', label: 'Intensity', type: 'select', options: [{ label: 'Light (1 tbsp/500g)', value: '1' }, { label: 'Medium (1.5 tbsp/500g)', value: '1.5' }, { label: 'Heavy (2 tbsp/500g)', value: '2' }] }
    ],
    compute: (v) => {
      const tbsp = (v.meatWeight / 500) * v.intensity; const g = tbsp * 15; return { result: g, label: 'Total Rub', unit: 'g', steps: [{ label: 'Meat', value: v.meatWeight + ' g' }, { label: 'Intensity', value: v.intensity + ' tbsp/500g' }, { label: 'Total', value: g.toFixed(0) + ' g (' + tbsp.toFixed(1) + ' tbsp)' }] }
    },
    description: 'Dry rub quantities. Standard mix: 1 part salt + 1 part pepper + spices. Apply 30-60 min before cooking.',
    example: { label: '2kg brisket, medium', value: '~60g (6 tbsp) rub' }
}

export default calcDef
