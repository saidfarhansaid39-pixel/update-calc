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
  defaults: { apcPizzasOrdered: '3', apcSlicesPerPizza: '8', apcPricePerPizza: '14', apcPeopleEating: '4', apcDeliveryTip: '4', apcHasCoupon: 'none' },
  presets: [
    { label: 'Friday Night (4 people)', values: { apcPizzasOrdered: '3', apcSlicesPerPizza: '8', apcPricePerPizza: '14', apcPeopleEating: '4', apcDeliveryTip: '5', apcHasCoupon: 'none' } },
    { label: 'Office Party (10 people)', values: { apcPizzasOrdered: '7', apcSlicesPerPizza: '8', apcPricePerPizza: '16', apcPeopleEating: '10', apcDeliveryTip: '10', apcHasCoupon: 'deal' } },
    { label: 'BOGO Feast (6 people)', values: { apcPizzasOrdered: '4', apcSlicesPerPizza: '8', apcPricePerPizza: '15', apcPeopleEating: '6', apcDeliveryTip: '6', apcHasCoupon: 'bogo' } },
    { label: 'Carryout Budget (2 people)', values: { apcPizzasOrdered: '1', apcSlicesPerPizza: '8', apcPricePerPizza: '12', apcPeopleEating: '2', apcDeliveryTip: '0', apcHasCoupon: 'pickup' } },
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
    return { result: total, label: 'Total Pizza Order Cost', unit: '$', steps: [
      { label: 'Effective Pizzas', value: `${v.apcPizzasOrdered} ordered → ${effectivePizzas} paid (after coupon)` },
      { label: 'Coupon Discount', value: `-$${discount.toFixed(2)}` },
      { label: 'Subtotal', value: `${effectivePizzas} × $${v.apcPricePerPizza} - $${discount.toFixed(2)} = $${subtotal.toFixed(2)}` },
      { label: 'Sales Tax (8%)', value: `$${subtotal.toFixed(2)} × 0.08 = $${tax.toFixed(2)}` },
      { label: 'Delivery Tip', value: `$${v.apcDeliveryTip.toFixed(2)}` },
      { label: 'Total Order', value: `$${subtotal.toFixed(2)} + $${tax.toFixed(2)} + $${v.apcDeliveryTip.toFixed(2)} = $${total.toFixed(2)}` },
      { label: 'Total Slices', value: `${v.apcPizzasOrdered} × ${v.apcSlicesPerPizza} = ${totalSlices}` },
      { label: 'Slices per Person', value: `${totalSlices} slices ÷ ${v.apcPeopleEating} people = ${slicesPerPerson.toFixed(1)}` },
      { label: 'Cost per Person', value: `$${total.toFixed(2)} ÷ ${v.apcPeopleEating} = $${costPerPerson.toFixed(2)}` },
      { label: 'Cost per Slice', value: `$${total.toFixed(2)} ÷ ${totalSlices} = $${costPerSlice.toFixed(2)}` },
    ] ,
    extras: [
      { label: "Slice math", value: "Adults eat 2–4 slices each. A standard large pizza has 8 slices. For a group of 4: 3 pizzas (24 slices / 6 per person if hungry). For 10 people: 7–8 pizzas needed." },
      { label: "Deal value comparison", value: "BOGO = 50% off. $10 large 2-topping deal: a $14 pizza for $10 = 29% off (but limited toppings). $3 off carryout = 15–25% off. No coupon is usually the most expensive option." },
      { label: "Delivery vs carryout", value: "Delivery adds $3–7 fee + tip expectation ($3–5 minimum). Carryout saves $6–12 per order. At 2×/week carryout vs delivery, you save $600–1,200/year." },
      { label: "Topping economics", value: "Adding 3+ toppings to a large pizza costs $2–4 extra vs ordering a specialty pizza at $2–3 more with all toppings included. Cheese pizza + free toppings at home is cheapest." },
      { label: "Leftover strategy", value: "Pizza keeps 3–4 days in the fridge. Reheat in a skillet (not microwave) for crispy crust. Unsliced pizza freezes well for 2–3 months — vacuum seal for best results." },
      { label: "Cost per square inch", value: "Large (14\", 154 sq in) costs ~$0.09–0.13/sq in. Medium (12\", 113 sq in) costs ~$0.10–0.15/sq in. Large is almost always the best value per square inch." },
      { label: "Party pizza planning", value: "For mixed groups, assume 3 slices per adult, 2 per child. One 18\" party sheet (40 slices) feeds 13–15 people. Costco large pizza ($9.95, 12 slices) is the best value at $0.83/slice." },
      { label: "Tip etiquette", value: "Delivery drivers get 15–20% pre-tax or $4–5 minimum. For large orders ($50+), tip 18–20%. If a delivery fee goes to the driver (not the store), tip 10–15% on top." },
    ]}
  },
  description: 'Calculate your total pizza order cost with any deal — BOGO, $10 large, or carryout discount. See slices per person, cost per slice, and cost per person for the perfect group order.',
  formula: 'Total = ((EffectivePizzas × Price) - Discount) × 1.08 + Tip | Slices/Person = (Pizzas × Slices) ÷ People | Cost/Person = Total ÷ People',
  interpretation: 'A 4-person Friday night with no coupon, 3 pizzas, tip: ~$52 total ($13/person, 6 slices each). An office party with the $10 deal: ~$118 for 10 ($11.80/person). BOGO feast for 6: ~$42 ($7/person) — the best value.'
}

export default calcDef
