import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: cyclingSchema,
  fields: [
    { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', min: 20, step: '0.1' },
    { name: 'distance', label: 'Distance', type: 'number', unit: 'km', min: 0.1, step: '0.1' },
    { name: 'hours', label: 'Hours', type: 'number', min: 0, step: '1' },
    { name: 'minutes', label: 'Minutes', type: 'number', min: 0, max: 59, step: '1' },
  ],
  compute: (v) => {
    const totalHours = v.hours + v.minutes / 60
    const speed = totalHours > 0 ? v.distance / totalHours : 0
    const met = speed > 20 ? 8 : speed > 15 ? 6 : speed > 10 ? 5 : 4
    const kcal = v.weight * met * totalHours
    return {
      result: kcal, label: 'Calories Burned Cycling', unit: 'kcal',
      steps: [
        { label: 'Body weight', value: `${v.weight} kg` },
        { label: 'Distance', value: `${v.distance} km` },
        { label: 'Time', value: `${v.hours}h ${v.minutes}m (${totalHours.toFixed(2)} hr)` },
        { label: 'Avg speed', value: `${speed.toFixed(1)} km/h → ${met} METs` },
        { label: 'Calories burned', value: `${kcal.toFixed(0)} kcal` },
      ]
}
  },
  description: 'Calculate calories burned during cycling based on distance, time, and weight. Slower speeds use fewer METs.'
}

export default calcDef
