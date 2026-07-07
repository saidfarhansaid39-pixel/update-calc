import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' },
      { name: 'type', label: 'Salad Type', type: 'select', options: [
        { label: 'Side salad (150g/serving)', value: '150' }, { label: 'Main salad (300g/serving)', value: '300' },
        { label: 'Pasta/potato salad (200g/serving)', value: '200' },
      ] },
    ],
    compute: (v) => ({ result: v.servings * v.type, label: 'Total Salad Weight', unit: 'g', steps: [
      { label: 'Servings', value: `${v.servings}` },
      { label: 'Per serving', value: `${v.type} g` },
      { label: 'Total needed', value: `${v.servings * v.type} g` },
      { label: 'Dressing', value: `~${(v.servings * 30).toFixed(0)} mL (30 mL per serving)` },
    ]}),
    description: 'Plan salad quantities for any number of servings. Side salads are 150g per person, main course salads are 300g. Add 30 mL of dressing per serving.',
    example: { label: '4 main salads', value: '1,200g total + 120mL dressing' }
}

export default calcDef
