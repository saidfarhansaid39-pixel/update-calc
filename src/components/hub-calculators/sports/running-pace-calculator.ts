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
    const paceMin = speed > 0 ? Math.floor(60 / speed) : 0
    const paceSec = speed > 0 ? Math.round((60 / speed - paceMin) * 60) : 0
    const paceMile = speed > 0 ? 60 / (speed * 1.609) : 0
    const paceMileMin = Math.floor(paceMile)
    const paceMileSec = Math.round((paceMile - paceMileMin) * 60)
    return {
      result: speed, label: 'Running Speed', unit: 'km/h',
      steps: [
        { label: 'Distance', value: `${v.distance} km (${(v.distance * 0.6214).toFixed(2)} mi)` },
        { label: 'Elapsed time', value: `${v.hours}h ${v.minutes}m ${v.seconds}s` },
        { label: 'Pace per km', value: `${paceMin}:${paceSec.toString().padStart(2, '0')} /km` },
        { label: 'Pace per mile', value: `${paceMileMin}:${paceMileSec.toString().padStart(2, '0')} /mi` },
        { label: 'Speed', value: `${speed.toFixed(2)} km/h (${(speed * 0.6214).toFixed(2)} mph)` },
      ]
}
  },
  description: 'Determine your running pace per kilometer and per mile from any distance and time. Plan training paces for speed work, tempo runs, and easy days.'
}

export default calcDef
