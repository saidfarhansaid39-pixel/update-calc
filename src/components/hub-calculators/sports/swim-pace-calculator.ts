import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: swimPaceSchema,
  fields: [
    { name: 'distance', label: 'Distance', type: 'number', unit: 'm', min: 1, step: '1' },
    { name: 'hours', label: 'Hours', type: 'number', min: 0, step: '1' },
    { name: 'minutes', label: 'Minutes', type: 'number', min: 0, max: 59, step: '1' },
    { name: 'seconds', label: 'Seconds', type: 'number', min: 0, max: 59, step: '1' },
  ],
  compute: (v) => {
    const totalSec = v.hours * 3600 + v.minutes * 60 + v.seconds
    const pace100m = totalSec / (v.distance / 100)
    const paceMin = Math.floor(pace100m / 60)
    const paceSec = Math.round(pace100m % 60)
    const speed = v.distance / 1000 / (totalSec / 3600)
    return {
      result: speed, label: 'Average Speed', unit: 'km/h',
      steps: [
        { label: 'Distance', value: `${v.distance} m (${(v.distance / 1000).toFixed(2)} km)` },
        { label: 'Total time', value: `${v.hours}h ${v.minutes}m ${v.seconds}s` },
        { label: 'Pace per 100m', value: `${paceMin}:${paceSec.toString().padStart(2, '0')} min/100m` },
        { label: 'Average speed', value: `${speed.toFixed(2)} km/h` },
        { label: 'CSS (Critical Swim Speed)', value: `${paceMin}:${paceSec.toString().padStart(2, '0')} min/100m — your threshold pace` },
      ]
}
  },
  description: 'Calculate swimming pace per 100m and average speed. Track your CSS (Critical Swim Speed) and threshold pace for any distance and time.'
}

export default calcDef
