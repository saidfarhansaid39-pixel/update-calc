import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({
    footprint: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    biocapacity: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'footprint', label: 'Ecological Footprint (gha)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'biocapacity', label: 'Biocapacity (gha)', type: 'number', min: 0.1, step: '0.1' },
    ],
  presets: [
    { label: 'US average', values: { cropland: '0.5', pasture: '0.3', forest: '0.2', fishing: '0.1', builtUp: '0.15' } },
    { label: 'EU average', values: { cropland: '0.4', pasture: '0.15', forest: '0.25', fishing: '0.05', builtUp: '0.1' } },
    { label: 'Global average', values: { cropland: '0.3', pasture: '0.1', forest: '0.1', fishing: '0.05', builtUp: '0.05' } },
    { label: 'Developing nation', values: { cropland: '0.2', pasture: '0.05', forest: '0.1', fishing: '0.02', builtUp: '0.02' } },
    { label: 'One-planet living', values: { cropland: '0.25', pasture: '0.05', forest: '0.1', fishing: '0.02', builtUp: '0.05' } }
    ],
  compute: (v) => {
    const ratio = v.biocapacity > 0 ? v.footprint / v.biocapacity : 1
    const daysInYear = 365
    const overshootDay = Math.round(daysInYear / ratio)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let dayOfYear = overshootDay
    let monthIdx = 0
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    for (let i = 0; i < monthDays.length; i++) {
      if (dayOfYear <= monthDays[i]) { monthIdx = i; break }
      dayOfYear -= monthDays[i]
    }
    return {
      result: overshootDay, label: 'Earth Overshoot Day', unit: 'day of year',
      steps: [
        { label: 'Ecological footprint', value: `${v.footprint} gha` },
        { label: 'Biocapacity', value: `${v.biocapacity} gha` },
        { label: 'Footprint / Biocapacity', value: `${ratio.toFixed(2)}` },
        { label: 'Overshoot day', value: `${monthNames[monthIdx]} ${dayOfYear} (day ${overshootDay})` },
        { label: 'Earths needed', value: `${ratio.toFixed(2)} planets` },
        step("Global 2024 overshoot", "Aug 1 (reference)"),
      ]
,
    extras: [
      { label: "Environmental Context", value: "Ecological footprint measures human demand on nature. Humanity currently uses ~1.75 Earths annually — an overshoot that depletes natural capital." },
      { label: "Measurement Method", value: "National Footprint Accounts use UN data on production, trade, and land use. Biocapacity calculated from crop, forest, grazing, and fishing area × yield factors." },
      { label: "Conservation Note", value: "Reducing per-capita footprint from 2.7 to <1.6 gha is essential for sustainability. High-income countries have 3-5× the global average footprint." },
      { label: "Typical Ranges", value: "World average: 2.7 gha/person. US: 8.1, EU: 4.5, China: 3.4, India: 1.1. Biocapacity per person declining as population grows." },
      { label: "Related Concepts", value: "Planetary boundaries, doughnut economics, one-planet living, circular economy, natural capital accounting, SDGs." }
    ]}
  },
  description: 'Earth Overshoot Day marks when humanity\'s resource consumption exceeds Earth\'s annual biocapacity. Each year, the date comes earlier as consumption grows.',
  formula: 'Overshoot Day = 365 × (Biocapacity / Footprint) | Ratio = Footprint / Biocapacity',
  interpretation: 'Global Overshoot Day 2024: Aug 1. When ratio = 1.7, we need 1.7 Earths. Target: push Overshoot Day later by reducing footprint.'
}

export default calcDef
