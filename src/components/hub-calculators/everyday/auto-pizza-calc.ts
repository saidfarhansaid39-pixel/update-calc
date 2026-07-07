import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ apcPizzasOrdered: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), apcSlicesPerPizza: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), apcPricePerPizza: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), apcPeopleEating: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), apcDeliveryTip: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), apcHasCoupon: z.string().min(1) }),
  fields: [
    { name: 'apcPizzasOrdered', label: 'Pizzas Ordered', type: 'number', min: 1, step: '1' },
    { name: 'apcSlicesPerPizza', label: 'Slices per Pizza', type: 'number', min: 6, max: 12, step: '2' },
    { name: 'apcPricePerPizza', label: 'Price per Pizza ($)', type: 'number', min: 5, step: '2' },
    { name: 'apcPeopleEating', label: 'People Eating', type: 'number', min: 1, step: '1' },
    { name: 'apcDeliveryTip', label: 'Delivery Tip ($)', type: 'number', min: 0, step: '1' },
    { name: 'apcHasCoupon', label: 'Coupon/Deal', type: 'select', options: [{ label: 'No coupon', value: 'none' }, { label: '$3 off (carryout)', value: 'pickup' }, { label: 'Large 2-topping deal ($10)', value: 'deal' }, { label: 'Buy 1 Get 1 Free', value: 'bogo' }] },
  ],
  compute: (v) => {
    let effectivePizzas = v.apcPizzasOrdered
    if (v.apcHasCoupon === 'bogo') { effectivePizzas = Math.ceil(v.apcPizzasOrdered / 2) }
    let discount = 0
    if (v.apcHasCoupon === 'pickup') { discount = 3 * v.apcPizzasOrdered }
    if (v.apcHasCoupon === 'deal') { discount = (v.apcPricePerPizza - 10) * v.apcPizzasOrdered }
    const subtotal = effectivePizzas * v.apcPricePerPizza - discount
    const deliveryFee = 0
    const tax = subtotal * 0.08
    const total = subtotal + tax + v.apcDeliveryTip
    const totalSlices = v.apcPizzasOrdered * v.apcSlicesPerPizza
    const slicesPerPerson = totalSlices / v.apcPeopleEating
    const costPerSlice = total / totalSlices
    const costPerPerson = total / v.apcPeopleEating
    return { result: total, label: 'Total Pizza Order Cost', unit: '$', steps: [{ label: 'Pizzas After Deal', value: `${effectivePizzas}` }, { label: 'Discount', value: `-$${discount.toFixed(2)}` }, { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` }, { label: 'Tax + Tip', value: `$${(tax + v.apcDeliveryTip).toFixed(2)}` }, { label: 'Total', value: `$${total.toFixed(2)}` }, { label: 'Slices Per Person', value: `${slicesPerPerson.toFixed(1)}` }, { label: 'Cost Per Person', value: `$${costPerPerson.toFixed(2)}` }] }
  },
  description: 'Calculate pizza order costs including deals, coupons, tax, and tip. Determine slices per person and cost per person for any group pizza order.',
  formula: 'Total = (Pizzas × Price - Discount) × 1.08 + Tip | Slices/Person = (Pizzas × Slices) / People',
  interpretation: 'Average pizza: $12-20 for a large 8-slice. 3 slices per person is standard for adults. Buy 1 Get 1 Free deals save 50%. A $10 large 2-topping deal is the best value at $1.25/slice. Carryout saves $3-5 delivery fee.'
}

export default calcDef
