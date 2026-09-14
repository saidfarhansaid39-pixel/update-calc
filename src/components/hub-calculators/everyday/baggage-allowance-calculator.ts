import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bagCarryOn: z.string().min(1), bagChecked: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), bagWeightLb: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bagAirline: z.string().min(1), bagPassengers: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'bagCarryOn', label: 'Carry-On Policy', type: 'select', options: [{ label: 'Personal Item Only', value: 'personal' }, { label: '1 Carry-On + Personal', value: 'standard' }, { label: '2 Carry-On Items', value: 'two' }] },
    { name: 'bagChecked', label: 'Checked Bags (total)', type: 'number', min: 0, step: '1' },
    { name: 'bagWeightLb', label: 'Heaviest Bag Weight (lbs)', type: 'number', min: 10, step: '5' },
    { name: 'bagAirline', label: 'Airline', type: 'select', options: [{ label: 'Spirit/Frontier', value: 'ultra' }, { label: 'United/Delta/American', value: 'legacy' }, { label: 'Southwest', value: 'southwest' }, { label: 'International', value: 'intl' }] },
    { name: 'bagPassengers', label: 'Passengers', type: 'number', min: 1, step: '1' },
  ],
  defaults: { bagCarryOn: 'standard', bagChecked: '1', bagWeightLb: '40', bagAirline: 'legacy', bagPassengers: '1' },
  presets: [
    { label: 'Weekend Trip (Spirit)', values: { bagCarryOn: 'personal', bagChecked: '1', bagWeightLb: '35', bagAirline: 'ultra', bagPassengers: '1' } },
    { label: 'Family Vacation (United)', values: { bagCarryOn: 'standard', bagChecked: '4', bagWeightLb: '45', bagAirline: 'legacy', bagPassengers: '2' } },
    { label: 'Southwest Free Checked', values: { bagCarryOn: 'standard', bagChecked: '2', bagWeightLb: '48', bagAirline: 'southwest', bagPassengers: '1' } },
    { label: 'Overseas Trip (Intl)', values: { bagCarryOn: 'standard', bagChecked: '2', bagWeightLb: '55', bagAirline: 'intl', bagPassengers: '1' } },
  ],
  compute: (v) => {
    const weightLimit = 50
    let overweightFee = 0
    if (v.bagWeightLb > weightLimit) { overweightFee = Math.ceil((v.bagWeightLb - weightLimit) / 10) * 50 }
    const bagFees: Record<string, { first: number; second: number }> = { ultra: { first: 40, second: 55 }, legacy: { first: 35, second: 45 }, southwest: { first: 0, second: 0 }, intl: { first: 0, second: 100 } }
    const fee = bagFees[v.bagAirline] || bagFees.legacy
    let checkedFees = 0
    let remaining = v.bagChecked
    if (v.bagAirline !== 'southwest' && v.bagAirline !== 'intl') {
      if (remaining > 0) { checkedFees += fee.first; remaining -= 1 }
      if (remaining > 0) { checkedFees += fee.second * remaining }
    } else if (v.bagAirline === 'intl') {
      if (remaining > 1) { checkedFees += (remaining - 1) * fee.second }
    }
    const totalFees = (checkedFees + overweightFee) * v.bagPassengers
    const perPax = checkedFees + overweightFee
    return { result: totalFees, label: 'Total Baggage Fees', unit: '$', steps: [
      { label: 'Checked Bag Fee', value: `${v.bagChecked} bags → $${checkedFees.toFixed(2)} (${v.bagAirline} rates)` },
      { label: 'Overweight Penalty', value: `${v.bagWeightLb} lbs > ${weightLimit} lbs limit → $${overweightFee.toFixed(2)} ($50 per 10 lbs over)` },
      { label: 'Fees per Passenger', value: `$${checkedFees.toFixed(2)} + $${overweightFee.toFixed(2)} = $${perPax.toFixed(2)}` },
      { label: 'Total for All Passengers', value: `$${perPax.toFixed(2)} x ${v.bagPassengers} pax = $${totalFees.toFixed(2)}` },
      { label: 'Carry-On Policy', value: `${v.bagCarryOn === 'personal' ? 'Personal item only — no full carry-on allowed' : v.bagCarryOn === 'standard' ? '1 carry-on + 1 personal item included' : '2 carry-on items allowed'}` },
      { label: 'Baggage Allowance', value: `${v.bagChecked} checked bags, max ${weightLimit} lbs each before overweight fees apply` },
    ] ,
    extras: [
      { label: "Airline baggage fee cheat sheet", value: "Spirit/Frontier: personal item free, carry-on $35–60 at gate, first checked $40, second $55. United/Delta/AA: carry-on free, first checked $35, second $45. Southwest: 2 checked bags free. International: first free, second $100." },
      { label: "Overweight bag strategy", value: "50 lb limit per bag. 51–70 lbs: $50–100 fee. 71+ lbs: $100–200+ (some airlines refuse). Use a luggage scale ($10–15) at home. If over 50 lbs, move items to a second bag: cheaper to check a second bag ($35–45) than pay overweight ($50–100)." },
      { label: "Carry-on sizing tricks", value: "Ultra-low carriers use smaller sizers (22x14x9 vs 22x14x9 for legacies). Personal item: 18x14x8. A soft-sided duffel squeezes into tight sizers better than hard-shell. Wear your bulkiest items (jacket, boots) through security to free up bag space." },
      { label: "Credit card fee waivers", value: "Airlines cards (United Explorer, Delta Gold, Citi AAdvantage) give first checked bag free for you + 1 companion. Annual fee ($95–99) is worth it if you check bags 2+ times/year. Southwest card gets you 7,500 bonus miles = ~1 free checked bag." },
      { label: "Family baggage pooling", value: "One person carries everyone's checked bags. Example: a family of 4 checks 4 bags under 1 passenger ticket — each gets tracked by a unique tag. Some airlines allow family pooling to share the first-bag-free benefit." },
      { label: "International baggage rules", value: "Intl flights: economy often includes 1 free checked bag (23 kg/50 lbs), second $100–150. Business: 2 free bags at 32 kg/70 lbs each. Excess weight: $100–500 per bag depending on route. Weight limits are strictly enforced on international carriers." },
      { label: "Gate checking", value: "If overhead bins are full, you may gate-check your carry-on for free. Pro: no baggage fee. Con: bag goes to the hold, risks being separated. Always keep valuables and medications in your personal item." },
      { label: "Prepaid vs at-airport pricing", value: "Prepaying for checked bags online saves $5–10 per bag vs paying at the airport. On Spirit/Frontier, paying at the gate (after check-in) costs $10–20 more than online. Check in 24 hrs ahead and add bags during online check-in." },
    ]}
  },
  description: 'Calculate total baggage fees for any airline — factor in carry-on policy, checked bags, overweight penalties, and passenger count. Compare Spirit/Frontier to legacy carriers, Southwest, and international.',
  formula: 'Fees = (BagRate1 + BagRate2 x (Bags-1) + OverweightFee) x Passengers | Overweight = Ceil((Weight-50)/10) x $50',
  interpretation: 'A weekend trip on Spirit with 1 checked bag at 35 lbs: $40 total. A family vacation on United with 4 checked bags, 2 passengers: $140 total ($35 first + $45 second x 3). Southwest with 2 free checked bags: $0 total. Overweight fees double these numbers.'
}

export default calcDef
