import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: paceSchemaDistOnly,
  fields: [
    { name: 'distance', label: 'Distance', type: 'number', unit: 'km', min: 3, max: 8, step: '0.5' },
    { name: 'hours', label: 'Hours', type: 'number', min: 0, max: 1, step: '0.25' },
    { name: 'minutes', label: 'Minutes', type: 'number', min: 0, max: 59, step: '1' },
  ],
  compute: (v) => {
    const totalMin = v.hours*60 + v.minutes; const pace = totalMin / v.distance; const pMin = Math.floor(pace); const pSec = Math.round((pace-pMin)*60)
    const speed = v.distance / (totalMin/60)
    return { result: pace, label: '5K Pace', unit: 'min/km', steps: [
      { label: 'Finish time', value: totalMin.toFixed(0)+' min' },
      { label: 'Pace', value: pMin+':'+pSec.toString().padStart(2,'0')+' /km' },
      { label: 'Speed', value: speed.toFixed(1)+' km/h' },
    ]}
  }, description: 'Find your 5K race pace for any goal time from 15 to 40 minutes.', formula: 'Pace = goal time (min) / 5', interpretation: '5K requires a sustained high-intensity pace. Aim for even splits throughout.'
}

export default calcDef
