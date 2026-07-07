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
    let cat = 'Recreational'
    if (wkg > 5.0) cat = 'World-class'
    else if (wkg > 4.0) cat = 'Elite/Pro'
    else if (wkg > 3.2) cat = 'Local racer'
    else if (wkg > 2.5) cat = 'Trained amateur'
    return {
      result: wkg, label: 'Power-to-Weight Ratio', unit: 'W/kg',
      steps: [
        { label: 'System weight', value: `${v.weight} kg` },
        { label: 'Power output', value: `${v.power} W` },
        { label: 'Power-to-weight ratio', value: `${wkg.toFixed(2)} W/kg` },
        { label: 'Category', value: cat },
        { label: 'Climbing performance', value: wkg > 4 ? 'Excellent climber' : wkg > 3 ? 'Good climber' : 'Moderate climber' },
      ]
}
  },
  description: 'Calculate your cycling power-to-weight ratio (W/kg). This is the key metric for climbing performance and overall cycling fitness level.'
}

export default calcDef
