import { z } from 'zod'
import { paceSchema, paceSchemaDistOnly, caloriesSchema, caloriesDistanceSchema, heartRateSchema, targetHrSchema, recoveryHrSchema, oneRmSchema, wilksSchema, vo2maxSchema, cyclingSchema, cyclingPowerSchema, cadenceSchema, swimPaceSchema, swimStrokeSchema, pushupSchema, cooperSchema, beepSchema, jumpSchema, sprintSchema, agilitySchema, tdeeSchema, fitnessAgeSchema, bodyFatSchema, metActivityOptions, hiitMetOptions, walkMetOptions, runMetOptions, intensityOptions, activityLevelOptions } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: paceSchemaDistOnly,
  fields: [
    { name: 'distance', label: 'Distance', type: 'number', unit: 'km', min: 21, max: 22, step: '0.1' },
    { name: 'hours', label: 'Goal Hours', type: 'number', min: 1, max: 4, step: '0.25' },
    { name: 'minutes', label: 'Extra Minutes', type: 'number', min: 0, max: 59, step: '1' },
  ],
  compute: (v) => {
    const totalMin = v.hours*60 + v.minutes; const pace = totalMin / v.distance; const pMin = Math.floor(pace); const pSec = Math.round((pace-pMin)*60)
    return { result: pace, label: 'Required Pace', unit: 'min/km', steps: [
      { label: 'Goal time', value: v.hours+'h '+v.minutes+'m' },
      { label: 'Pace needed', value: pMin+':'+pSec.toString().padStart(2,'0')+' /km' },
      { label: 'Speed', value: (v.distance/(totalMin/60)).toFixed(1)+' km/h' },
    ]}
  }, description: 'Calculate the pace required to achieve your half marathon (21.1 km) goal time.', formula: 'Pace = goal time (min) / 21.1', interpretation: 'Consistent pacing is critical for half marathon success. Start slightly conservatively.'
}

export default calcDef
