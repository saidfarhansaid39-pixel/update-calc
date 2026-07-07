import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: pushupSchema,
  fields: [
    { name: 'count', label: 'Pushups Completed', type: 'number', min: 0, step: '1' },
    { name: 'age', label: 'Age (optional)', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'gender', label: 'Gender (optional)', type: 'select', options: genderOptions },
  ],
  compute: (v) => {
    const isMale = v.gender !== 2
    const thresholds = isMale ? [15, 25, 35, 45] : [5, 12, 20, 30]
    const rating = v.count >= thresholds[3] ? 'Excellent' : v.count >= thresholds[2] ? 'Good' : v.count >= thresholds[1] ? 'Average' : v.count >= thresholds[0] ? 'Below Average' : 'Poor'
    return {
      result: v.count, label: 'Pushup Test Score', unit: 'reps',
      steps: [
        { label: 'Pushups completed', value: `${v.count}` },
        { label: 'Gender', value: isMale ? 'Male' : 'Female' },
        { label: 'Rating', value: rating },
        { label: 'Standards (male)', value: isMale ? 'Exc: >45, Good: 35-45, Avg: 25-34' : 'Exc: >30, Good: 20-29, Avg: 12-19' },
        v.age ? { label: `${v.age} yr benchmark`, value: isMale ? `Target: ${Math.round(35 - v.age * 0.15)}` : `Target: ${Math.round(25 - v.age * 0.12)}` } : { label: '', value: '' },
      ].filter(s => s.label)
}
  },
  description: 'Assess upper body endurance with the pushup test. The ACSM pushup test measures muscular endurance and is part of standard fitness assessments.'
}

export default calcDef
