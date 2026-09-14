import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1).refine(v => parseFloat(v) > 50, '>50'), duration: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), stroke: z.string().min(1), intensity: z.string().min(1), laps: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'weight', label: 'Body Weight (lb)', type: 'number', min: 50, step: '5' },
    { name: 'duration', label: 'Duration (minutes)', type: 'number', min: 1, step: '5' },
    { name: 'stroke', label: 'Stroke Type', type: 'select', options: [{ label: 'Freestyle', value: 'freestyle' }, { label: 'Breaststroke', value: 'breaststroke' }, { label: 'Backstroke', value: 'backstroke' }, { label: 'Butterfly', value: 'butterfly' }, { label: 'Sidestroke', value: 'sidestroke' }, { label: 'Water Treading', value: 'treading' }, { label: 'General Laps', value: 'general' }] },
    { name: 'intensity', label: 'Intensity', type: 'select', options: [{ label: 'Light', value: 'light' }, { label: 'Moderate', value: 'moderate' }, { label: 'Vigorous', value: 'vigorous' }] },
    { name: 'laps', label: 'Laps Swum', type: 'number', min: 0, step: '5' },
  ],
  defaults: { weight: '155', duration: '30', stroke: 'freestyle', intensity: 'moderate', laps: '0' },
  presets: [
    { label: 'Leisure Swimmer', values: { weight: '155', duration: '30', stroke: 'freestyle', intensity: 'moderate', laps: '0' } },
    { label: 'Intense Training', values: { weight: '175', duration: '45', stroke: 'butterfly', intensity: 'vigorous', laps: '40' } },
    { label: 'Gentle Recovery', values: { weight: '140', duration: '20', stroke: 'treading', intensity: 'light', laps: '0' } },
    { label: 'Lap Swimming', values: { weight: '165', duration: '40', stroke: 'freestyle', intensity: 'vigorous', laps: '60' } },
  ],
  compute: (v) => {
    const kg = v.weight / 2.205
    const hours = v.duration / 60
    const metMap: Record<string, Record<string, number>> = {
      freestyle: { light: 6, moderate: 8, vigorous: 10 },
      breaststroke: { light: 5, moderate: 7, vigorous: 9 },
      backstroke: { light: 5, moderate: 7, vigorous: 9 },
      butterfly: { light: 8, moderate: 10, vigorous: 12 },
      sidestroke: { light: 5, moderate: 6, vigorous: 7 },
      treading: { light: 3, moderate: 5, vigorous: 7 },
      general: { light: 5, moderate: 7, vigorous: 9 }
}
    const met = (metMap[v.stroke]?.[v.intensity]) || 7
    const baseCal = met * kg * hours
    const lapBonus = v.laps * 0.5
    const totalCal = baseCal + lapBonus
    return { result: totalCal, label: 'Calories Burned', unit: 'kcal', steps: [{ label: 'MET Value', value: `${met} (${v.stroke}, ${v.intensity})` }, { label: 'Weight', value: `${kg.toFixed(1)} kg` }, { label: 'Duration', value: `${v.duration} min` }, { label: 'Base Calories', value: `${baseCal.toFixed(0)} kcal` }, { label: 'Lap Bonus', value: `+${lapBonus.toFixed(0)} kcal` }, { label: 'Total Burned', value: `${totalCal.toFixed(0)} kcal` }] ,
    extras: [
      { label: 'Stroke Efficiency', value: `Butterfly burns ${((12 / 6 - 1) * 100).toFixed(0)}% more kcal/hr than light freestyle at the same weight` },
      { label: 'Water Temperature', value: 'Colder water (below 75°F) increases calorie burn by 10-15% as body works to maintain core temperature' },
      { label: 'Form Matters', value: 'Proper technique can increase efficiency and calorie burn by up to 20% — consider coaching sessions' },
      { label: 'Pool Length Standards', value: 'Olympic: 50m. Standard US competition: 25yd. Standard UK/Europe: 25m. One lap = one length' },
      { label: 'Heart Rate Zone', value: 'Moderate intensity: 70-80% max HR. Vigorous: 80-90%. Use a waterproof HR monitor to stay in zone' },
      { label: 'Recovery Strategy', value: 'Alternate intense sets with easy swimming (active recovery). Rest 30-60 sec between laps for best results' },
      { label: 'Progressive Overload', value: 'Increase duration by 10% or add 5 laps per week to continuously improve fitness without injury' },
    ]}
  },
  description: 'Calculate calories burned during swimming based on body weight, duration, stroke type, intensity level, and number of laps swum. Uses sport-specific MET values calibrated for each swimming stroke.',
  formula: 'Calories = MET × Weight(kg) × Duration(hrs) + LapBonus(Laps × 0.5). MET: Freestyle 6-10, Breaststroke 5-9, Backstroke 5-9, Butterfly 8-12, Sidestroke 5-7, Treading 3-7.',
  interpretation: 'Swimming burns 400-700 kcal/hr depending on stroke and intensity. Butterfly is the most vigorous stroke at 12 MET. A 155-lb person swimming freestyle at moderate pace burns ~500 kcal/hr. Each additional lap adds ~0.5 kcal. Colder water increases energy expenditure as the body works to maintain core temperature. For weight loss, aim for 30-60 min of continuous swimming 4-5 times per week.'
}

export default calcDef
