import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: swimPaceSchema,
  fields: [
    { name: 'distance', label: 'Distance', type: 'number', unit: 'm', min: 1, step: '1' },
    { name: 'hours', label: 'Hours', type: 'number', min: 0, step: '1' },
    { name: 'minutes', label: 'Minutes', type: 'number', min: 0, max: 59, step: '1' },
    { name: 'seconds', label: 'Seconds', type: 'number', min: 0, max: 59, step: '1' },
  ],
  compute: (v) => {
    const totalSec = v.hours*3600 + v.minutes*60 + v.seconds; const pace100 = totalSec / (v.distance/100)
    const pMin = Math.floor(pace100/60); const pSec = Math.round(pace100%60)
    const speed = v.distance/1000 / (totalSec/3600)
    return { result: speed, label: 'Swim Speed', unit: 'km/h', steps: [
      { label: 'Distance', value: v.distance+' m' }, { label: 'Time', value: v.hours+'h '+v.minutes+'m '+v.seconds+'s' },
      { label: 'Pace/100m', value: pMin+':'+pSec.toString().padStart(2,'0')+' min/100m' },
      { label: 'Speed', value: speed.toFixed(2)+' km/h' },
    ]}
  }, description: 'Calculate swimming pace per 100m and average speed. CSS (Critical Swim Speed) is threshold pace.', formula: 'Pace per 100m = total time (s) / (distance / 100)', interpretation: 'Lower pace per 100m = faster swimming. CSS approximates lactate threshold pace.'
}

export default calcDef
