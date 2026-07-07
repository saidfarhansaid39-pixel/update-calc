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
    const totalH = v.hours + v.minutes / 60 + v.seconds / 3600
    const speed = totalH > 0 ? v.distance / totalH : 0
    const paceMinPerKm = speed > 0 ? Math.floor(60 / speed) : 0
    const paceSecPerKm = speed > 0 ? Math.round((60 / speed - paceMinPerKm) * 60) : 0
    return {
      result: speed, label: 'Average Speed', unit: 'km/h',
      steps: [
        { label: 'Distance', value: `${v.distance} km` },
        { label: 'Time', value: `${v.hours}h ${v.minutes}m ${v.seconds}s (${totalH.toFixed(2)} h)` },
        { label: 'Speed', value: `${speed.toFixed(2)} km/h` },
        { label: 'Pace', value: `${paceMinPerKm}:${paceSecPerKm.toString().padStart(2, '0')} /km` },
        { label: '5 km finish', value: `${(5 / speed * 60).toFixed(1)} min` },
        { label: '10 km finish', value: `${(10 / speed * 60).toFixed(1)} min` },
      ]
}
  },
  description: 'Calculate running speed and pace from distance and time. Essential for race planning, interval training, and tracking performance improvements.'
}

export default calcDef
