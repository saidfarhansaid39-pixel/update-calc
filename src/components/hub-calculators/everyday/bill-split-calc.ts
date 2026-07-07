import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalBill: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), numPeople: z.string().min(1).refine(v => parseFloat(v) > 1, '>1'), tipPercent: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'totalBill', label: 'Total Bill ($)', type: 'number', min: 1, step: '5' },
    { name: 'numPeople', label: 'Number of People', type: 'number', min: 2, step: '1' },
    { name: 'tipPercent', label: 'Tip %', type: 'number', min: 0, max: 100, step: '5' },
  ],
  compute: (v) => {
    const tipAmount = v.totalBill * (v.tipPercent / 100)
    const totalWithTip = v.totalBill + tipAmount
    const perPerson = totalWithTip / v.numPeople
    return { result: perPerson, label: 'Per Person', unit: '$', steps: [{ label: 'Tip', value: `$${tipAmount.toFixed(2)}` }, { label: 'Total with Tip', value: `$${totalWithTip.toFixed(2)}` }, { label: 'Per Person', value: `$${perPerson.toFixed(2)}` }] }
  },
  description: 'Split a restaurant bill evenly between friends. Enter the total, number of people, and tip percentage to get each person\'s share.',
  formula: 'Per Person = (Bill + Bill × Tip%) / People',
  interpretation: 'Standard tips: 15-20% for good service, 20-25% for exceptional. Some groups split by what each ordered to account for different appetizer/drink costs.'
}

export default calcDef
