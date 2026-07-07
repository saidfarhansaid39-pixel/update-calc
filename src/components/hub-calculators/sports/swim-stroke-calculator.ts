import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: swimStrokeSchema,
  fields: [
    { name: 'distance', label: 'Lane/Pool Length', type: 'number', unit: 'm', min: 10, step: '1' },
    { name: 'strokes', label: 'Strokes Per Length', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const dls = v.distance / v.strokes
    const spm = 60 / (dls / 1.5)
    return {
      result: dls, label: 'Distance Per Stroke', unit: 'm/stroke',
      steps: [
        { label: 'Pool length', value: `${v.distance} m` },
        { label: 'Strokes per length', value: `${v.strokes}` },
        { label: 'Distance per stroke', value: `${dls.toFixed(2)} m/stroke` },
        { label: 'Est. strokes per min', value: `${spm.toFixed(0)} SPM` },
        { label: 'Efficiency note', value: dls > 2 ? 'Good efficiency — long, powerful strokes' : 'Work on glide and technique to increase distance per stroke' },
      ]
}
  },
  description: 'Calculate swimming stroke efficiency by measuring distance per stroke. Longer distance per stroke means more efficient swimming. Elite swimmers cover 2+ m/stroke.'
}

export default calcDef
