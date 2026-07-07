import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'pizzas', label: 'Number of Pizzas', type: 'number', min: 1, step: '1' },
      { name: 'size', label: 'Pizza Size', type: 'select', options: [
        { label: '10" (small) — 200g dough', value: '200' }, { label: '12" (medium) — 300g dough', value: '300' },
        { label: '14" (large) — 400g dough', value: '400' }, { label: '16" (extra large) — 550g dough', value: '550' },
      ] },
    ],
    compute: (v) => {
      const totalDough = v.pizzas * v.size; const flour = totalDough * 0.6; const water = totalDough * 0.36; const salt = totalDough * 0.012; const yeast = totalDough * 0.006
      return { result: totalDough, label: 'Total Dough', unit: 'g', steps: [
        { label: 'Pizzas', value: `${v.pizzas} × ${v.size}g each` },
        { label: 'Flour (60%)', value: `${flour.toFixed(0)} g` },
        { label: 'Water (36%)', value: `${water.toFixed(0)} g` },
        { label: 'Salt (1.2%)', value: `${salt.toFixed(1)} g` },
        { label: 'Yeast (0.6%)', value: `${yeast.toFixed(1)} g` },
        { label: 'Total dough', value: `${totalDough} g` },
      ]}
    },
    description: 'Perfect pizza dough recipe using baker\'s percentages. Scale for any number and size of pizzas. Classic Neapolitan: 60% flour, 36% water, 1.2% salt, 0.6% yeast.',
    example: { label: '2 × 12" pizzas', value: '600g total dough' }
}

export default calcDef
