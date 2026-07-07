import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: paceSchemaDistOnly,
  fields: [
    { name: 'distance', label: 'Distance', type: 'number', unit: 'km', min: 8, max: 15, step: '0.5' },
    { name: 'hours', label: 'Hours', type: 'number', min: 0, max: 2, step: '0.25' },
    { name: 'minutes', label: 'Minutes', type: 'number', min: 0, max: 59, step: '1' },
  ],
  compute: (v) => {
    const totalMin = v.hours * 60 + v.minutes
    const paceMinPerKm = totalMin / v.distance
    const paceMinPart = Math.floor(paceMinPerKm)
    const paceSecPart = Math.round((paceMinPerKm - paceMinPart) * 60)
    const speed = v.distance / (totalMin / 60)
    const vo2Est = 3.5 * speed
    return {
      result: speed, label: 'Average Speed', unit: 'km/h',
      steps: [
        { label: 'Distance', value: `${v.distance} km` },
        { label: 'Finish time', value: `${v.hours}h ${v.minutes}m (${totalMin.toFixed(0)} min)` },
        { label: 'Pace', value: `${paceMinPart}:${paceSecPart.toString().padStart(2, '0')} /km` },
        { label: 'Speed', value: `${speed.toFixed(2)} km/h` },
        { label: 'Estimated VO2', value: `${vo2Est.toFixed(1)} mL/kg/min` },
      ]
}
  },
  description: 'Set your 10K race pace. Calculate the speed and per-kilometer pace needed to hit your 10K personal best or goal time.'
}

export default calcDef
