import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalBill: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), numPeople: z.string().min(1).refine(v => parseFloat(v) > 1, '>1'), tipPercent: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'totalBill', label: 'Total Bill ($)', type: 'number', min: 1, step: '5' },
    { name: 'numPeople', label: 'Number of People', type: 'number', min: 2, step: '1' },
    { name: 'tipPercent', label: 'Tip %', type: 'number', min: 0, max: 100, step: '5' },
  ],
  defaults: { totalBill: '60', numPeople: '3', tipPercent: '18' },
  presets: [
    { label: 'Dinner for 3', values: { totalBill: '75', numPeople: '3', tipPercent: '18' } },
    { label: 'Large Group (8 people)', values: { totalBill: '240', numPeople: '8', tipPercent: '20' } },
    { label: 'Date Night (2 people)', values: { totalBill: '85', numPeople: '2', tipPercent: '20' } },
    { label: 'Business Lunch (4)', values: { totalBill: '120', numPeople: '4', tipPercent: '15' } },
  ],
  compute: (v) => {
    const tipAmount = v.totalBill * (v.tipPercent / 100)
    const totalWithTip = v.totalBill + tipAmount
    const perPerson = totalWithTip / v.numPeople
    return { result: perPerson, label: 'Per Person', unit: '$', steps: [
      { label: 'Tip Amount', value: `$${v.totalBill.toFixed(2)} x ${v.tipPercent}% = $${tipAmount.toFixed(2)}` },
      { label: 'Total with Tip', value: `$${v.totalBill.toFixed(2)} + $${tipAmount.toFixed(2)} = $${totalWithTip.toFixed(2)}` },
      { label: 'Per Person Share', value: `$${totalWithTip.toFixed(2)} ÷ ${v.numPeople} = $${perPerson.toFixed(2)} each` },
      { label: 'Without Tip (per person)', value: `$${v.totalBill.toFixed(2)} ÷ ${v.numPeople} = $${(v.totalBill / v.numPeople).toFixed(2)} each` },
    ] ,
    extras: [
      { label: "Tipping etiquette by service", value: "Full-service dining: 15–20% pre-tax. Large parties (6+): some restaurants auto-add 18%. Takeout: 10–15% (counter service) or $2–5. Delivery: 15–20% or $5 minimum. Barista/coffee: $1–2 or round up. Buffet: 10–15% of total." },
      { label: "Split-everything vs itemized", value: "Even split works when everyone orders similarly priced items ($20–30 each). If someone orders steak ($45) and another has a salad ($15), itemized is fairer. Use the even-split calculator for drinks/ apps, then settle main course differences separately." },
      { label: "The penny problem", value: "Splitting $85.37 3 ways = $28.4567/person. Rounding to $28.46 leaves $0.01 unaccounted. Solution: 2 people pay $28.46, 1 pays $28.45. Or add the difference to the tip. Or don't worry about it — a penny difference isn't worth the math headache." },
      { label: "Tip on tax or not?", value: "Conventional etiquette: tip on the pre-tax total ($60 → $12 tip at 20%). Most POS machines calculate tip on the post-tax total ($65.40 → $13.08 tip at 20%). Difference: $1.08. Some argue tip on post-tax is standardizing; others say tip on pre-tax only. Either is acceptable." },
      { label: "Digital splitting tools", value: "Venmo, Zelle, Cash App: instant split requests. Splitwise: tracks shared expenses across multiple outings. Most restaurant POS systems (Toast, Square) now have built-in split features — ask the server to split before payment." },
      { label: "Large group math", value: "For 8+ people, ask the server for a single check vs separate checks. Single check + even split is fastest. If separate checks, tell the server before ordering. Most restaurants cap separate checks at 4–6. Group: assign one person to pay all and collect via Venmo." },
      { label: "Alcohol inclusion", value: "If one person drinks $40 in cocktails and others drink water, even splitting the alcohol is unfair. Separate the alcohol sub-total: total bill $240 includes $80 in drinks for 2 people. Each of the 8 pays $240/8 = $30, but the 2 drinkers should cover their $80." },
      { label: "Service charge awareness", value: "Some restaurants add a 'living wage' surcharge (3–5%) or 'kitchen appreciation' fee. These are not tips — they go to the restaurant. You still need to tip 15–20% on top. Ask your server if a service charge replaces the tip (very rare) or is extra (common)." },
    ]}
  },
  description: 'Split any restaurant or group bill evenly — enter the total, number of people, and tip percentage for instant per-person cost with and without tip.',
  formula: 'Per Person = (Bill + Bill x Tip%) / People',
  interpretation: 'A $75 dinner for 3 at 18% tip: $29.50 each. A $240 large group dinner for 8 at 20% tip: $36 each. A date-night $85 bill at 20% tip: $51 each. Splitwise tip: standard tip is 18–20% pre-tax; large parties check for auto-gratuity before adding extra tip.'
}

export default calcDef
