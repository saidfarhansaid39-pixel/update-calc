import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), minutes: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), seconds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distUnit: z.enum(['mi', 'km']) }),
  defaults: { hours: '1', minutes: '45', seconds: '0', distance: '13.1', distUnit: 'mi' },
  presets: [
    { label: 'Half Marathon (1:45)', values: { hours: '1', minutes: '45', seconds: '0', distance: '13.1', distUnit: 'mi' } },
    { label: 'Marathon (3:30 goal)', values: { hours: '3', minutes: '30', seconds: '0', distance: '26.2', distUnit: 'mi' } },
    { label: '10K (45 min)', values: { hours: '0', minutes: '45', seconds: '0', distance: '10', distUnit: 'km' } },
  ],
  fields: [
    { name: 'hours', label: 'Hours', type: 'number', min: 0, max: 24, step: '1' },
    { name: 'minutes', label: 'Minutes', type: 'number', min: 0, max: 59, step: '1' },
    { name: 'seconds', label: 'Seconds', type: 'number', min: 0, max: 59, step: '1' },
    { name: 'distance', label: 'Distance', type: 'number', min: 0.1, step: '1' },
    { name: 'distUnit', label: 'Distance Unit', type: 'select', options: [{ label: 'Miles', value: 'mi' }, { label: 'Kilometers', value: 'km' }] },
  ],
  compute: (v) => { const h = parseFloat(v.hours)||0; const m = parseFloat(v.minutes)||0; const s = parseFloat(v.seconds)||0; const d = parseFloat(v.distance)||0; const totalSec = h * 3600 + m * 60 + s; const paceSecPerUnit = totalSec / d; const paceMin = Math.floor(paceSecPerUnit / 60); const paceSec = Math.round(paceSecPerUnit % 60); const label = v.distUnit === 'mi' ? 'min/mile' : 'min/km'; const marathonDist = v.distUnit === 'mi' ? 26.21875 : 42.195; const halfDist = marathonDist / 2; const marathonTimeSec = paceSecPerUnit * marathonDist; const halfTimeSec = paceSecPerUnit * halfDist; const hr = Math.floor(marathonTimeSec / 3600); const min = Math.floor((marathonTimeSec % 3600) / 60); const sec = Math.floor(marathonTimeSec % 60); return { result: paceSecPerUnit, label: 'Pace', unit: label, steps: [
    { label: '1. Total Time in Sec', value: `${h}h×3600 + ${m}m×60 + ${s}s = ${totalSec} sec` },
    { label: '2. Pace Formula', value: `${totalSec} sec ÷ ${d} ${v.distUnit} = ${paceSecPerUnit.toFixed(2)} sec/${v.distUnit}` },
    { label: '3. Convert to Min:Sec', value: `⌊${paceSecPerUnit.toFixed(2)}÷60⌋ = ${paceMin}:${paceSec.toString().padStart(2, '0')} ${label}` },
    { label: '4. Half Marathon Projection', value: `${paceMin}:${paceSec.toString().padStart(2, '0')} × ${halfDist.toFixed(1)} ${v.distUnit} = ${Math.floor(halfTimeSec/3600)}h ${Math.floor((halfTimeSec%3600)/60)}m ${Math.floor(halfTimeSec%60)}s` },
    { label: '5. Full Marathon Projection', value: `${paceMin}:${paceSec.toString().padStart(2, '0')} × ${marathonDist.toFixed(1)} ${v.distUnit} = ${hr}h ${min}m ${sec.toString().padStart(2, '0')}s` },
  ] ,
    extras: [
      { label: 'Pace Bands', value: 'Print a pace band for race day listing each mile/km split. Even 5 sec/mi drift can cost 2+ min in a marathon.' },
      { label: 'Yasso 800s', value: 'Bart Yasso\'s predictor: your 800m time in min:sec roughly predicts your marathon time in hours:min. 3:00 800m = ~3:00 marathon.' },
      { label: 'Temperature Impact', value: 'For every 5°F above 60°F, your pace slows 0.5-1%. Above 70°F, slow down 5-10% to avoid heat exhaustion.' },
      { label: 'Altitude Effect', value: 'Racing at 5,000+ ft altitude slows most runners by 3-7%. Live-high train-low improves red blood cell count.' },
      { label: 'Carb Loading', value: 'Carbs store ~2,000-2,500 kcal of glycogen for a marathon. Tapering and carbo-loading can boost stores by 20-40%.' },
      { label: 'Cushion vs Performance', value: 'Super-shoes (carbon plate + PEBA foam) improve running economy 2-4%. Break them in with 20+ miles before race day.' },
      { label: 'Half Marathon Strategy', value: 'The half marathon is ~90% aerobic. Your lactate threshold pace is your ideal half marathon pace — about 15-20 sec/mi slower than 10K pace.' },
      { label: 'Marathon Pacing', value: 'Run the first 5 miles at goal pace + 5 sec/mi. Miles 6-20 at goal pace. Last 10K at pace - 5-10 sec/mi if feeling strong.' },
    ]} },
  description: 'Calculate running pace from total time and distance, then project half marathon and full marathon finish times. Includes pacing strategies and race-day adjustments.',
  formula: 'Pace = TotalSec / Distance. Half = Pace × (MarathonDist/2). Full = Pace × MarathonDist. Marathon: 26.219 mi or 42.195 km.',
  interpretation: 'Elite marathoners run 4:30-5:30/mile (2:48-3:25/km). Recreational: 8-12 min/mile. Negative splitting (running second half faster) is recommended. Temperature, altitude, and course elevation significantly affect achievable pace.'
}

export default calcDef
