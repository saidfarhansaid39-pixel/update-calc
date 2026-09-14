import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wcWeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wcWeightUnit: z.string().min(1), wcMinutes: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wcPace: z.string().min(1) }),
  fields: [
    { name: 'wcWeight', label: 'Body Weight', type: 'number', min: 30, step: '10' },
    { name: 'wcWeightUnit', label: 'Weight Unit', type: 'select', options: [{ label: 'kg', value: 'kg' }, { label: 'lb', value: 'lb' }] },
    { name: 'wcMinutes', label: 'Walking Duration (min)', type: 'number', min: 1, step: '5' },
    { name: 'wcPace', label: 'Walking Pace', type: 'select', options: [{ label: 'Slow (2 mph / 3.2 kmh)', value: 'slow' }, { label: 'Moderate (3 mph / 4.8 kmh)', value: 'moderate' }, { label: 'Brisk (3.5 mph / 5.6 kmh)', value: 'brisk' }, { label: 'Fast (4 mph / 6.4 kmh)', value: 'fast' }] },
  ],
  defaults: { wcWeight: '70', wcWeightUnit: 'kg', wcMinutes: '30', wcPace: 'moderate' },
  presets: [
    { label: 'Morning Stroll (30 min)', values: { wcWeight: '70', wcWeightUnit: 'kg', wcMinutes: '30', wcPace: 'slow' } },
    { label: 'Daily Commute Walk', values: { wcWeight: '75', wcWeightUnit: 'kg', wcMinutes: '45', wcPace: 'moderate' } },
    { label: 'Power Walking Workout', values: { wcWeight: '68', wcWeightUnit: 'kg', wcMinutes: '60', wcPace: 'fast' } },
    { label: 'Weight Loss Walks', values: { wcWeight: '90', wcWeightUnit: 'kg', wcMinutes: '45', wcPace: 'brisk' } },
  ],
  compute: (v) => {
    const weightKg = v.wcWeightUnit === 'lb' ? v.wcWeight * 0.453592 : v.wcWeight
    const metValues: Record<string, number> = { slow: 2.8, moderate: 3.5, brisk: 4.3, fast: 5 }
    const met = metValues[v.wcPace] || 3.5
    const calories = met * 3.5 * weightKg / 200 * v.wcMinutes
    const paceSpeeds: Record<string, number> = { slow: 3.2, moderate: 4.8, brisk: 5.6, fast: 6.4 }
    const distanceKm = (paceSpeeds[v.wcPace] || 3.5) * v.wcMinutes / 60
    const distanceMi = distanceKm / 1.609
    const steps = Math.round(distanceKm * 1312)
    const caloriesPerHour = calories / v.wcMinutes * 60
    return { result: calories, label: 'Calories Burned', unit: 'kcal', steps: [{ label: 'Body Weight in kg', value: `${weightKg.toFixed(1)} kg` }, { label: 'Pace MET Value', value: `${v.wcPace} = ${met} MET` }, { label: 'Apply MET Formula', value: `${met} × 3.5 × ${weightKg.toFixed(1)} / 200 × ${v.wcMinutes}` }, { label: 'Calories Burned', value: `${calories.toFixed(0)} kcal (${caloriesPerHour.toFixed(0)} kcal/hr)` }, { label: 'Estimated Distance', value: `${distanceKm.toFixed(2)} km (${distanceMi.toFixed(2)} mi)` }, { label: 'Approximate Steps', value: `${steps} steps` }, { label: 'Calories per km', value: `${(calories / distanceKm).toFixed(0)} kcal/km` }] ,
    extras: [
      { label: 'Walking MET Values', value: 'Slow (2 mph) = 2.8 MET, Moderate (3 mph) = 3.5 MET, Brisk (3.5 mph) = 4.3 MET, Fast (4 mph) = 5.0 MET. Race walking (5+ mph) = 6.7 MET. For comparison: sitting = 1 MET, standing = 1.5 MET, jogging = 7-8 MET.' },
      { label: 'Weight & Calorie Relationship', value: 'Calories burned scales linearly with body weight. A 70 kg person burns 128 kcal walking 30 min at moderate pace. A 90 kg person burns 165 kcal — 29% more. Heavier individuals burn more calories per mile because they expend more energy moving mass.' },
      { label: '10,000 Steps Goal', value: '10,000 steps ≈ 8 km ≈ 5 miles. A 70 kg person walking at moderate pace burns ~350-400 kcal for 10,000 steps. Average walking speed: ~5 km/h (3 mph). 10,000 steps takes ~90 min. The 10k steps goal originated as a marketing campaign but has proven health benefits.' },
      { label: 'Walking After Meals', value: 'A 10-15 min walk after meals reduces blood sugar spikes by 20-30% in people with type 2 diabetes. Postprandial walking aids digestion and improves insulin sensitivity. Evening walks lower cortisol and improve sleep quality.' },
      { label: 'Incline Walking Bonus', value: 'Walking on a 5% incline increases calorie burn by ~50% vs flat terrain. A 10% incline doubles calorie burn. Walking stairs: 8-10 MET (nearly as intense as jogging). For the same duration, hilly routes burn significantly more calories than flat routes.' },
      { label: 'Walking vs Running Comparison', value: 'Walking burns ~80-100 kcal/mile regardless of pace (within moderate range). Running burns ~100-120 kcal/mile. The difference is time — running covers miles in half the time. Walking is lower impact, better for joints, and more sustainable for daily activity.' },
      { label: 'Health Benefits Beyond Calories', value: 'Regular walking reduces risk of: heart disease (31%), stroke (20%), type 2 diabetes (30%), dementia (40%), depression (26%), and all-cause mortality (20%). Just 20 min/day of brisk walking meets WHO physical activity guidelines for substantial health benefits.' },
    ]}
  },
  description: 'Calculate calories burned while walking based on body weight, duration, and pace. Uses ACSM MET values for accuracy, plus estimates distance traveled and step count for comprehensive activity tracking.',
  formula: 'Calories = MET × 3.5 × Weight(kg) ÷ 200 × Duration(min). MET values: Slow 2.8, Moderate 3.5, Brisk 4.3, Fast 5.0. Distance(km) = PaceSpeed(km/h) × Duration(min) ÷ 60. Steps = Distance(km) × 1,312 (avg stride ~762 mm).',
  interpretation: 'A 70 kg person walking 30 min at moderate pace (3.5 MET, 4.8 km/h) burns: 3.5 × 3.5 × 70 ÷ 200 × 30 = 128.6 kcal. They cover 2.4 km (1.5 mi) in 2,640 steps — burning ~53 kcal/km. Increasing to brisk pace (4.3 MET) for the same duration burns 158 kcal — a 23% increase with minimal extra effort. The American Heart Association recommends 150 min/week of moderate walking for cardiovascular health, which at moderate pace burns ~640 kcal/week. Adding incline, intervals, or longer duration progressively increases energy expenditure and fitness gains.'
}

export default calcDef
