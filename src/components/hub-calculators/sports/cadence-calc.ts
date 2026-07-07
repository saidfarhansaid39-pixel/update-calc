import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: cadenceSchema,
  fields: [
    { name: 'rpm', label: 'Cadence (RPM)', type: 'number', min: 30, max: 200, step: '1' },
    { name: 'chainring', label: 'Chainring Teeth', type: 'number', min: 30, max: 60, step: '1' },
    { name: 'cog', label: 'Rear Cog Teeth', type: 'number', min: 10, max: 50, step: '1' },
    { name: 'wheel', label: 'Wheel Circumference', type: 'number', unit: 'm', min: 1, max: 3, step: '0.01' },
  ],
  compute: (v) => {
    const ratio = v.chainring / v.cog; const speed = v.rpm * ratio * v.wheel * 60 / 1000
    return { result: speed, label: 'Estimated Speed', unit: 'km/h', steps: [
      { label: 'Cadence', value: v.rpm+' RPM' }, { label: 'Gear ratio', value: v.chainring+'/'+v.cog+' = '+ratio.toFixed(2) },
      { label: 'Wheel circ.', value: v.wheel+' m' }, { label: 'Speed', value: speed.toFixed(1)+' km/h' },
    ]}
  }, description: 'Calculate cycling speed from cadence, gear ratio, and wheel size. Typical road cadence is 80-100 RPM.', formula: 'Speed = RPM × (chainring/cog) × wheelCircumference × 60 / 1000', interpretation: 'Higher cadence with same gear = faster speed. Optimal cadence varies by rider and terrain.'
}

export default calcDef
