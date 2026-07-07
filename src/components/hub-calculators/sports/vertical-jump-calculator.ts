import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: jumpSchema,
  fields: [
    { name: 'height', label: 'Vertical Jump Height', type: 'number', unit: 'cm', min: 1, step: '1' },
    { name: 'gender', label: 'Gender (optional)', type: 'select', options: genderOptions },
  ],
  compute: (v) => {
    const power = Math.sqrt(4 * 9.81 * v.height / 100) * 9.81 * 75 / 1000
    const thresholds = [30, 45, 55, 65, 75]
    const labels = ['Poor', 'Below Average', 'Average', 'Good', 'Excellent', 'Superior']
    let rating = labels[0]
    for (let i = 0; i < thresholds.length; i++) { if (v.height >= thresholds[i]) rating = labels[i + 1] }
    return {
      result: v.height, label: 'Vertical Jump', unit: 'cm',
      steps: [
        { label: 'Jump height', value: `${v.height} cm` },
        { label: 'Estimated power', value: `${power.toFixed(2)} kW` },
        { label: 'Rating', value: rating },
        { label: 'Takeoff velocity', value: `${Math.sqrt(2 * 9.81 * v.height / 100).toFixed(2)} m/s` },
        { label: 'Standard', value: 'Exc: >75cm, Good: 65-74cm, Avg: 55-64cm' },
      ]
}
  },
  description: 'Measure your vertical jump power using jump height. The vertical jump is a key test of lower body power and is used in sports like basketball, volleyball, and football.'
}

export default calcDef
