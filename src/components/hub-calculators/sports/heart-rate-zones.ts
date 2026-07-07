import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: heartRateSchema,
  fields: [
    { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'restingHR', label: 'Resting HR (optional)', type: 'number', unit: 'bpm', min: 30, step: '1' },
  ],
  compute: (v) => {
    const maxHR = 220 - v.age; const resting = v.restingHR || 60; const hrr = maxHR - resting
    const zones = [50,60,70,80,90].map(p => ({ pct: p, hr: resting + hrr * (p/100) }))
    return { result: zones[2].hr, label: 'Target HR (70%)', unit: 'bpm', steps: [
      { label: 'Max HR', value: maxHR+' bpm' }, { label: 'HR Reserve', value: hrr+' bpm' },
      ...zones.map(z => ({ label: z.pct+'% Zone', value: z.hr.toFixed(0)+' bpm' })),
    ]}
  }, description: 'Calculate 5 heart rate zones via Karvonen formula. Zone 2 builds aerobic base, Zone 4 improves threshold.', formula: 'HRzone = RHR + (HRmax - RHR) × %', interpretation: 'Zone 2 (60-70%) for endurance, Zone 3 (70-80%) for tempo, Zone 4 (80-90%) for threshold.'
}

export default calcDef
