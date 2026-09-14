import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ numDrinks: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), drinkingHours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), bodyWeight: z.string().min(1).refine(v => parseFloat(v) > 50, '>50'), bioSex: z.string().min(1) }),
  fields: [
    { name: 'numDrinks', label: 'Number of Drinks', type: 'number', min: 0.5, step: '0.5' },
    { name: 'drinkingHours', label: 'Hours Drinking', type: 'number', min: 0, step: '0.5' },
    { name: 'bodyWeight', label: 'Body Weight (lbs)', type: 'number', min: 50, step: '5' },
    { name: 'bioSex', label: 'Biological Sex', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
  ],
  defaults: { numDrinks: '4', drinkingHours: '3', bodyWeight: '180', bioSex: 'male' },
  presets: [
    { label: 'Typical Night Out', values: { numDrinks: '5', drinkingHours: '4', bodyWeight: '180', bioSex: 'male' } },
    { label: 'Light Social Drinker', values: { numDrinks: '2', drinkingHours: '2', bodyWeight: '140', bioSex: 'female' } },
    { label: 'Heavy Evening', values: { numDrinks: '8', drinkingHours: '5', bodyWeight: '200', bioSex: 'male' } },
    { label: 'One Drink per Hour', values: { numDrinks: '4', drinkingHours: '4', bodyWeight: '160', bioSex: 'male' } },
  ],
  compute: (v) => {
    const alcoholOz = v.numDrinks * 0.6
    const r = v.bioSex === 'male' ? 0.68 : 0.55
    const bac = ((alcoholOz * 5.14) / (v.bodyWeight * r)) - (v.drinkingHours * 0.015)
    const safeBac = Math.max(0, bac)
    const hoursToSober = safeBac / 0.015
    const legalLimit = safeBac >= 0.08
    const impairment = safeBac < 0.02 ? 'Minimal' : safeBac < 0.05 ? 'Mild' : safeBac < 0.08 ? 'Impaired' : safeBac < 0.15 ? 'Significant' : 'Severe'
    return {
      result: safeBac, label: 'Blood Alcohol Content', unit: '%',
      steps: [
        { label: 'Standard Drinks Consumed', value: `${v.numDrinks}` },
        { label: 'Pure Alcohol Intake', value: `${alcoholOz.toFixed(1)} oz` },
        { label: 'Widmark r-Factor', value: v.bioSex === 'male' ? '0.68 (male)' : '0.55 (female)' },
        { label: 'Raw BAC (pre-metabolism)', value: `${((alcoholOz * 5.14) / (v.bodyWeight * r)).toFixed(3)}%` },
        { label: 'Metabolism Deduction', value: `-${(v.drinkingHours * 0.015).toFixed(3)}% (${v.drinkingHours} hrs × 0.015/hr)` },
        { label: 'Estimated BAC', value: `${safeBac.toFixed(3)}%` },
        { label: 'Impairment Level', value: impairment },
        { label: 'Time to Full Sobriety', value: `${hoursToSober.toFixed(1)} hrs (at 0.015%/hr metabolism)` },
      ],
      extras: [
        { label: 'Legal Limit Warning', value: legalLimit ? 'Your BAC exceeds the 0.08% legal limit. DO NOT DRIVE. Arrange alternate transportation.' : 'Your BAC is below the 0.08% legal limit, but any alcohol impairs driving ability.' },
        { label: 'Standard Drink Definition', value: 'One standard drink = 0.6 oz pure alcohol: 12 oz beer (5% ABV), 5 oz wine (12% ABV), or 1.5 oz spirits (40% ABV). Mixed drinks often contain 2-3 standard drinks.' },
        { label: 'Metabolism Factors', value: 'The body metabolizes ~0.015% BAC per hour regardless of coffee, cold showers, or food. Only time reduces BAC. On average, it takes 1.5-2 hours per drink to reach zero.' },
        { label: 'Factors Increasing BAC', value: 'Female sex, lower body weight, empty stomach, carbonated mixers, higher ABV drinks, fatigue, and certain medications all increase peak BAC.' },
        { label: 'Consequences by BAC Level', value: '0.02-0.04%: Mild relaxation. 0.05-0.07%: Euphoria, impaired judgment. 0.08-0.12%: Poor coordination, slurred speech. 0.15-0.25%: Vomiting, blackouts. >0.30%: Alcohol poisoning risk.' },
        { label: 'DUI Penalty Reference', value: 'First offense DUI: $5,000-$15,000 total cost (fines, legal fees, insurance hikes, license suspension). Some states have aggravated DUI thresholds at 0.15% BAC.' },
        { label: 'Safe Drinking Guidelines', value: 'NIAAA: Men ≤4 drinks/day, ≤14/week. Women ≤3/day, ≤7/week. Pace at ≤1 drink per hour. Alternate with water or non-alcoholic beverages.' },
        { label: 'Zero Tolerance for Under 21', value: 'In all US states, any measurable BAC (0.01-0.02%) for drivers under 21 results in license suspension and fines. Some states impose immediate vehicle impoundment.' },
      ]
    }
  },
  description: 'Estimate your blood alcohol concentration (BAC) using the Widmark formula. Enter drinks consumed, drinking duration, body weight, and biological sex. Understand your impairment level and time to sobriety.',
  formula: 'BAC = ((Drinks × 0.6 × 5.14) / (Weight × r)) - (Hours × 0.015), where r = 0.68 for males, 0.55 for females',
  interpretation: 'Legal driving limit in most US states: 0.08%. At 0.02-0.04%: mild relaxation. At 0.05-0.08%: impaired judgment and coordination. At 0.08-0.15%: significant impairment. At >0.15%: severe intoxication. The body metabolizes ~0.015% BAC per hour regardless of interventions. Plan ahead: arrange a designated driver or rideshare.'
}

export default calcDef
