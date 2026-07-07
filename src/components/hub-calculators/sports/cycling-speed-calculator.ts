import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: cyclingSchema,
  fields: [
    { name: 'distance', label: 'Distance', type: 'number', unit: 'km', min: 0.1, step: '0.1' },
    { name: 'hours', label: 'Hours', type: 'number', min: 0, step: '1' },
    { name: 'minutes', label: 'Minutes', type: 'number', min: 0, max: 59, step: '1' },
  ],
  compute: (v) => {
    const totalHours = v.hours + v.minutes / 60
    const speed = totalHours > 0 ? v.distance / totalHours : 0
    return {
      result: speed, label: 'Average Speed', unit: 'km/h',
      steps: [
        { label: 'Distance', value: `${v.distance} km` },
        { label: 'Ride time', value: `${v.hours}h ${v.minutes}m` },
        { label: 'Average speed', value: `${speed.toFixed(1)} km/h` },
        { label: 'Time per 10 km', value: `${(10 / speed * 60).toFixed(1)} min at this speed` },
      ]
}
  },
  description: 'Calculate your cycling average speed from distance and ride time. Speed is the most basic measure of cycling performance and pacing.'
}

export default calcDef
