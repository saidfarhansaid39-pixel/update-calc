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
    const thr = [30, 45, 55, 65, 75]; const lb = ['Poor','Below Avg','Average','Good','Excellent','Superior']
    let r = lb[0]; for (let i = 0; i < thr.length; i++) { if (v.height >= thr[i]) r = lb[i + 1] }
    return { result: v.height, label: 'Vertical Jump', unit: 'cm', steps: [
      { label: 'Jump height', value: v.height+' cm' }, { label: 'Estimated power', value: power.toFixed(2)+' kW' },
      { label: 'Takeoff velocity', value: Math.sqrt(2*9.81*v.height/100).toFixed(2)+' m/s' }, { label: 'Rating', value: r },
    ]}
  }, description: 'Measure vertical jump height and estimated lower body power. Key test for basketball, volleyball, and football athletes.', formula: 'Power = √(4·g·h) · g · m / 1000', interpretation: 'Vertical jump is the gold standard for lower body power assessment. >75cm is excellent for most sports.'
}

export default calcDef
