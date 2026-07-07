import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: paceSchemaDistOnly,
  fields: [
    { name: 'distance', label: 'Marathon Distance', type: 'number', unit: 'km', min: 42, max: 43, step: '0.1' },
    { name: 'hours', label: 'Goal Hours', type: 'number', min: 2, max: 7, step: '0.25' },
    { name: 'minutes', label: 'Extra Minutes', type: 'number', min: 0, max: 59, step: '1' },
  ],
  compute: (v) => {
    const totalMin = v.hours * 60 + v.minutes
    const paceMinPerKm = totalMin / v.distance
    const paceMinPart = Math.floor(paceMinPerKm)
    const paceSecPart = Math.round((paceMinPerKm - paceMinPart) * 60)
    const split5k = paceMinPerKm * 5
    const split10k = paceMinPerKm * 10
    const halfTime = paceMinPerKm * 21.1
    return {
      result: paceMinPerKm, label: 'Marathon Pace', unit: 'min/km',
      steps: [
        { label: 'Goal time', value: `${v.hours}h ${v.minutes}m` },
        { label: 'Pace per km', value: `${paceMinPart}:${paceSecPart.toString().padStart(2, '0')}` },
        { label: '5 km split', value: `${Math.floor(split5k / 60)}:${(split5k % 60).toFixed(0).padStart(2, '0')}` },
        { label: '10 km split', value: `${Math.floor(split10k / 60)}:${(split10k % 60).toFixed(0).padStart(2, '0')}` },
        { label: 'Half-marathon split', value: `${Math.floor(halfTime / 60)}h ${(halfTime % 60).toFixed(0)}m` },
      ]
}
  },
  description: 'Plan your marathon pacing strategy. Calculate the pace needed to achieve your goal marathon finish time from 3 hours to 6 hours.'
}

export default calcDef
