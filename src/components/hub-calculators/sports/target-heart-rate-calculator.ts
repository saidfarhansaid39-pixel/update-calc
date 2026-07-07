import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: targetHrSchema,
  fields: [
    { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'restingHR', label: 'Resting HR (optional)', type: 'number', unit: 'bpm', min: 30, step: '1' },
    { name: 'intensity', label: 'Intensity', type: 'select', options: intensityOptions },
  ],
  compute: (v) => {
    const maxHR = 220 - v.age
    const resting = v.restingHR || 60
    const intensity = v.intensity || 70
    const hrr = maxHR - resting
    const target = resting + hrr * (intensity / 100)
    return {
      result: target, label: 'Target Heart Rate', unit: 'bpm',
      steps: [
        { label: 'Age', value: `${v.age} years` },
        { label: 'Max HR', value: `${maxHR} bpm` },
        { label: 'Resting HR', value: `${resting} bpm` },
        { label: 'Target intensity', value: `${intensity}%` },
        { label: 'Target HR', value: `${target.toFixed(0)} bpm` },
      ]
}
  },
  description: 'Calculate your target heart rate for a specific exercise intensity using the Karvonen method. Train in the right zone for your fitness goals.'
}

export default calcDef
