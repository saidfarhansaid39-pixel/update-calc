import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: agilitySchema,
  fields: [
    { name: 'time', label: '5-10-5 Agility Time', type: 'number', unit: 's', min: 3, step: '0.01' },
    { name: 'gender', label: 'Gender (optional)', type: 'select', options: genderOptions },
  ],
  compute: (v) => {
    const isMale = v.gender !== 2
    const thresholds = isMale ? [5.0, 4.7, 4.5, 4.3] : [5.3, 5.0, 4.7, 4.5]
    const labels = ['Poor', 'Below Average', 'Average', 'Good', 'Excellent']
    let rating = labels[0]
    for (let i = 0; i < thresholds.length; i++) { if (v.time <= thresholds[i]) rating = labels[i + 1] }
    return {
      result: v.time, label: '5-10-5 Agility Time', unit: 's',
      steps: [
        { label: 'Test time', value: `${v.time} s` },
        { label: 'Rating', value: rating },
        { label: 'Standard', value: isMale ? 'Exc: <4.3s, Good: 4.3-4.5s, Avg: 4.5-4.7s' : 'Exc: <4.5s, Good: 4.5-4.7s, Avg: 4.7-5.0s' },
        { label: 'Note', value: 'The 5-10-5 shuttle (Pro Agility) measures change-of-direction speed and lateral quickness' },
      ]
}
  },
  description: 'The 5-10-5 Pro Agility Test measures change-of-direction speed and lateral quickness. Used by NFL Combine and professional sports organizations to assess agility.'
}

export default calcDef
