import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: recoveryHrSchema,
  fields: [
    { name: 'postHR', label: 'HR Post-Exercise', type: 'number', unit: 'bpm', min: 60, step: '1' },
    { name: 'oneMinHR', label: 'HR After 1 Min Rest', type: 'number', unit: 'bpm', min: 40, step: '1' },
  ],
  compute: (v) => {
    const drop = v.postHR - v.oneMinHR
    const r = drop > 50 ? 'Excellent' : drop > 40 ? 'Good' : drop > 30 ? 'Average' : drop > 20 ? 'Below Average' : 'Poor'
    return { result: drop, label: 'HR Recovery Drop', unit: 'bpm', steps: [
      { label: 'Post-exercise', value: v.postHR+' bpm' }, { label: 'After 1 min', value: v.oneMinHR+' bpm' },
      { label: 'Drop', value: drop+' bpm' }, { label: 'Rating', value: r },
    ]}
  }, description: 'Heart rate recovery measures 1-minute HR drop after exercise. Drop > 40 bpm = good fitness.', formula: 'HRR = HRpeak - HR1min', interpretation: 'Faster recovery = better parasympathetic function and cardiovascular fitness.'
}

export default calcDef
