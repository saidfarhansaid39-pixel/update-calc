import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), reps: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sets: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), metValue: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  defaults: { weight: '35', reps: '15', sets: '4', metValue: '8' },
  presets: [
    { label: 'Swings (Moderate)', values: { weight: '35', reps: '20', sets: '4', metValue: '8' } },
    { label: 'Light Warmup', values: { weight: '18', reps: '10', sets: '3', metValue: '5' } },
    { label: 'Hard Interval', values: { weight: '53', reps: '12', sets: '5', metValue: '10.5' } },
  ],
  fields: [
    { name: 'weight', label: 'Kettlebell Weight (lb)', type: 'number', min: 1, step: '5' },
    { name: 'reps', label: 'Reps per Set', type: 'number', min: 1, step: '5' },
    { name: 'sets', label: 'Number of Sets', type: 'number', min: 1, step: '1' },
    { name: 'metValue', label: 'MET Value', type: 'number', min: 1, step: '0.5' },
  ],
  compute: (v) => {
    const W = parseFloat(v.weight)||0; const R = parseFloat(v.reps)||0; const S = parseFloat(v.sets)||0; const MET = parseFloat(v.metValue)||0
    const totalReps = R * S
    const totalVolume = W * totalReps
    const calPerRep = (MET * 3.5 * 70) / 200 / 60 * 1.5
    const caloriesBurned = calPerRep * totalReps
    return { result: totalVolume, label: 'Total Volume Lifted', unit: 'lb', steps: [
      { label: '1. Total Reps', value: `${R} × ${S} = ${totalReps}` },
      { label: '2. Total Volume', value: `${W} lb × ${totalReps} = ${totalVolume.toFixed(0)} lb` },
      { label: '3. MET Reference', value: `${MET} — ${MET < 6 ? 'light' : MET < 9 ? 'moderate' : 'vigorous'} intensity` },
      { label: '4. Cal Per Rep Formula', value: `(${MET} × 3.5 × 70kg) / 200 / 60 × 1.5s = ${calPerRep.toFixed(4)} kcal/rep` },
      { label: '5. Calories Burned', value: `${calPerRep.toFixed(4)} × ${totalReps} = ${caloriesBurned.toFixed(0)} kcal` },
    ] ,
    extras: [
      { label: 'Kettlebell Sizing Guide', value: 'Men: 35 lb (16 kg) for swings, 53 lb (24 kg) for advanced. Women: 18 lb (8 kg) beginner, 26 lb (12 kg) intermediate, 35 lb (16 kg) advanced.' },
      { label: 'MET Intensity Levels', value: 'MET 5: kettlebell swings (light effort) = ~7 kcal/min. MET 8: moderate swings = ~11 kcal/min. MET 10.5: vigorous = ~15 kcal/min for a 70kg person.' },
      { label: 'Training Structure', value: 'KB swings: 3-5 sets of 10-20 reps. Rest 30-60 sec between sets. Turkish get-ups: 3-5 reps per side. Clean & press: 5-8 reps per side. Goblet squats: 10-15 reps.' },
      { label: 'Form First', value: 'Kettlebell swings are hip-driven, not arm-driven. Hinge at hips, engage glutes and core. Rounding the lower back is the #1 cause of injury. Start with 10 reps and perfect form before increasing weight.' },
      { label: 'Calorie Comparison', value: 'KB swings (MET 8) burn ~11 kcal/min = 330 kcal/30 min. Running (6 mph, MET 10) = ~15 kcal/min. Rowing (MET 7) = ~9 kcal/min. Jump rope (MET 11) = ~16 kcal/min.' },
      { label: 'Weekly Programming', value: 'Full-body KB training 3-4×/week with rest days between. A typical session: warmup (5 min), swings (15 min), strength moves (15 min), finisher (5 min).' },
      { label: 'Russian vs American Swings', value: 'Russian swings go to chest height (less shoulder stress, better for high reps). American swings go overhead (greater ROM, more rotator cuff risk). Russian is preferred for volume training.' },
      { label: 'Equipment Cost', value: 'Cast iron kettlebells: $1-2/lb. Competition kettlebells: $2-3/lb. Adjustable competition bells: $150-300 (replaces 4+ bells). A full set (18, 26, 35, 44, 53 lb): $150-250.' },
    ]}
  },
  description: 'Calculate total kettlebell training volume (weight × reps × sets) and estimate calories burned based on MET values. Includes sizing guide, intensity levels, and programming tips.',
  formula: 'Volume = Weight(lb) × Reps × Sets. Calories = (MET × 3.5 × 70kg) / 200 × Time(min). Time(min) = Reps × Sets × 1.5s/rep / 60.',
  interpretation: 'MET values: 5.0 (light swings), 8.0 (moderate), 10.5 (vigorous). A 35 lb kettlebell swing at MET 8 burns ~11 kcal/min for a 70kg person. 100 swings (4 sets × 25) = 50-70 kcal. The hip hinge is the most important movement pattern — protect your lower back.'
}

export default calcDef
