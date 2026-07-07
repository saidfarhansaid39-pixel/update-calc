import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: paceSchemaDistOnly,
  fields: [
    { name: 'distance', label: 'Distance', type: 'number', unit: 'km', min: 8, max: 15, step: '0.5' },
    { name: 'hours', label: 'Hours', type: 'number', min: 0, max: 2, step: '0.25' },
    { name: 'minutes', label: 'Minutes', type: 'number', min: 0, max: 59, step: '1' },
  ],
  compute: (v) => {
    const totalMin = v.hours*60 + v.minutes; const pace = totalMin / v.distance; const pMin = Math.floor(pace); const pSec = Math.round((pace-pMin)*60)
    return { result: pace, label: '10K Pace', unit: 'min/km', steps: [
      { label: 'Finish time', value: totalMin.toFixed(0)+' min' },
      { label: 'Pace', value: pMin+':'+pSec.toString().padStart(2,'0')+' /km' },
      { label: 'Speed', value: (v.distance/(totalMin/60)).toFixed(1)+' km/h' },
    ]}
  }, description: 'Calculate your 10K race pace. Plan splits for a successful 10 km race day.', formula: 'Pace = goal time (min) / 10', interpretation: '10K pace is between 5K and half-marathon effort. Find a sustainable rhythm.'
}

export default calcDef
