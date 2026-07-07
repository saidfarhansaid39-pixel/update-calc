import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'starter', label: 'Starter Weight', type: 'number', unit: 'g', min: 10, step: '5' },
      { name: 'ratio', label: 'Feeding Ratio', type: 'select', options: [
        { label: '1:1:1 (equal parts)', value: '1' }, { label: '1:2:2 (double flour+water)', value: '2' },
        { label: '1:3:3 (triple)', value: '3' }, { label: '1:5:5 (maintenance)', value: '5' },
      ] },
    ],
    compute: (v) => {
      const flour = v.starter * v.ratio; const water = v.starter * v.ratio; const total = v.starter + flour + water
      return { result: total, label: 'Fed Starter', unit: 'g', steps: [
        { label: 'Existing starter', value: `${v.starter} g` },
        { label: 'Add flour', value: `${flour} g` },
        { label: 'Add water', value: `${water} g` },
        { label: 'Total after feeding', value: `${total} g` },
        { label: 'Discard before next feed', value: `Keep ${v.starter} g, discard ${total - v.starter} g` },
      ]}
    },
    description: 'Calculate sourdough starter feeding amounts. Standard 1:1:1 ratio maintains starter. Higher ratios (1:5:5) build larger amounts for baking or reduce feeding frequency.',
    example: { label: '50g starter, 1:2:2 ratio', value: 'Add 100g flour + 100g water = 250g total' }
}

export default calcDef
