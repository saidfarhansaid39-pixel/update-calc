import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' },
      { name: 'ratio', label: 'Smoothie Style', type: 'select', options: [
        { label: 'Fruit-forward (60% fruit, 40% liquid)', value: '60_40' },
        { label: 'Protein (40% fruit, 30% protein, 30% liquid)', value: '40_30_30' },
        { label: 'Green (50% greens, 25% fruit, 25% liquid)', value: '50_25_25' },
        { label: 'Creamy (40% fruit, 40% yogurt, 20% liquid)', value: '40_40_20' },
      ] },
    ],
    compute: (v) => {
      const parts = v.ratio.split('_').map(Number); const total = 300 * v.servings
      const amounts = parts.map((p: number) => total * p / 100)
      return { result: total, label: 'Total Smoothie Volume', unit: 'mL', steps: [
        { label: 'Servings', value: `${v.servings} × 300 mL` },
        { label: 'Total volume', value: `${total} mL` },
        ...amounts.map((a: number, i: number) => ({ label: ['Base ingredient', 'Secondary', 'Liquid'][i] || `Component ${i + 1}`, value: `${a.toFixed(0)} mL (${parts[i]}%)` })),
      ]}
    },
    description: 'Balance your smoothie ingredients for the perfect blend. A standard serving is 300 mL. Adjust ratios for fruit-forward, protein-packed, or green smoothies.',
    example: { label: '2 servings fruit smoothie', value: '600 mL: 360mL fruit + 240mL liquid' }
}

export default calcDef
