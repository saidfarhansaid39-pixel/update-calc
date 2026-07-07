import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' },
      { name: 'type', label: 'Pasta Type', type: 'select', options: [
        { label: 'Dry pasta (100g/serving)', value: '100' }, { label: 'Fresh pasta (150g/serving)', value: '150' },
        { label: 'Filled pasta/ravioli (200g/serving)', value: '200' },
      ] },
    ],
    compute: (v) => ({ result: v.servings * v.type, label: 'Pasta Needed', unit: 'g', steps: [
      { label: 'Servings', value: `${v.servings}` },
      { label: 'Per serving', value: `${v.type} g` },
      { label: 'Total pasta', value: `${v.servings * v.type} g` },
      { label: 'Cooking water', value: `Use 4-6 L of well-salted water (1 tbsp salt per L)` },
      { label: 'Cook time', value: v.type === '200' ? '3-4 min' : v.type === '150' ? '2-3 min' : '8-12 min' },
    ]}),
    description: 'Calculate how much pasta to cook based on servings. Standard portion: 100g dry pasta per person as a main dish, 50g as a side. Fresh pasta portions are larger by weight.',
    example: { label: '4 servings dry pasta', value: '400g total pasta' }
}

export default calcDef
