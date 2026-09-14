import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weightCal: z.string().min(1).refine(v => parseFloat(v) > 50, '>50'), metValue: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), durationMin: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'weightCal', label: 'Body Weight (lbs)', type: 'number', min: 50, step: '5' },
    { name: 'metValue', label: 'MET Value of Activity', type: 'number', min: 1, max: 20, step: '0.5' },
    { name: 'durationMin', label: 'Duration (minutes)', type: 'number', min: 1, step: '5' },
  ],
  defaults: { weightCal: '180', metValue: '6', durationMin: '30' },
  presets: [
    { label: 'Running (6 mph)', values: { weightCal: '180', metValue: '9.8', durationMin: '30' } },
    { label: 'Brisk Walking (3 mph)', values: { weightCal: '160', metValue: '3.5', durationMin: '45' } },
    { label: 'Cycling (moderate)', values: { weightCal: '200', metValue: '8.0', durationMin: '60' } },
    { label: 'Strength Training', values: { weightCal: '175', metValue: '5.0', durationMin: '45' } },
  ],
  compute: (v) => {
    const kg = v.weightCal / 2.205
    const hours = v.durationMin / 60
    const calories = v.metValue * kg * hours
    const caloriesPerMin = v.durationMin > 0 ? calories / v.durationMin : 0
    const fatBurnEquivalentKg = calories / 7716
    const moderateMetMin = v.metValue >= 3 && v.metValue < 6
    const vigorousMetMin = v.metValue >= 6
    const activityLevel = vigorousMetMin ? 'Vigorous' : moderateMetMin ? 'Moderate' : 'Light'
    const metMinutes = v.metValue * v.durationMin
    return {
      result: calories, label: 'Calories Burned', unit: 'kcal',
      steps: [
        { label: 'Weight in Kilograms', value: `${kg.toFixed(1)} kg (${v.weightCal} ÷ 2.205)` },
        { label: 'Exercise Duration', value: `${v.durationMin} min (${hours.toFixed(2)} hrs)` },
        { label: 'MET Value', value: `${v.metValue} (${activityLevel} intensity)` },
        { label: 'MET-minutes', value: `${metMinutes.toFixed(0)} (MET × minutes)` },
        { label: 'Calorie Formula', value: `${v.metValue} MET × ${kg.toFixed(1)} kg × ${hours.toFixed(2)} hrs` },
        { label: 'Calories Burned', value: `${calories.toFixed(0)} kcal` },
        { label: 'Per-Minute Burn Rate', value: `${caloriesPerMin.toFixed(1)} kcal/min` },
        { label: 'Fat Mass Equivalent', value: `~${(fatBurnEquivalentKg * 2.205).toFixed(2)} lbs of fat (${fatBurnEquivalentKg.toFixed(4)} kg)` },
      ],
      extras: [
        { label: 'MET Value Reference Guide', value: 'Resting (1.0), Desk work (1.5), Cooking (2.0), Walking 3 mph (3.5), Mopping (4.0), Yoga (4.5), Tennis doubles (5.0), Bicycling 12-14 mph (8.0), Running 6 mph (9.8), Jumping rope (12.0), Sprinting (18.0).' },
        { label: 'Weight Loss Math', value: 'One pound of body fat ≈ 3,500 kcal. To lose 1 lb/week, create a 500 kcal/day deficit through diet, exercise, or both. This workout burns ~307 kcal, or ~9% of your daily deficit goal.' },
        { label: 'Afterburn Effect (EPOC)', value: 'Vigorous exercise (MET > 6) creates Excess Post-Exercise Oxygen Consumption. You burn 6-15% additional calories in the 24 hours after intense exercise vs. moderate exercise.' },
        { label: 'Heart Rate Zone Correlation', value: 'Zone 2 (60-70% max HR): Moderate, sustainable, MET 3-6. Zone 3 (70-80%): Vigorous, MET 6-9. Zone 4 (80-90%): Very hard, MET 9-12. Zone 5 (90-100%): Maximum effort, MET 12+.' },
        { label: 'Calorie Compensation Effect', value: 'The body may compensate for exercise calories by reducing NEAT (non-exercise activity) or increasing hunger. Studies show compensation averages 20-30% of exercise calories burned.' },
        { label: 'Age and Fitness Adjustment', value: 'MET values are based on a 70 kg (154 lb) reference person. Older adults and less fit individuals may expend 10-20% more energy for the same activity. Use a heart rate monitor for personal calibration.' },
        { label: 'MET-minutes for Health Guidelines', value: 'WHO and ACSM recommend 500-1,000 MET-minutes/week for substantial health benefits. This workout: ~180 MET-minutes. Target: 150 min/week of moderate activity or 75 min/week of vigorous activity.' },
        { label: 'Activity Tracking Accuracy', value: 'Wearable devices (Apple Watch, Fitbit) typically overestimate calories by 10-25%. For weight loss tracking, use the MET formula here and consider under-eating exercise calories by 50-75%.' },
      ]
    }
  },
  description: 'Calculate calories burned during any physical activity using the MET (Metabolic Equivalent) method. Enter weight, MET value, and duration to see per-minute burn rate and fat equivalent.',
  formula: 'Calories = MET × Weight(kg) × Duration(hrs) | kg = lbs ÷ 2.205 | hrs = minutes ÷ 60 | Common MET values: walking 3.0, jogging 7.0, cycling 8.0, swimming 6.0',
  interpretation: 'MET values: 1.0 = resting, 3-6 = moderate activity, 7-10 = vigorous activity, >10 = very vigorous. To lose 1 lb of fat (~3,500 kcal), create a 500 kcal/day deficit. Combine cardiovascular exercise (MET 6+) with strength training for optimal body composition changes.'
}

export default calcDef
