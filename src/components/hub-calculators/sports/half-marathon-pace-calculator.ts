import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: paceSchemaDistOnly,
  fields: [
    { name: 'distance', label: 'Half-Marathon Distance', type: 'number', unit: 'km', min: 21, max: 22, step: '0.1' },
    { name: 'hours', label: 'Goal Hours', type: 'number', min: 1, max: 4, step: '0.25' },
    { name: 'minutes', label: 'Extra Minutes', type: 'number', min: 0, max: 59, step: '1' },
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
      result: speed, label: 'Average Speed', unit: 'km/h',
      steps: [
        { label: 'Goal time', value: `${v.hours}h ${v.minutes}m` },
        { label: 'Pace per km', value: `${paceMinPart}:${paceSecPart.toString().padStart(2, '0')}` },
        { label: 'Pace per mile', value: `${mileMin}:${mileSec.toString().padStart(2, '0')}` },
        { label: 'Speed', value: `${speed.toFixed(2)} km/h` },
        { label: '5 km split', value: `${(paceMinPerKm * 5).toFixed(0)} min` },
        { label: '10 km split', value: `${(paceMinPerKm * 10).toFixed(0)} min` },
      ]
}
  },
  description: 'Find your half marathon pace. Calculate pace per kilometer for any half marathon goal time and develop a race day pacing plan.'
}

export default calcDef
