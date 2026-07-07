import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: beepSchema,
  fields: [
    { name: 'level', label: 'Level Reached', type: 'number', min: 1, max: 25, step: '1' },
    { name: 'shuttle', label: 'Shuttle Number', type: 'number', min: 1, max: 20, step: '1' },
  ],
  compute: (v) => {
    const totalShuttles = (v.level - 1) * 10 + v.shuttle
    const vo2 = 3.46 * v.level + 12.29
    const rating = vo2 > 50 ? 'Excellent' : vo2 > 45 ? 'Good' : vo2 > 40 ? 'Average' : vo2 > 35 ? 'Below Average' : 'Poor'
    return {
      result: vo2, label: 'Estimated VO2 Max', unit: 'mL/kg/min',
      steps: [
        { label: 'Level reached', value: `${v.level}.${v.shuttle}` },
        { label: 'Total shuttles', value: `${totalShuttles}` },
        { label: 'VO2 max estimate', value: `${vo2.toFixed(1)} mL/kg/min` },
        { label: 'Fitness rating', value: rating },
        { label: 'Percentile (20-29 yr)', value: vo2 > 50 ? 'Top 10%' : vo2 > 45 ? 'Top 30%' : 'Average or below' },
      ]
}
  },
  description: 'The Beep Test (Multi-Stage Fitness Test) measures aerobic capacity. Each level increases speed by 0.5 km/h. VO2 max is estimated from the final level reached.'
}

export default calcDef
