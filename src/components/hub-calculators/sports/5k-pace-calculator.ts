import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: paceSchemaDistOnly,
  fields: [
    { name: 'distance', label: 'Distance', type: 'number', unit: 'km', min: 3, max: 8, step: '0.5' },
    { name: 'hours', label: 'Hours', type: 'number', min: 0, max: 1, step: '0.25' },
    { name: 'minutes', label: 'Minutes', type: 'number', min: 0, max: 59, step: '1' },
  ],
  compute: (v) => {
    const totalMin = v.hours * 60 + v.minutes
    const paceMinPerKm = totalMin / v.distance
    const paceMinPart = Math.floor(paceMinPerKm)
    const paceSecPart = Math.round((paceMinPerKm - paceMinPart) * 60)
    const speed = v.distance / (totalMin / 60)
    const milePace = totalMin / (v.distance * 0.6214)
    const mileMin = Math.floor(milePace)
    const mileSec = Math.round((milePace - mileMin) * 60)
    return {
      result: paceMinPerKm, label: 'Pace per km', unit: 'min/km',
      steps: [
        { label: 'Distance', value: `${v.distance} km (${(v.distance * 0.6214).toFixed(2)} mi)` },
        { label: 'Finish time', value: `${v.hours}h ${v.minutes}m` },
        { label: 'Pace per km', value: `${paceMinPart}:${paceSecPart.toString().padStart(2, '0')}` },
        { label: 'Pace per mile', value: `${mileMin}:${mileSec.toString().padStart(2, '0')}` },
        { label: 'Speed', value: `${speed.toFixed(2)} km/h (${(speed * 0.6214).toFixed(2)} mph)` },
      ]
}
  },
  description: 'Optimize your 5K race strategy. Calculate target pace per kilometer for any 5K goal time from 15 minutes to 40 minutes.'
}

export default calcDef
