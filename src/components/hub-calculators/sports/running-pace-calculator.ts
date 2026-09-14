import { z } from 'zod'
import { paceSchema } from '../../../lib/sports-schemas'
import type { CalcDef } from '../../../lib/generic-fallback'

const raceDistances = [
  { label: '400 m', km: 0.4 },
  { label: '800 m', km: 0.8 },
  { label: '1500 m (mile)', km: 1.5 },
  { label: '5 km', km: 5 },
  { label: '10 km', km: 10 },
  { label: 'Half marathon', km: 21.0975 },
  { label: 'Marathon', km: 42.195 },
  { label: 'Ultra 50 km', km: 50 },
  { label: 'Ultra 100 km', km: 100 },
]

function levelName(paceMinKm: number): string {
  if (paceMinKm < 3.0) return 'Elite'
  if (paceMinKm < 4.0) return 'Advanced'
  if (paceMinKm < 5.0) return 'Intermediate'
  if (paceMinKm < 6.0) return 'Recreational'
  if (paceMinKm < 7.0) return 'Jogging'
  return 'Walking'
}

const calcDef: CalcDef = {
  schema: paceSchema,
  fields: [
    { name: 'distance', label: 'Distance', type: 'number', unit: 'km', min: 0.1, step: '0.1' },
    { name: 'hours', label: 'Hours', type: 'number', min: 0, step: '1' },
    { name: 'minutes', label: 'Minutes', type: 'number', min: 0, max: 59, step: '1' },
    { name: 'seconds', label: 'Seconds', type: 'number', min: 0, max: 59, step: '1' },
  ],
  defaults: { distance: '5', hours: '0', minutes: '25', seconds: '0' },
  presets: [
    { label: '5 km run', values: { distance: '5', hours: '0', minutes: '25', seconds: '0' } },
    { label: '10 km run', values: { distance: '10', hours: '0', minutes: '50', seconds: '0' } },
    { label: 'Half marathon', values: { distance: '21.0975', hours: '1', minutes: '45', seconds: '0' } },
    { label: 'Marathon', values: { distance: '42.195', hours: '4', minutes: '0', seconds: '0' } },
  ],
  compute: (v) => {
    const totalH = v.hours + v.minutes / 60 + v.seconds / 3600
    const speed = totalH > 0 ? v.distance / totalH : 0
    const paceMin = speed > 0 ? Math.floor(60 / speed) : 0
    const paceSec = speed > 0 ? Math.round((60 / speed - paceMin) * 60) : 0
    const paceNum = totalH > 0 ? totalH / v.distance * 60 : 0
    const paceMile = speed > 0 ? 60 / (speed * 1.609) : 0
    const paceMileMin = Math.floor(paceMile)
    const paceMileSec = Math.round((paceMile - paceMileMin) * 60)
    const level = levelName(paceNum)
    const raceProj = raceDistances.filter(r => r.km > v.distance).slice(0, 4).map(r => {
      const tMin = r.km * paceNum
      const h = Math.floor(tMin / 60)
      const m = Math.floor(tMin % 60)
      const s = Math.round((tMin % 1) * 60)
      return { race: r.label, time: `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} h:m:s` }
    })
    return {
      result: speed, label: 'Running Speed', unit: 'km/h',
      steps: [
        { label: 'Distance', value: `${v.distance} km (${(v.distance * 0.6214).toFixed(2)} mi)` },
        { label: 'Elapsed time', value: `${v.hours}h ${v.minutes}m ${v.seconds}s` },
        { label: 'Pace per km', value: `${paceMin}:${paceSec.toString().padStart(2, '0')} /km` },
        { label: 'Pace per mile', value: `${paceMileMin}:${paceMileSec.toString().padStart(2, '0')} /mi` },
        { label: 'Speed', value: `${speed.toFixed(2)} km/h (${(speed * 0.6214).toFixed(2)} mph)` },
        { label: 'Runner level', value: level },
      ],
      extras: [
        { label: 'Pace per km', value: `${paceMin}:${paceSec.toString().padStart(2, '0')} /km` },
        { label: 'Pace per mile', value: `${paceMileMin}:${paceMileSec.toString().padStart(2, '0')} /mi` },
        { label: 'Speed', value: speed.toFixed(2) + ' km/h (' + (speed * 0.6214).toFixed(2) + ' mph)' },
        { label: 'Runner level', value: level },
        { label: '5 km projection', value: raceProj[0] ? raceProj[0].time : 'N/A' },
        { label: '10 km projection', value: raceProj[1] ? raceProj[1].time : 'N/A' },
        { label: 'Half marathon projection', value: raceProj[2] ? raceProj[2].time : 'N/A' },
        { label: 'Marathon projection', value: raceProj[3] ? raceProj[3].time : 'N/A' },
        { label: 'Cadence tip', value: 'Optimal stride cadence: ~170-180 steps/min' },
        { label: 'Energy cost', value: `~1 kcal per kg per km at this pace` },
        { label: 'Heart rate zones', value: 'Easy: 60-70% HRmax. Tempo: 75-85%. Interval: 85-95%.' },
        { label: 'Training tip', value: 'Track progress consistently rather than comparing single measurements.' },
      ],
    }
  },
  description: 'Determine your running pace per km and per mile from any distance and time. Features race projections, runner level classification, and heart rate zone tips.'
}

export default calcDef
