import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'amount', label: 'Sugar (g)', type: 'number', unit: 'g', min: 5, step: '5' },
      { name: 'substitute', label: 'Substitute', type: 'select', options: [{ label: 'Honey (0.75x)', value: '0.75' }, { label: 'Maple syrup (0.75x)', value: '0.75' }, { label: 'Stevia (0.002x)', value: '0.002' }, { label: 'Coconut sugar (1:1)', value: '1' }, { label: 'Monk fruit (1:1)', value: '1' }] }
    ],
    compute: (v) => {
      const r = parseFloat(v.substitute); const result = v.amount * r; return { result, label: 'Substitute', unit: 'g', steps: [{ label: 'Sugar', value: v.amount + ' g' }, { label: 'Ratio', value: r + 'x' }, { label: 'Need', value: result.toFixed(1) + ' ' + (r < 0.1 ? 'units' : 'g') }] ,
    extras: [
      { label: "Serving note", value: "Adjust quantities based on number of servings needed." },
      { label: "Dietary note", value: "Consult a dietitian for personalized nutritional advice." },
      { label: "Substitution tip", value: "Substitutions may alter taste, texture, and nutritional content." }
    ]}
    },
    description: 'Substitute sugar with alternatives. Honey/maple are 75% as sweet; stevia is 500x sweeter.',
    example: { label: '100g sugar to honey', value: '75g honey' }
}

export default calcDef
