import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const beverages: { label: string; mg: number }[] = [
  { label: 'Coffee (brewed, 240 ml)', mg: 95 },
  { label: 'Coffee (espresso, 30 ml)', mg: 63 },
  { label: 'Coffee (decaf, 240 ml)', mg: 5 },
  { label: 'Tea (black, 240 ml)', mg: 47 },
  { label: 'Tea (green, 240 ml)', mg: 28 },
  { label: 'Energy drink (250 ml)', mg: 80 },
  { label: 'Energy drink (500 ml)', mg: 160 },
  { label: 'Cola (355 ml)', mg: 34 },
  { label: 'Diet cola (355 ml)', mg: 46 },
  { label: 'Dark chocolate (50 g)', mg: 24 },
  { label: 'Milk chocolate (50 g)', mg: 9 },
]

const calcDef: CalcDef = {
  schema: z.object({ servings: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), caffeinePerServing: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bodyWeightCaf: z.string().min(1).refine(v => parseFloat(v) > 50, '>50') }),
  fields: [
    { name: 'servings', label: 'Servings Consumed', type: 'number', min: 1, step: '1' },
    { name: 'caffeinePerServing', label: 'Caffeine per Serving (mg)', type: 'number', min: 5, step: '10' },
    { name: 'bodyWeightCaf', label: 'Body Weight (lbs)', type: 'number', min: 50, step: '5' },
  ],
  defaults: { servings: '2', caffeinePerServing: '95', bodyWeightCaf: '150' },
  presets: [
    { label: '1 cup coffee (150 lbs)', values: { servings: '1', caffeinePerServing: '95', bodyWeightCaf: '150' } },
    { label: '2 cups coffee (150 lbs)', values: { servings: '2', caffeinePerServing: '95', bodyWeightCaf: '150' } },
    { label: 'Energy drink (150 lbs)', values: { servings: '1', caffeinePerServing: '160', bodyWeightCaf: '150' } },
    { label: '3 cups coffee (180 lbs)', values: { servings: '3', caffeinePerServing: '95', bodyWeightCaf: '180' } },
  ],
  compute: (v) => {
    const totalMg = v.servings * v.caffeinePerServing
    const bodyKg = v.bodyWeightCaf / 2.205
    const mgPerKg = totalMg / bodyKg
    const safe = totalMg <= 400
    const matched = beverages.find(b => Math.abs(b.mg - v.caffeinePerServing) < 5)
    const halfLife = 5
    const rem1h = totalMg * Math.pow(0.5, 1 / halfLife)
    const rem3h = totalMg * Math.pow(0.5, 3 / halfLife)
    const rem5h = totalMg * Math.pow(0.5, 5 / halfLife)
    const rem8h = totalMg * Math.pow(0.5, 8 / halfLife)
    const clearTime = halfLife * Math.log2(totalMg / 0.1)
    return {
      result: totalMg, label: 'Total Caffeine', unit: 'mg',
      steps: [
        { label: 'Total intake', value: `${totalMg} mg` },
        { label: 'Per kg body weight', value: `${mgPerKg.toFixed(1)} mg/kg` },
        { label: 'Status', value: safe ? 'Within safe range' : 'Exceeds FDA 400 mg/day limit' },
        { label: 'Remaining after 1 h', value: `${rem1h.toFixed(1)} mg (${((rem1h / totalMg) * 100).toFixed(0)}%)` },
        { label: 'Remaining after 3 h', value: `${rem3h.toFixed(1)} mg (${((rem3h / totalMg) * 100).toFixed(0)}%)` },
        { label: 'Remaining after 5 h', value: `${rem5h.toFixed(1)} mg (${((rem5h / totalMg) * 100).toFixed(0)}%)` },
        { label: 'Remaining after 8 h', value: `${rem8h.toFixed(1)} mg (${((rem8h / totalMg) * 100).toFixed(0)}%)` },
      ],
      extras: [
        { label: 'Total caffeine', value: totalMg + ' mg' },
        { label: 'Per kg body weight', value: mgPerKg.toFixed(1) + ' mg/kg' },
        { label: 'Closest beverage match', value: matched ? matched.label : 'Custom' },
        { label: 'FDA limit', value: '≤400 mg/day for healthy adults (≈4 cups coffee)' },
        { label: 'Status', value: safe ? '✔ Within safe range' : '✗ Exceeds 400 mg/day limit' },
        { label: 'Safe bedtime cutoff', value: `Avoid caffeine ${clearTime > 6 ? '6+' : clearTime.toFixed(0)} hours before bed` },
        { label: 'Total clearance (~99.9%)', value: clearTime.toFixed(1) + ' hours' },
        { label: 'Pregnancy note', value: 'Half-life doubles (up to 10+ h). Limit to 200 mg/day.' },
        { label: 'Half-life varies', value: '3-7 h (adults), longer in pregnancy, shorter in smokers (3 h)' },
        { label: 'Safe single dose', value: '≤200 mg per serving or ≤10 mg/kg body weight' },
      ],
    }
  },
  description: 'Track your daily caffeine intake compared to recommended limits. Includes beverage database, half-life clearance curve, and safe timing.',
  formula: 'Total = Servings × mg/Serving | mg/kg = Total / (Weight(lbs)/2.205) | Remaining = D₀ × 2^(-t/5)',
  interpretation: 'FDA recommends ≤400 mg/day (∼4 cups coffee). Half-life ~5 h. Avoid caffeine 6+ h before bed. Single dose >200 mg or >10 mg/kg can cause anxiety.'
}

export default calcDef
