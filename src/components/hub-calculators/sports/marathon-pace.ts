import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: paceSchemaDistOnly,
  fields: [
    { name: 'distance', label: 'Distance', type: 'number', unit: 'km', min: 42, max: 43, step: '0.1' },
    { name: 'hours', label: 'Goal Hours', type: 'number', min: 2, max: 7, step: '0.25' },
    { name: 'minutes', label: 'Extra Minutes', type: 'number', min: 0, max: 59, step: '1' },
  ],
  compute: (v) => {
    const totalMin = v.hours*60 + v.minutes; const pace = totalMin / v.distance; const pMin = Math.floor(pace); const pSec = Math.round((pace-pMin)*60)
    return { result: pace, label: 'Marathon Pace', unit: 'min/km', steps: [
      { label: 'Goal time', value: v.hours+'h '+v.minutes+'m' },
      { label: 'Pace per km', value: pMin+':'+pSec.toString().padStart(2,'0') },
      { label: '5k split', value: (pace*5).toFixed(0)+' min' },
    ]}
  }, description: 'Plan your marathon pacing strategy for 42.195 km. Even or negative splits are optimal.', formula: 'Pace = goal time (min) / 42.195', interpretation: 'Most runners benefit from conservative early pacing and finishing strong.'
}

export default calcDef
