import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: sprintSchema,
  fields: [
    { name: 'distance', label: 'Sprint Distance', type: 'number', unit: 'm', min: 10, step: '5' },
    { name: 'time', label: 'Sprint Time', type: 'number', unit: 's', min: 1, step: '0.01' },
  ],
  compute: (v) => {
    const speedMs = v.distance / v.time
    const speedKmh = speedMs * 3.6
    return {
      result: speedKmh, label: 'Average Speed', unit: 'km/h',
      steps: [
        { label: 'Distance', value: `${v.distance} m` },
        { label: 'Time', value: `${v.time} s` },
        { label: 'Speed (m/s)', value: `${speedMs.toFixed(2)} m/s` },
        { label: 'Speed (km/h)', value: `${speedKmh.toFixed(1)} km/h` },
        { label: 'Comparison', value: speedKmh > 25 ? 'Elite sprint speed' : speedKmh > 20 ? 'Good sprint speed' : 'Recreational speed' },
      ]
}
  },
  description: 'Calculate sprint speed from distance and time. Usain Bolt reached 44.7 km/h (12.4 m/s) during his 100m world record. Measure your own top speed.'
}

export default calcDef
