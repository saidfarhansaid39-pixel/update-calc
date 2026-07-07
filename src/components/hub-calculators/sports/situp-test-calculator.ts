import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: pushupSchema,
  fields: [
    { name: 'count', label: 'Situps Completed (1 min)', type: 'number', min: 0, step: '1' },
    { name: 'age', label: 'Age (optional)', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'gender', label: 'Gender (optional)', type: 'select', options: genderOptions },
  ],
  compute: (v) => {
    const isMale = v.gender !== 2
    const thresholds = isMale ? [20, 30, 40, 50] : [15, 25, 35, 45]
    const rating = v.count >= thresholds[3] ? 'Excellent' : v.count >= thresholds[2] ? 'Good' : v.count >= thresholds[1] ? 'Average' : v.count >= thresholds[0] ? 'Below Average' : 'Poor'
    return {
      result: v.count, label: 'Situp Test Score (1 min)', unit: 'reps',
      steps: [
        { label: 'Situps in 1 min', value: `${v.count}` },
        { label: 'Rating', value: rating },
        { label: 'Standards', value: isMale ? 'Exc: >50, Good: 40-49, Avg: 30-39' : 'Exc: >45, Good: 35-44, Avg: 25-34' },
      ].filter(s => s.label)
}
  },
  description: 'Assess core muscular endurance with the 1-minute situp test. The situp test measures abdominal strength and is used in military and law enforcement fitness tests.'
}

export default calcDef
