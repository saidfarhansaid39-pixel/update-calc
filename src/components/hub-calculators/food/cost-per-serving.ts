import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'totalCost', label: 'Total Cost ($)', type: 'number', min: 0, step: '0.01' },
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' }
    ],
    compute: (v) => {
      const r = v.totalCost / v.servings; return { result: r, label: 'Cost Per Serving', unit: '$', steps: [{ label: 'Total cost', value: '$' + v.totalCost.toFixed(2) }, { label: 'Servings', value: v.servings }, { label: 'Per serving', value: '$' + r.toFixed(2) }] ,
    extras: [
      { label: "Serving note", value: "Adjust quantities based on number of servings needed." },
      { label: "Dietary note", value: "Consult a dietitian for personalized nutritional advice." },
      { label: "Substitution tip", value: "Substitutions may alter taste, texture, and nutritional content." }
    ]}
    },
    description: 'Quick cost-per-serving for any recipe.',
    example: { label: '$25, 4 servings', value: '$6.25/serving' }
}

export default calcDef
