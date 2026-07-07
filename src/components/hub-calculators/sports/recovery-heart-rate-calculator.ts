import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: recoveryHrSchema,
  fields: [
    { name: 'postHR', label: 'HR Immediately Post-Exercise', type: 'number', unit: 'bpm', min: 60, step: '1' },
    { name: 'oneMinHR', label: 'HR After 1 Minute Rest', type: 'number', unit: 'bpm', min: 40, step: '1' },
  ],
  compute: (v) => {
    const drop = v.postHR - v.oneMinHR
    const rating = drop > 50 ? 'Excellent' : drop > 40 ? 'Good' : drop > 30 ? 'Average' : drop > 20 ? 'Below Average' : 'Poor'
    return {
      result: drop, label: 'Heart Rate Recovery', unit: 'bpm drop',
      steps: [
        { label: 'Post-exercise HR', value: `${v.postHR} bpm` },
        { label: 'HR after 1 min', value: `${v.oneMinHR} bpm` },
        { label: 'Recovery drop', value: `${drop} bpm in 1 min` },
        { label: 'Recovery rating', value: rating },
        { label: 'Interpretation', value: drop > 40 ? 'Good cardiovascular fitness' : 'Consider improving aerobic conditioning' },
      ]
}
  },
  description: 'Heart rate recovery measures how much your heart rate drops 1 minute after exercise. A drop > 40 bpm indicates good cardiovascular fitness.'
}

export default calcDef
