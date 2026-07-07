import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    footprint: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    biocapacity: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'footprint', label: 'Ecological Footprint (gha)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'biocapacity', label: 'Biocapacity (gha)', type: 'number', min: 0.1, step: '0.1' },
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
        { label: 'Global 2024 overshoot', value: 'Aug 1 (reference)' },
      ]
}
  },
  description: 'Earth Overshoot Day marks when humanity\'s resource consumption exceeds Earth\'s annual biocapacity. Each year, the date comes earlier as consumption grows.',
  formula: 'Overshoot Day = 365 × (Biocapacity / Footprint) | Ratio = Footprint / Biocapacity',
  interpretation: 'Global Overshoot Day 2024: Aug 1. When ratio = 1.7, we need 1.7 Earths. Target: push Overshoot Day later by reducing footprint.'
}

export default calcDef
