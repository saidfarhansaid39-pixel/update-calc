import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: cooperSchema,
  fields: [
    { name: 'distance', label: 'Distance Run in 12 min', type: 'number', unit: 'm', min: 100, step: '10' },
    { name: 'age', label: 'Age (optional)', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'gender', label: 'Gender (optional)', type: 'select', options: genderOptions },
  ],
  compute: (v) => {
    const vo2 = (v.distance / 1000 * 3.5) + 3.5
    const isMale = v.gender !== 2
    const thresholds = isMale ? [1600, 2200, 2500, 2800, 3200] : [1200, 1800, 2100, 2500, 2900]
    const labels = ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent', 'Superior']
    let rating = labels[0]
    for (let i = 0; i < thresholds.length; i++) { if (v.distance >= thresholds[i]) rating = labels[i + 1] }
    return {
      result: v.distance, label: 'Cooper Test Distance', unit: 'm',
      steps: [
        { label: 'Distance in 12 min', value: `${v.distance} m` },
        { label: 'Estimated VO2 max', value: `${vo2.toFixed(1)} mL/kg/min` },
        { label: 'Fitness rating', value: rating },
        { label: 'Standard', value: isMale ? 'Exc: 2800+, Good: 2500-2799, Avg: 2200-2499' : 'Exc: 2500+, Good: 2100-2499, Avg: 1800-2099' },
      ]
}
  },
  description: 'The Cooper 12-minute run test measures cardiovascular fitness. Distance covered in 12 minutes predicts VO2 max and overall aerobic capacity.'
}

export default calcDef
