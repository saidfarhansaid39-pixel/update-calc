import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ fingerMm: z.string().min(1).refine(v => parseFloat(v) > 30, '>30'), region: z.string().min(1) }),
  fields: [
    { name: 'fingerMm', label: 'Finger Circumference (mm)', type: 'number', min: 38, max: 75, step: '0.5' },
    { name: 'region', label: 'Ring System', type: 'select', options: [{ label: 'US & Canada', value: 'us' }, { label: 'UK & Australia', value: 'uk' }, { label: 'Europe (ISO)', value: 'eu' }, { label: 'Japan', value: 'jp' }] },
  ],
  defaults: { fingerMm: '54', region: 'us' },
  presets: [
    { label: 'Average Woman', values: { fingerMm: '53', region: 'us' } },
    { label: 'Average Man', values: { fingerMm: '62', region: 'us' } },
    { label: 'Small Ring Size', values: { fingerMm: '48', region: 'us' } },
    { label: 'Large Ring Size', values: { fingerMm: '68', region: 'uk' } },
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
    return { result: parseFloat(regionSizes[v.region] || usSize), label: `Ring Size (${v.region.toUpperCase()})`, unit: '', steps: [{ label: 'Circumference', value: `${v.fingerMm} mm` }, { label: 'Diameter', value: `${(v.fingerMm / Math.PI).toFixed(1)} mm` }, { label: 'US', value: usSize }, { label: 'UK', value: ukSize }, { label: 'Europe', value: euSize }, { label: 'Japan', value: jpSize }] ,
    extras: [
      { label: 'Measuring Tips', value: 'Measure at the base of the finger. Use a flexible measuring tape or string + ruler. Wrap snugly but not tight. Measure 3 times and average. Best to measure at end of day when fingers are at largest' },
      { label: 'Temperature Effect', value: 'Fingers swell in heat (0.5-1 size larger) and shrink in cold (0.5 size smaller). Ideal measuring conditions: room temperature (68-72°F). Avoid measuring after exercise, caffeine, or salty meals' },
      { label: 'Knuckle Consideration', value: 'If knuckles are significantly larger than finger base, measure both and choose a size halfway between. A ring that fits the base but won\'t pass the knuckle needs resizing or a split-shank design' },
      { label: 'Average Ring Sizes', value: 'Women: US 6-7 (51-53 mm circumference) is most common. Men: US 9-10 (60-62 mm) most common. Ring finger (left hand) is typically slightly larger than right for right-handed people' },
      { label: 'Width of Ring Band', value: 'Wide bands (6 mm+) run tighter than narrow bands. For rings over 6 mm wide, order 0.5-1 size larger. A 3 mm band fits true to size. Consider the specific ring design when selecting size' },
      { label: 'Resizing Limitations', value: 'Rings can typically be resized ±2 sizes. Eternity bands and tension-set rings cannot be resized. Platinum resizing costs more than gold. Pave-set bands may lose stones during resizing — consult a jeweler' },
      { label: 'International Size Conversions', value: 'US→UK: subtract ~12 from US size for letter (US 7 = UK N/N.5). Europe (ISO): inner circumference in mm (54 mm = EU 54). Japan: same numbers as US but one size smaller scale' },
    ]}
  },
  description: 'Convert finger circumference (mm) to ring sizes across US/Canada, UK/Australia, European ISO, and Japanese sizing systems with diameter and cross-system reference.',
  formula: 'Diameter(mm) = Circumference(mm) ÷ π. EU size ≈ Circumference × 2 ÷ π. US/UK/JP sizes from standard mm-to-size lookup table with 0.5 increments for precise matching.',
  interpretation: 'A 54 mm finger circumference: diameter = 17.2 mm, US size = 7, UK = N.5, EU = 54, JP = 14. For accurate measurement: measure at the base of the finger with a flexible tape or string, take the measurement at room temperature and at the end of the day (fingers are largest). Account for knuckle size — if knuckles are significantly larger, choose a size that passes the knuckle comfortably. Wide bands (6+ mm) require 0.5-1 size larger. Ring sizing is most accurate when done with a professional ring sizer or by trying on sample rings at a jeweler.'
}

export default calcDef
