import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ rooms: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), binsPerRoom: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), shelving: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), labels: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), hourlyRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), hours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'rooms', label: 'Rooms to Organize', type: 'number', min: 1, step: '1' },
    { name: 'binsPerRoom', label: 'Storage Bins per Room', type: 'number', min: 0, step: '1' },
    { name: 'shelving', label: 'Shelving Units', type: 'number', min: 0, step: '1' },
    { name: 'labels', label: 'Label Packs', type: 'number', min: 0, step: '1' },
    { name: 'hourlyRate', label: 'Organizer Hourly Rate ($)', type: 'number', min: 0, step: '5' },
    { name: 'hours', label: 'Hours of Labor', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => { const r = v.rooms; const bins = v.binsPerRoom * r; const binCost = bins * 8; const shelfCost = v.shelving * 45; const labelCost = v.labels * 6; const laborCost = v.hourlyRate * v.hours; const total = binCost + shelfCost + labelCost + laborCost; return { result: total, label: 'Total Organization Cost', unit: '$', steps: [{ label: 'Storage Bins', value: `${bins} bins × $8 = $${binCost.toFixed(0)}` }, { label: 'Shelving', value: `${v.shelving} units × $45 = $${shelfCost.toFixed(0)}` }, { label: 'Labels', value: `$${labelCost.toFixed(0)}` }, { label: 'Labor', value: `${v.hours} hrs × $${v.hourlyRate}/hr = $${laborCost.toFixed(0)}` }, { label: 'Total', value: `$${total.toFixed(0)}` }] } },
  description: 'Estimate the total cost of organizing your home including storage bins, shelving, labels, and professional organizer labor.',
  formula: 'Total = (Rooms × Bins × $8) + (Shelving × $45) + (Labels × $6) + (Hours × Hourly Rate)',
  interpretation: 'Professional organizing averages $50-100/hr. DIY costs less but requires time. Most homes need 10-20 bins and 2-5 shelving units for full organization.'
}

export default calcDef
