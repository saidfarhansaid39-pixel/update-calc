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
    const thr = isMale ? [5.0, 4.7, 4.5, 4.3] : [5.3, 5.0, 4.7, 4.5]; const lb = ['Poor','Below Avg','Average','Good','Excellent']
    let r = lb[0]; for (let i = 0; i < thr.length; i++) { if (v.time <= thr[i]) r = lb[i + 1] }
    return { result: v.time, label: '5-10-5 Shuttle', unit: 's', steps: [
      { label: 'Time', value: v.time+' s' }, { label: 'Rating', value: r },
      { label: 'Standard', value: isMale ? 'Exc:<4.3s, Good:4.3-4.5s, Avg:4.5-4.7s' : 'Exc:<4.5s, Good:4.5-4.7s, Avg:4.7-5.0s' },
    ]}
  }, description: 'The 5-10-5 Pro Agility Test measures change-of-direction speed. Used by NFL Combine and professional sports for lateral quickness assessment.', formula: 'Time to complete 5-10-5 yard shuttle course', interpretation: 'Lower times indicate better lateral quickness and change-of-direction ability. Essential for football, basketball, and soccer.'
}

export default calcDef
