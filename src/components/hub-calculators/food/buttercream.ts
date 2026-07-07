import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'servings', label: 'Servings', type: 'number', min: 4, step: '4' },
      { name: 'type', label: 'Type', type: 'select', options: [{ label: 'American', value: 'american' }, { label: 'Swiss meringue', value: 'swiss' }, { label: 'Italian meringue', value: 'italian' }] }
    ],
    compute: (v) => {
      const butter = Math.ceil(v.servings / 12) * 227; const sugar = v.type === 'american' ? butter * 2 : butter * 1.5; const egg = v.type === 'american' ? 0 : Math.round(butter / 227 * 3); return { result: butter, label: 'Butter', unit: 'g', steps: [{ label: 'Servings', value: v.servings }, { label: 'Butter', value: butter + ' g' }, { label: 'Sugar', value: sugar.toFixed(0) + ' g' }, egg > 0 ? { label: 'Egg whites', value: egg + ' whites' } : { label: 'Milk', value: '2-4 tbsp' }] }
    },
    description: 'Buttercream quantities. American is quick; Swiss/Italian meringue are silkier. 1 batch per 12 servings.',
    example: { label: '24 servings American', value: '454g butter, 908g sugar' }
}

export default calcDef
