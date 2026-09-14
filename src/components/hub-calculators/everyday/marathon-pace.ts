import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), minutes: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), seconds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), distanceUnit: z.string().min(1) }),
  defaults: { hours: '3', minutes: '30', seconds: '0', distanceUnit: 'marathonMi' },
  presets: [
    { label: 'Sub-4 Marathon', values: { hours: '3', minutes: '59', seconds: '59', distanceUnit: 'marathonMi' } },
    { label: 'Sub-2 Half Marathon', values: { hours: '1', minutes: '59', seconds: '0', distanceUnit: 'halfMi' } },
    { label: 'Fast 5K (25 min)', values: { hours: '0', minutes: '25', seconds: '0', distanceUnit: '5kMi' } },
  ],
  fields: [
    { name: 'hours', label: 'Target Hours', type: 'number', min: 0, max: 24, step: '1' },
    { name: 'minutes', label: 'Minutes', type: 'number', min: 0, max: 59, step: '5' },
    { name: 'seconds', label: 'Seconds', type: 'number', min: 0, max: 59, step: '10' },
    { name: 'distanceUnit', label: 'Distance', type: 'select', options: [{ label: 'Marathon (26.22 mi)', value: 'marathonMi' }, { label: 'Half Marathon (13.11 mi)', value: 'halfMi' }, { label: '10K (6.214 mi)', value: '10kMi' }, { label: '5K (3.107 mi)', value: '5kMi' }] },
  ],
  compute: (v) => {
    const raceDistances: Record<string, number> = { marathonMi: 26.22, halfMi: 13.11, '10kMi': 6.214, '5kMi': 3.107 }
    const dist = raceDistances[v.distanceUnit]
    const totalSeconds = v.hours * 3600 + v.minutes * 60 + v.seconds
    const pacePerMileSeconds = totalSeconds / dist
    const paceMin = Math.floor(pacePerMileSeconds / 60)
    const paceSec = Math.round(pacePerMileSeconds % 60)
    return { result: pacePerMileSeconds, label: 'Pace', unit: '/mi', steps: [
      { label: '1. Total Seconds', value: `${v.hours}h × 3600 + ${v.minutes}m × 60 + ${v.seconds}s = ${totalSeconds} sec` },
      { label: '2. Distance', value: `${dist.toFixed(3)} mi (${v.distanceUnit.replace('Mi','').replace('mi','').toUpperCase() || v.distanceUnit})` },
      { label: '3. Pace Formula', value: `${totalSeconds} sec ÷ ${dist.toFixed(3)} mi = ${pacePerMileSeconds.toFixed(2)} sec/mi` },
      { label: '4. Convert to Min:Sec', value: `⌊${pacePerMileSeconds.toFixed(2)} ÷ 60⌋ = ${paceMin} min, remainder ${paceSec} sec` },
      { label: '5. Required Pace', value: `${paceMin}:${paceSec.toString().padStart(2, '0')} per mile` },
    ],
    extras: [
      { label: 'Negative Splits', value: 'Running the second half faster than the first is optimal. Aim for 1-3% faster in the second half to avoid hitting the wall.' },
      { label: 'Pacing Strategy', value: 'For your first marathon, start at goal pace + 10-15 sec/mi for the first 5 miles. The wall hits at mile 18-22 if you go out too fast.' },
      { label: 'Fueling', value: 'Consume 30-60g carbs per hour during a marathon. Practice fueling during long runs — your gut needs training too.' },
      { label: 'Hydration', value: 'Drink to thirst: 4-6 oz every 20 min. Overhydration (hyponatremia) is more dangerous than dehydration in most runners.' },
      { label: 'Heart Rate Zones', value: 'Most marathoners race in Zone 3-4 (75-85% max HR). If your HR spikes after mile 18, you started too fast.' },
      { label: 'Shoe Rotation', value: 'Rotate 2-3 pairs of running shoes. Each pair lasts 300-500 miles. Replace before race day with 50-100 miles on new shoes.' },
      { label: 'Course Elevation', value: 'Adjust pace for hills: add 5-10 sec/mi for every 100 ft of climb. Descending too fast damages quads and slows later miles.' },
      { label: 'BQ Standards', value: 'Boston Qualifying times vary by age/gender: 18-34 men need 3:00 (6:52/mi), women need 3:30 (8:00/mi). Add 5 min per 5-year age group.' },
    ]}
  },
  description: 'Calculate required running pace per mile for marathon, half marathon, 10K, or 5K based on target finish time. Includes pacing strategy and race-day tips.',
  formula: 'Pace (sec/mi) = TotalSeconds / Distance. Pace (min:sec) = ⌊PaceSec/60⌋ : (PaceSec mod 60). Example: 3:30 marathon = 210 min ÷ 26.22 mi = 8:00/mi.',
  interpretation: 'Sub-4 hour marathon: 9:09/mi. Sub-3:30: 8:00/mi. Sub-3:00: 6:50/mi. Negative splits (running second half 1-3% faster) produce best race times. Most runners hit the wall at mile 18-22 due to glycogen depletion.'
}

export default calcDef
