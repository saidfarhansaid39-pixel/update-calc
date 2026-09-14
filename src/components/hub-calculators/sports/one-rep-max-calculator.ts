import { z } from 'zod'
import { oneRmSchema } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const zones = [
  { name: 'Max effort / 1RM', pct: '100%', min: 0.95, max: 1.00, repRange: '1' },
  { name: 'Strength', pct: '85-95%', min: 0.85, max: 0.95, repRange: '2-4' },
  { name: 'Strength-Power', pct: '75-85%', min: 0.75, max: 0.85, repRange: '3-5' },
  { name: 'Hypertrophy', pct: '67-75%', min: 0.67, max: 0.75, repRange: '8-12' },
  { name: 'Muscular endurance', pct: '50-67%', min: 0.50, max: 0.67, repRange: '15-20+' },
  { name: 'Warm-up / technique', pct: '<50%', min: 0, max: 0.50, repRange: 'N/A' },
]

function wilks(bodyKg: number, liftKg: number, gender: 'male' | 'female'): number {
  const c = gender === 'male'
    ? [-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863e-6, -1.291e-8]
    : [594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 4.731582e-5, -9.054e-8]
  const [a, b, c1, d, e, f] = c
  const denom = a + b * bodyKg + c1 * bodyKg ** 2 + d * bodyKg ** 3 + e * bodyKg ** 4 + f * bodyKg ** 5
  return liftKg * 500 / denom
}

const calcDef: CalcDef = {
  schema: oneRmSchema.extend({ bodyWeight: z.string().optional(), gender: z.string().optional() }),
  fields: [
    { name: 'weight', label: 'Lift Weight', type: 'number', unit: 'kg', min: 1, step: '0.5' },
    { name: 'reps', label: 'Reps Performed', type: 'number', min: 1, max: 30, step: '1' },
    { name: 'bodyWeight', label: 'Body Weight (optional)', type: 'number', unit: 'kg', min: 30, step: '1' },
    { name: 'gender', label: 'Gender (for Wilks)', type: 'select', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }] },
  ],
  defaults: { weight: '80', reps: '5', bodyWeight: '75', gender: 'male' },
  presets: [
    { label: 'Bench (80 kg × 5)', values: { weight: '80', reps: '5', bodyWeight: '75', gender: 'male' } },
    { label: 'Squat (100 kg × 8)', values: { weight: '100', reps: '8', bodyWeight: '80', gender: 'male' } },
    { label: 'Deadlift (140 kg × 3)', values: { weight: '140', reps: '3', bodyWeight: '85', gender: 'male' } },
    { label: 'OHP (50 kg × 6)', values: { weight: '50', reps: '6', bodyWeight: '75', gender: 'male' } },
  ],
  compute: (v) => {
    const epley = v.weight * (1 + v.reps / 30)
    const brzycki = v.weight * (36 / (37 - v.reps))
    const lombardi = v.weight * Math.pow(v.reps, 0.1)
    const avg = (epley + brzycki + lombardi) / 3
    const bwVal = v.bodyWeight ? parseFloat(v.bodyWeight) : 0
    const gen = (v.gender as 'male' | 'female') || 'male'
    const wilksScore = bwVal > 0 ? Math.round(wilks(bwVal, avg, gen)) : undefined

    return {
      result: avg, label: 'Estimated 1RM', unit: 'kg',
      steps: [
        { label: 'Weight used', value: `${v.weight} kg` },
        { label: 'Reps completed', value: `${v.reps}` },
        { label: 'Epley: W × (1 + R/30)', value: `${epley.toFixed(1)} kg` },
        { label: 'Brzycki: W × 36/(37-R)', value: `${brzycki.toFixed(1)} kg` },
        { label: 'Lombardi: W × R^0.1', value: `${lombardi.toFixed(1)} kg` },
        { label: 'Average 1RM', value: `${avg.toFixed(1)} kg` },
        ...(wilksScore ? [{ label: 'Wilks coefficient', value: `${wilksScore}` }] : []),
      ],
      extras: [
        { label: 'Epley 1RM', value: epley.toFixed(1) + ' kg' },
        { label: 'Brzycki 1RM', value: brzycki.toFixed(1) + ' kg' },
        { label: 'Lombardi 1RM', value: lombardi.toFixed(1) + ' kg' },
        { label: 'Average 1RM', value: avg.toFixed(1) + ' kg' },
        ...(wilksScore ? [{ label: 'Wilks coefficient', value: wilksScore.toFixed(1) }] : []),
        { label: 'Strength zone (85-95%)', value: `${(avg * 0.85).toFixed(1)}-${(avg * 0.95).toFixed(1)} kg × ${zones[1].repRange} reps` },
        { label: 'Hypertrophy zone (67-75%)', value: `${(avg * 0.67).toFixed(1)}-${(avg * 0.75).toFixed(1)} kg × ${zones[3].repRange} reps` },
        { label: 'Endurance zone (50-67%)', value: `${(avg * 0.50).toFixed(1)}-${(avg * 0.67).toFixed(1)} kg × ${zones[4].repRange} reps` },
        { label: 'Strength standard', value: 'Bench 1× BW = good. 1.5× BW = advanced. 2× BW = elite.' },
        { label: 'Progression tip', value: 'Add 2.5-5 kg per week. Deload every 4-6 weeks. Prioritize form.' },
        { label: 'Training tip', value: 'Track progress consistently rather than comparing single measurements.' },
      ],
    }
  },
  description: 'Estimate your one-rep max using Epley, Brzycki, and Lombardi formulas. Includes training zones, optional Wilks coefficient, and strength standards.'
}

export default calcDef
