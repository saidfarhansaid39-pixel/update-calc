import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' },
      { name: 'ratio', label: 'Vinaigrette Ratio', type: 'select', options: [
        { label: '3:1 (mild — 3 oil : 1 vinegar)', value: '3:1' },
        { label: '2:1 (balanced)', value: '2:1' },
        { label: '1:1 (tangy)', value: '1:1' },
      ] },
    ],
    compute: (v) => {
      const parts = v.ratio.split(':').map(Number)
      const total = v.servings * 30; const oil = total * parts[0] / (parts[0] + parts[1]); const vinegar = total * parts[1] / (parts[0] + parts[1])
      return { result: total, label: 'Total Dressing', unit: 'mL', steps: [
        { label: 'Servings', value: `${v.servings} × 30 mL` },
        { label: 'Oil', value: `${oil.toFixed(1)} mL` },
        { label: 'Vinegar/acid', value: `${vinegar.toFixed(1)} mL` },
        { label: 'Ratio', value: `${parts[0]}:${parts[1]} oil:vinegar` },
      ]}
    },
    description: 'Perfect vinaigrette dressing ratios. Classic French: 3 parts oil to 1 part vinegar. Adjust to taste — more oil for milder, more vinegar for tangier dressings.',
    example: { label: '4 servings, 2:1 ratio', value: '80mL oil + 40mL vinegar' }
}

export default calcDef
