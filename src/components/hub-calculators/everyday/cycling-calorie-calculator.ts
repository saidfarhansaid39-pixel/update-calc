import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1).refine(v => parseFloat(v) > 50, '>50'), speedMph: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), durationMin: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), elevation: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'weight', label: 'Rider Weight (lbs)', type: 'number', min: 50, step: '5' },
    { name: 'speedMph', label: 'Average Speed (mph)', type: 'number', min: 3, step: '1' },
    { name: 'durationMin', label: 'Duration (minutes)', type: 'number', min: 1, step: '5' },
    { name: 'elevation', label: 'Elevation Gain (ft)', type: 'number', min: 0, step: '100' },
  ],
  compute: (v) => {
    const metBase = v.speedMph < 8 ? 4 : v.speedMph < 13 ? 6 : v.speedMph < 16 ? 8 : v.speedMph < 19 ? 10 : 12
    const kg = v.weight / 2.205
    const hours = v.durationMin / 60
    const elevationCal = v.elevation * 0.003
    const baseCal = metBase * kg * hours
    const totalCal = baseCal + elevationCal
    return { result: totalCal, label: 'Calories Burned', unit: 'kcal', steps: [{ label: 'Base (MET)', value: `${baseCal.toFixed(0)} kcal (MET ${metBase})` }, { label: 'Elevation Bonus', value: `${elevationCal.toFixed(0)} kcal` }, { label: 'Total Burned', value: `${totalCal.toFixed(0)} kcal` }] }
  },
  description: 'Calculate calories burned cycling based on weight, speed, duration, and elevation gain. Uses MET values calibrated to cycling intensity.',
  formula: 'Calories = MET × Weight(kg) × Duration(hrs) + Elevation(ft) × 0.003',
  interpretation: 'MET values: 4 (leisure 5-8 mph), 6 (moderate 8-12 mph), 8 (vigorous 12-16 mph), 10 (very fast 16-19 mph), 12 (racing >19 mph). A 155-lb rider burns ~500 kcal/hr at 12-14 mph.'
}

export default calcDef
