import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: vo2maxSchema,
  fields: [
    { name: 'distance', label: '12-min Run Distance', type: 'number', unit: 'm', min: 1, step: '1' },
    { name: 'age', label: 'Age (optional)', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'gender', label: 'Gender (optional)', type: 'select', options: genderOptions },
  ],
  compute: (v) => {
    const vo2 = (v.distance / 1000 * 3.5) + 3.5
    return {
      result: vo2, label: 'Estimated VO2 Max', unit: 'mL/kg/min',
      steps: [
        { label: 'Distance', value: `${v.distance} m in 12 min` },
        { label: 'Formula', value: `(${(v.distance / 1000).toFixed(2)} km × 3.5) + 3.5` },
        { label: 'VO2 Max', value: `${vo2.toFixed(1)} mL/kg/min` },
        ...(v.age ? [{ label: 'Fitness rating', value: vo2 > 45 ? 'Good to Excellent' : vo2 > 35 ? 'Average to Good' : 'Below Average' }] : []),
      ]
}
  },
  description: 'Estimate VO2 max from a 12-minute Cooper test run. VO2 max is the gold standard measure of aerobic fitness and cardiovascular endurance.'
}

export default calcDef
