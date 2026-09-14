import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ drinks: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), hours: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'), weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), gender: z.string().min(1, 'Required') }),
  fields: [
    { name: 'drinks', label: 'Number of Drinks', type: 'number', min: 0, step: '0.5' },
    { name: 'hours', label: 'Hours Spent Drinking', type: 'number', min: 0, step: '0.5' },
    { name: 'weight', label: 'Body Weight (lbs)', type: 'number', min: 50, step: '5' },
    { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
  ],
  defaults: { drinks: '3', hours: '2', weight: '170', gender: 'male' },
  presets: [
    { label: 'Light Evening (3 drinks)', values: { drinks: '3', hours: '2', weight: '170', gender: 'male' } },
    { label: 'Night Out (5 drinks)', values: { drinks: '5', hours: '4', weight: '150', gender: 'female' } },
    { label: 'Happy Hour (2 drinks)', values: { drinks: '2', hours: '1', weight: '180', gender: 'male' } },
  ],
  compute: (v) => {
    const totalAlcohol = v.drinks * 0.6
    const distribRatio = v.gender === 'male' ? 0.68 : 0.55
    const numerator = totalAlcohol * 5.14
    const denominator = v.weight * distribRatio
    const elimination = v.hours * 0.015
    const bac = (numerator / denominator) - elimination
    const safeBac = Math.max(0, bac)
    const hoursToZero = safeBac / 0.015
    return { result: safeBac, label: 'Estimated BAC', unit: '%', steps: [
      { label: '1. Total pure alcohol', value: `${v.drinks} drinks × 0.6 oz = ${totalAlcohol.toFixed(1)} oz ethanol` },
      { label: '2. Widmark distribution ratio', value: `r = ${distribRatio.toFixed(2)} (${v.gender === 'male' ? '0.68 male' : '0.55 female'})` },
      { label: '3. Numerator', value: `${totalAlcohol.toFixed(1)} oz × 5.14 = ${numerator.toFixed(2)}` },
      { label: '4. Denominator', value: `${v.weight} lbs × ${distribRatio.toFixed(2)} = ${denominator.toFixed(1)}` },
      { label: '5. Raw BAC before elimination', value: `${numerator.toFixed(2)} ÷ ${denominator.toFixed(1)} = ${(numerator/denominator).toFixed(4)}` },
      { label: '6. Elimination (0.015/hr)', value: `${v.hours} hrs × 0.015 = ${elimination.toFixed(3)}` },
      { label: '7. Final BAC', value: `${(numerator/denominator).toFixed(4)} - ${elimination.toFixed(3)} = ${safeBac.toFixed(3)}%` },
      { label: '8. Time to sober', value: `${safeBac.toFixed(3)}% ÷ 0.015/hr = ${hoursToZero.toFixed(1)} hours` },
    ] ,
    extras: [
      { label: "Legal Limit", value: "BAC ≥ 0.08% is legally impaired in all 50 US states. Commercial drivers: 0.04%. Under 21: zero tolerance (0.00-0.02%)." },
      { label: "Food Matters", value: "Eating before/during drinking slows alcohol absorption by 25-40%. A full stomach significantly reduces peak BAC." },
      { label: "Hydration", value: "Drink one glass of water per alcoholic beverage. Alcohol is a diuretic and dehydration worsens hangover symptoms." },
      { label: "One Per Hour Myth", value: "The liver metabolizes ~1 standard drink per hour, but BAC depends on weight, gender, food, and metabolism. Never assume you're sober enough to drive." },
      { label: "Standard Drink Sizes", value: "12 oz beer (5% ABV) = 5 oz wine (12%) = 1.5 oz liquor (40%). Mixed drinks and craft beers often contain 2-3 standard drinks each." },
      { label: "Gender Difference", value: "Women typically have lower body water percentage (55% vs 68%), leading to higher BAC with the same number of drinks. This is biological, not related to tolerance." },
      { label: "Zero Tolerance", value: "Even at 0.02-0.04% BAC, reaction time slows and judgment is impaired. The safest BAC for driving is 0.00%." },
      { label: "Plan Ahead", value: "Designate a sober driver, use rideshare, or have a backup plan. A taxi/rideshare costs far less than a DUI ($10,000+)." },
    ]}
  },
  description: 'Estimate blood alcohol concentration (BAC) using the Widmark formula based on drinks consumed, time elapsed, body weight, and gender. Includes time-to-sober estimate.',
  formula: 'BAC = ((Drinks × 0.6 × 5.14) ÷ (Weight × r)) - (Hours × 0.015), where r = 0.68 (male) or 0.55 (female)',
  interpretation: 'BAC ≥ 0.08% is legally impaired. Time to sober = BAC ÷ 0.015. One drink per hour maintains current BAC. Eat food, hydrate, and always plan a safe ride home.'
}

export default calcDef
