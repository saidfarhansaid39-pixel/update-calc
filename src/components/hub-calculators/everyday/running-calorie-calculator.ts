import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1).refine(v => parseFloat(v) > 50, '>50'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), minutes: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), incline: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'weight', label: 'Body Weight (lb)', type: 'number', min: 50, step: '5' },
    { name: 'distance', label: 'Distance Run (mi)', type: 'number', min: 0.1, step: '0.5' },
    { name: 'hours', label: 'Hours', type: 'number', min: 0, step: '1' },
    { name: 'minutes', label: 'Minutes', type: 'number', min: 0, step: '5' },
    { name: 'incline', label: 'Incline Grade (%)', type: 'number', min: 0, max: 30, step: '1' },
  ],
  defaults: { weight: '155', distance: '3.1', hours: '0', minutes: '30', incline: '0' },
  presets: [
    { label: '5K Race', values: { weight: '155', distance: '3.1', hours: '0', minutes: '30', incline: '0' } },
    { label: 'Treadmill Hill Run', values: { weight: '160', distance: '3', hours: '0', minutes: '30', incline: '3' } },
    { label: 'Long Slow Run', values: { weight: '150', distance: '10', hours: '1', minutes: '30', incline: '0' } },
    { label: 'Trail Run (hilly)', values: { weight: '165', distance: '6', hours: '1', minutes: '0', incline: '5' } },
  ],
  compute: (v) => {
    const kg = v.weight / 2.205
    const totalMin = v.hours * 60 + v.minutes
    const met = 9.8 + v.incline * 0.7
    const hours = totalMin / 60
    const baseCal = met * kg * hours
    const distanceCal = v.distance * kg * 1.036
    const avgCal = (baseCal + distanceCal) / 2
    return { result: avgCal, label: 'Calories Burned', unit: 'kcal', steps: [{ label: 'Weight', value: `${kg.toFixed(1)} kg` }, { label: 'Duration', value: `${totalMin} min` }, { label: 'Distance', value: `${v.distance} mi` }, { label: 'MET (with incline)', value: `${met.toFixed(1)}` }, { label: 'Calories Burned', value: `${avgCal.toFixed(0)} kcal` }] ,
    extras: [
      { label: 'Calories Per Mile Rule', value: 'Rough rule: ~0.63 × body weight(lb) = kcal/mile. A 155 lb runner burns ~98 kcal/mile on flat terrain. At 175 lbs: ~110 kcal/mile. Body weight matters most' },
      { label: 'Incline Effect', value: 'Each 1% incline adds ~12% more calories. A 5% incline run burns 60% more calories than flat terrain at same speed. Downhill (-2%) reduces burn by ~10%' },
      { label: 'Running vs Walking Comparison', value: 'Running burns ~30-40% more calories per mile than walking at the same distance, but running takes less time. Per minute: running burns 2-3x more calories' },
      { label: 'Afterburn Effect (EPOC)', value: 'Running creates excess post-exercise oxygen consumption (EPOC) of 5-15% of total calories burned over 1-4 hours post-run. Higher intensity = greater afterburn' },
      { label: 'Temperature Effect', value: 'Running in cold weather (below 40°F) increases calorie burn by 5-10% as body maintains temperature. Hot weather (above 85°F) increases burn by 3-7% from heat regulation' },
      { label: 'Running Economy', value: 'Experienced runners are 10-20% more efficient (burn fewer calories at same pace) than beginners. A 7:00/mi pace burns ~15% more per mile than 10:00/mi due to efficiency differences' },
      { label: 'Fueling Recommendations', value: 'Runs under 60 min: no fuel needed — water is sufficient. Runs 60-90 min: 100-200 kcal carbs (gel, banana). Runs 90+ min: 200-400 kcal/hr carbs plus electrolytes' },
    ]}
  },
  description: 'Calculate calories burned while running based on body weight, distance, time, and incline grade. Uses MET methodology with incline-adjusted intensity factors.',
  formula: 'Calories = Average(MET × Weight(kg) × Hours, Distance(mi) × Weight(kg) × 1.036). MET = 9.8 (running baseline) + Incline% × 0.7. Each 1% incline adds ~12% more calories.',
  interpretation: 'A 155 lb (70.3 kg) runner burns approximately 98-125 kcal per mile on flat terrain. At a 3% incline, that increases to ~140-170 kcal/mile. Running one mile burns roughly 30-40% more calories than walking the same mile. The "afterburn effect" (EPOC) adds 5-15% more calories in the hours after running. A 30-minute, 3-mile run for a 155 lb person burns ~300-350 kcal — equivalent to a small meal. For weight loss, running 15-20 miles/week at moderate intensity is typically recommended along with dietary adjustments.'
}

export default calcDef
