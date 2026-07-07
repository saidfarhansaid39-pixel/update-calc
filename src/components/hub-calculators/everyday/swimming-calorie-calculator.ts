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
    return { result: totalCal, label: 'Calories Burned', unit: 'kcal', steps: [{ label: 'MET Value', value: `${met} (${v.stroke}, ${v.intensity})` }, { label: 'Weight', value: `${kg.toFixed(1)} kg` }, { label: 'Duration', value: `${v.duration} min` }, { label: 'Base Calories', value: `${baseCal.toFixed(0)} kcal` }, { label: 'Lap Bonus', value: `+${lapBonus.toFixed(0)} kcal` }, { label: 'Total Burned', value: `${totalCal.toFixed(0)} kcal` }] }
  },
  description: 'Calculate calories burned swimming based on weight, duration, stroke type, intensity, and number of laps.',
  formula: 'Cal = MET × Weight(kg) × Duration(hrs) + Laps×0.5 | MET: Freestyle 6-10, Butterfly 8-12, Treading 3-7',
  interpretation: 'Swimming burns 400-700 kcal/hr depending on stroke and intensity. Butterfly is the most intense stroke. Water temperature affects calorie burn — colder water increases energy expenditure. A 155-lb person burns ~500 kcal/hr doing freestyle.'
}

export default calcDef
