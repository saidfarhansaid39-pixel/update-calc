import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: paceSchema,
  fields: [
    { name: 'distance', label: 'Distance', type: 'number', unit: 'km', min: 0.1, step: '0.1' },
    { name: 'hours', label: 'Hours', type: 'number', min: 0, step: '1' },
    { name: 'minutes', label: 'Minutes', type: 'number', min: 0, max: 59, step: '1' },
    { name: 'seconds', label: 'Seconds', type: 'number', min: 0, max: 59, step: '1' },
  ],
  compute: (v) => {
    const totalH = v.hours + v.minutes/60 + v.seconds/3600; const speed = totalH > 0 ? v.distance / totalH : 0
    const pMin = speed > 0 ? Math.floor(60/speed) : 0; const pSec = speed > 0 ? Math.round((60/speed - pMin)*60) : 0
    return { result: speed, label: 'Running Speed', unit: 'km/h', steps: [
      { label: 'Distance', value: v.distance+' km' }, { label: 'Time', value: v.hours+'h '+v.minutes+'m '+v.seconds+'s' },
      { label: 'Pace', value: pMin+':'+pSec.toString().padStart(2,'0')+' /km' }, { label: 'Speed', value: speed.toFixed(2)+' km/h' },
    ]}
  }, description: 'Calculate running pace and speed from distance and time. Essential for race planning and training.', formula: 'Speed = distance / time', interpretation: 'Faster speeds and lower pace numbers = better running performance.'
}

export default calcDef
