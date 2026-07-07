import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ fingerMm: z.string().min(1).refine(v => parseFloat(v) > 30, '>30'), region: z.string().min(1) }),
  fields: [
    { name: 'fingerMm', label: 'Finger Circumference (mm)', type: 'number', min: 38, max: 75, step: '0.5' },
    { name: 'region', label: 'Ring System', type: 'select', options: [{ label: 'US & Canada', value: 'us' }, { label: 'UK & Australia', value: 'uk' }, { label: 'Europe (ISO)', value: 'eu' }, { label: 'Japan', value: 'jp' }] },
  ],
  compute: (v) => {
    const ukSizes = ['A', 'A.5', 'B', 'B.5', 'C', 'C.5', 'D', 'D.5', 'E', 'E.5', 'F', 'F.5', 'G', 'G.5', 'H', 'H.5', 'I', 'I.5', 'J', 'J.5', 'K', 'K.5', 'L', 'L.5', 'M', 'M.5', 'N', 'N.5', 'O']
    const usSizes = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13', '13.5', '14', '14.5', '15']
    const mmRanges = [37.8, 39.1, 40.4, 41.7, 43.0, 44.2, 45.5, 46.8, 48.0, 49.3, 50.6, 51.9, 53.1, 54.4, 55.7, 57.0, 58.3, 59.5, 60.8, 62.1, 63.4, 64.6, 65.9, 67.2, 68.5, 69.7, 71.0, 72.3, 73.6]
    let idx = mmRanges.findIndex(r => v.fingerMm <= r)
    if (idx < 0) idx = mmRanges.length - 1
    const usSize = usSizes[idx] || '15+'
    let ukSize = 'O+'
    if (idx >= 0 && idx < ukSizes.length) ukSize = ukSizes[idx]
    const euSize = (v.fingerMm / Math.PI * 2).toFixed(0)
    const jpSize = usSizes[idx] || '30+'
    const regionSizes: Record<string, string> = { us: `${usSize}`, uk: `${ukSize}`, eu: `${euSize}`, jp: `${jpSize}` }
    return { result: parseFloat(regionSizes[v.region] || usSize), label: `Ring Size (${v.region.toUpperCase()})`, unit: '', steps: [{ label: 'Circumference', value: `${v.fingerMm} mm` }, { label: 'Diameter', value: `${(v.fingerMm / Math.PI).toFixed(1)} mm` }, { label: 'US', value: usSize }, { label: 'UK', value: ukSize }, { label: 'Europe', value: euSize }, { label: 'Japan', value: jpSize }] }
  },
  description: 'Convert finger circumference (mm) to ring sizes across US, UK, European, and Japanese sizing systems.',
  formula: 'Diameter = Circumference / π | US size from standard mm-to-size chart',
  interpretation: 'Measure at the base of the finger. Knuckles may require 0.5-1 size larger. Fingers swell in heat and shrink in cold. Average women\'s ring: US 6-7 (51-53 mm). Average men\'s: US 9-10 (60-62 mm).'
}

export default calcDef
