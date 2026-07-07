import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: swimStrokeSchema,
  fields: [
    { name: 'distance', label: 'Distance', type: 'number', unit: 'm', min: 10, step: '1' },
    { name: 'strokes', label: 'Strokes Per Length', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const dls = v.distance / v.strokes; const spm = 60 / (dls / 1.5)
    return { result: dls, label: 'Distance Per Stroke', unit: 'm/stroke', steps: [
      { label: 'Distance', value: v.distance+' m' }, { label: 'Strokes', value: ''+v.strokes },
      { label: 'DPS', value: dls.toFixed(2)+' m/stroke' }, { label: 'Est. SPM', value: spm.toFixed(0)+' SPM' },
    ]}
  }, description: 'Calculate swim stroke efficiency (DPS - distance per stroke). Elite swimmers cover 2+ m/stroke.', formula: 'DPS = distance / strokes; SPM = 60 / (DPS / 1.5)', interpretation: 'Longer DPS with same speed = more efficient swimming. Stroke rate and length must balance.'
}

export default calcDef
