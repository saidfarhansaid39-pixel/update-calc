import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'amount', label: 'Dairy (mL)', type: 'number', unit: 'mL', min: 10, step: '10' },
      { name: 'type', label: 'Dairy Type', type: 'select', options: [{ label: 'Milk (1:1 plant milk)', value: 'milk' }, { label: 'Heavy cream (coconut cream)', value: 'cream' }, { label: 'Buttermilk (milk+lemon)', value: 'buttermilk' }, { label: 'Yogurt (plant yogurt)', value: 'yogurt' }] }
    ],
    compute: (v) => {
      const note = v.type === 'buttermilk' ? 'Add 1 tbsp lemon juice per L' : v.type === 'cream' ? 'Use full-fat coconut cream' : '1:1 swap'; return { result: v.amount, label: 'Substitute', unit: 'mL', steps: [{ label: 'Type', value: v.type }, { label: 'Amount', value: v.amount + ' mL' }, { label: 'Swap', value: '1:1 replacement' }, { label: 'Note', value: note }] }
    },
    description: 'Dairy-free alternatives for milk, cream, yogurt, and buttermilk.',
    example: { label: '250mL milk to oat milk', value: '250mL oat milk' }
}

export default calcDef
