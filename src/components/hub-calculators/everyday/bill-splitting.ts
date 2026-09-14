import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bsplTotal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bsplPeople: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), bsplTipPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), bsplTaxPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), bsplRoundUp: z.string().min(1) }),
  fields: [
    { name: 'bsplTotal', label: 'Bill Total ($)', type: 'number', min: 1, step: '10' },
    { name: 'bsplPeople', label: 'Number of People', type: 'number', min: 1, step: '1' },
    { name: 'bsplTipPct', label: 'Tip (%)', type: 'number', min: 0, max: 30, step: '1' },
    { name: 'bsplTaxPct', label: 'Tax Rate (%)', type: 'number', min: 0, max: 15, step: '0.5' },
    { name: 'bsplRoundUp', label: 'Round Up', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
  ],
  defaults: { bsplTotal: '85', bsplPeople: '4', bsplTipPct: '18', bsplTaxPct: '8.5', bsplRoundUp: 'yes' },
  presets: [
    { label: 'Family Dinner', values: { bsplTotal: '95', bsplPeople: '4', bsplTipPct: '18', bsplTaxPct: '8', bsplRoundUp: 'yes' } },
    { label: 'Friends Night Out', values: { bsplTotal: '180', bsplPeople: '6', bsplTipPct: '20', bsplTaxPct: '9', bsplRoundUp: 'yes' } },
    { label: 'Business Lunch', values: { bsplTotal: '140', bsplPeople: '5', bsplTipPct: '15', bsplTaxPct: '7', bsplRoundUp: 'no' } },
    { label: 'Solo Treat (1 person)', values: { bsplTotal: '45', bsplPeople: '1', bsplTipPct: '20', bsplTaxPct: '8.5', bsplRoundUp: 'yes' } },
  ],
  compute: (v) => {
    const tax = v.bsplTotal * (v.bsplTaxPct / 100)
    const subtotal = v.bsplTotal + tax
    const tip = subtotal * (v.bsplTipPct / 100)
    const total = subtotal + tip
    let perPerson = total / v.bsplPeople
    if (v.bsplRoundUp === 'yes') { perPerson = Math.ceil(perPerson * 100) / 100 }
    return { result: perPerson, label: 'Per Person', unit: '$', steps: [
      { label: 'Pre-Tax Bill', value: `$${v.bsplTotal.toFixed(2)}` },
      { label: 'Sales Tax', value: `$${v.bsplTotal.toFixed(2)} x ${v.bsplTaxPct}% = $${tax.toFixed(2)}` },
      { label: 'Subtotal after Tax', value: `$${v.bsplTotal.toFixed(2)} + $${tax.toFixed(2)} = $${subtotal.toFixed(2)}` },
      { label: 'Tip on Subtotal', value: `$${subtotal.toFixed(2)} x ${v.bsplTipPct}% = $${tip.toFixed(2)}` },
      { label: 'Grand Total', value: `$${subtotal.toFixed(2)} + $${tip.toFixed(2)} = $${total.toFixed(2)}` },
      { label: 'Even Split', value: `$${total.toFixed(2)} ÷ ${v.bsplPeople} = $${(total / v.bsplPeople).toFixed(2)} each${v.bsplRoundUp === 'yes' ? ' (rounded up to nearest cent)' : ''}` },
    ] ,
    extras: [
      { label: "Tip on pre-tax vs post-tax", value: "This calculator tips on the pre-tax subtotal (standard etiquette). Some groups prefer tipping on the post-tax total. To replicate: set Tax Rate = 0% and include estimated tax in the bill total. Standard tip: 15% for good, 18% for great, 20%+ for exceptional service." },
      { label: "Round-up rationale", value: "Rounding up to the nearest cent ($36.24 → $36.24 with 'No', or $36.25 with 'Yes') makes collection easier. For Venmo/Zelle, exact amounts are fine. For cash, round up to the nearest dollar — the difference is a few cents per person and simplifies payment." },
      { label: "Tax rate by location", value: "Sales tax ranges from 0% (DE, MT, NH, OR) to ~10.25% (Chicago, IL). Restaurant tax includes state + local + county rates. Check your receipt — most show the effective tax rate. Common: 6–9% for most US locations. This calculator lets you input your exact rate." },
      { label: "Large party auto-gratuity", value: "Many restaurants add 18% gratuity for parties of 6+ or 8+. Check the bottom of your receipt for 'service charge' or 'gratuity included'. If auto-gratuity is applied, you can reduce your additional tip to 3–5% or $0 if the service included tip." },
      { label: "Itemized vs even split guide", value: "Even split: everyone ordered similar entrees, shared apps. Itemized split: one person ordered expensive items/significant dietary difference. Middle ground: even split the app/ drinks, then each pays their own entree. Example: $60 app+drinks split 4 ways ($15), + $25 entree = $40 each." },
      { label: "Venmo/Zelle payment etiquette", value: "Send payment immediately or within 1 hour of the meal. Use a clear memo: 'Dinner 3/15 - [restaurant name]'. If you owe $36.25, sending $36 or $37 is fine — friends round. For group trips or regular dining groups, use Splitwise to track a running balance." },
      { label: "Tax-deductible business meals", value: "Business meals (with clients) are 50% deductible in the US. Keep the receipt showing: date, amount, names, business purpose. This calculator helps you separate business vs personal portions if mixing. For a $140 business lunch, the deductible portion = $70." },
      { label: "International tipping customs", value: "US/Canada: 15–20% standard. UK/Europe: 5–10% if service charge not included (check menu). Australia/NZ: tipping not expected (10% for exceptional). Japan/South Korea: tipping is rude — excellent service is standard. Mexico/Caribbean: 10–15% (verify if included)." },
    ]}
  },
  description: 'Split restaurant bills with precision — includes pre-tax total, sales tax rate, tip percentage, optional round-up to nearest cent. Per-person breakdown at every step.',
  formula: 'Per Person = (Bill + Bill x Tax% + (Bill + Bill x Tax%) x Tip%) / People | Rounded up to nearest cent if selected',
  interpretation: 'An $85 dinner for 4 at 8.5% tax and 18% tip: ~$27.71 per person ($110.84 total) with round-up. A $180 night out for 6 at 9% tax and 20% tip: ~$38.86 each ($233.16 total). Separating tax and tip gives true per-person transparency vs most calculators that lump everything together.'
}

export default calcDef
