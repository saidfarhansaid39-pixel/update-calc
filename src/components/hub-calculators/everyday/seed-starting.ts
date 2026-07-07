import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ frostDate: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), weeksBefore: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), daysToGerminate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hardeningDays: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'frostDate', label: 'Last Frost Date (day of year 1-365)', type: 'number', min: 1, max: 365, step: '1' },
    { name: 'weeksBefore', label: 'Start Seeds X Weeks Before Frost', type: 'number', min: 1, max: 16, step: '1' },
    { name: 'daysToGerminate', label: 'Days to Germinate', type: 'number', min: 1, max: 30, step: '1' },
    { name: 'hardeningDays', label: 'Hardening Off Days', type: 'number', min: 0, max: 14, step: '1' },
  ],
  compute: (v) => {
    const startDay = v.frostDate - v.weeksBefore * 7
    const germEndDay = startDay + v.daysToGerminate
    const transplantDay = v.frostDate + v.hardeningDays
    return { result: startDay, label: 'Start Seeds on Day', unit: '', steps: [{ label: 'Seed Start Date', value: `Day ${Math.max(1, Math.round(startDay))}` }, { label: 'Germination Ends', value: `Day ${Math.round(germEndDay)}` }, { label: 'Hardening Begins', value: `Day ${Math.round(v.frostDate)}` }, { label: 'Transplant Outdoors', value: `Day ${Math.round(transplantDay)}` }] }
  },
  description: 'Calculate seed starting and transplanting dates based on last frost date. Plan your indoor seed starting schedule for spring planting.',
  formula: 'Seed Start = FrostDate - Weeks×7 | Transplant = FrostDate + HardeningDays',
  interpretation: 'Cool season crops (broccoli, lettuce): start 6-8 weeks before frost. Warm season (tomatoes, peppers): start 8-10 weeks before. Melons and squash: start 3-4 weeks before. Harden off 7-10 days before transplanting.'
}

export default calcDef
