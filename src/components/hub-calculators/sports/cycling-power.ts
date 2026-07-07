import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: cyclingPowerSchema,
  fields: [
    { name: 'weight', label: 'Rider + Bike Weight', type: 'number', unit: 'kg', min: 40, step: '0.5' },
    { name: 'power', label: 'Power Output', type: 'number', unit: 'W', min: 50, step: '5' },
  ],
  compute: (v) => {
    const wkg = v.power / v.weight
    let cat = 'Recreational'; if (wkg > 5.0) cat = 'World-class'; else if (wkg > 4.0) cat = 'Elite'; else if (wkg > 3.2) cat = 'Local racer'; else if (wkg > 2.5) cat = 'Trained amateur'
    return { result: wkg, label: 'Power-to-Weight', unit: 'W/kg', steps: [
      { label: 'System weight', value: v.weight+' kg' }, { label: 'Power', value: v.power+' W' },
      { label: 'W/kg', value: wkg.toFixed(2)+' W/kg' }, { label: 'Category', value: cat },
    ]}
  }, description: 'Calculate cycling power-to-weight ratio (W/kg). Key metric for climbing and overall cycling performance.', formula: 'W/kg = Power (W) / Weight (kg)', interpretation: '>4.0 W/kg = elite climbing ability. >5.0 W/kg = world-class level.'
}

export default calcDef
