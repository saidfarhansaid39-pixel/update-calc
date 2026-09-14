import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' },
      { name: 'type', label: 'Type', type: 'select', options: [{ label: 'Dry main (100g)', value: '100' }, { label: 'Fresh (150g)', value: '150' }, { label: 'Dry side (50g)', value: '50' }] }
    ],
    compute: (v) => {
      const r = v.servings * v.type; return { result: r, label: 'Pasta Needed', unit: 'g', steps: [{ label: 'Servings', value: v.servings }, { label: 'Per serving', value: v.type + ' g' }, { label: 'Total', value: r + ' g' }] ,
    extras: [
      { label: "Serving note", value: "Adjust quantities based on number of servings needed." },
      { label: "Dietary note", value: "Consult a dietitian for personalized nutritional advice." },
      { label: "Substitution tip", value: "Substitutions may alter taste, texture, and nutritional content." }
    ]}
    },
    description: 'Pasta quantities by serving. 100g dry per main serving, 50g for sides.',
    example: { label: '4 servings dry pasta', value: '400g' }
}

export default calcDef
