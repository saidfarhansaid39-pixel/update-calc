import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ temperature: z.string().min(1).refine(v => parseFloat(v) > -50, '>-50'), dewPoint: z.string().min(1).refine(v => parseFloat(v) > -50, '>-50') }),
  fields: [
    { name: 'temperature', label: 'Air Temperature (°F)', type: 'number', min: -20, max: 130, step: '1' },
    { name: 'dewPoint', label: 'Dew Point (°F)', type: 'number', min: -20, max: 130, step: '1' },
  ],
  compute: (v) => { const t = parseFloat(v.temperature)||0; const dp = parseFloat(v.dewPoint)||0; const es = 6.112 * Math.exp((17.67 * t) / (t + 243.5)); const e = 6.112 * Math.exp((17.67 * dp) / (dp + 243.5)); const rh = (e / es) * 100; return { result: rh, label: 'Relative Humidity', unit: '%', steps: [{ label: 'Air Temp', value: `${t}°F` }, { label: 'Dew Point', value: `${dp}°F` }, { label: 'Relative Humidity', value: `${rh.toFixed(1)}%` }] } },
  description: 'Calculate relative humidity from air temperature and dew point. Uses the Magnus formula for accurate vapor pressure calculations.',
  formula: 'RH = 100 × exp((17.67×DP)/(DP+243.5) − (17.67×T)/(T+243.5))',
  interpretation: 'Comfort range: 30-60% RH. Below 30%: dry air (cracked skin, static). Above 60%: mold risk, feels stuffy. Dew point >60°F feels humid; >70°F is oppressive.'
}

export default calcDef
