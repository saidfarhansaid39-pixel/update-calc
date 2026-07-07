import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: paceSchemaDistOnly,
  fields: [
    { name: 'distance', label: 'Race Distance', type: 'number', unit: 'km', min: 0.1, step: '0.1' },
    { name: 'hours', label: 'Goal Hours', type: 'number', min: 0, step: '1' },
    { name: 'minutes', label: 'Goal Minutes', type: 'number', min: 0, max: 59, step: '1' },
  ],
  compute: (v) => {
    const totalMin = v.hours * 60 + v.minutes
    const paceMinPerKm = totalMin / v.distance
    const paceMinPart = Math.floor(paceMinPerKm)
    const paceSecPart = Math.round((paceMinPerKm - paceMinPart) * 60)
    const speed = v.distance / (totalMin / 60)
    return {
      result: paceMinPerKm, label: 'Required Pace', unit: 'min/km',
      steps: [
        { label: 'Race distance', value: `${v.distance} km` },
        { label: 'Goal finish time', value: `${v.hours}h ${v.minutes}m (${totalMin.toFixed(0)} min)` },
        { label: 'Required pace', value: `${paceMinPart}:${paceSecPart.toString().padStart(2, '0')} /km` },
        { label: 'Equivalent speed', value: `${speed.toFixed(2)} km/h` },
        { label: 'Per 5 km split', value: `${(paceMinPerKm * 5).toFixed(1)} min` },
      ]
}
  },
  description: 'Predict your finish time based on current pace. Enter your distance and target pace to estimate your race day completion time.'
}

export default calcDef
