import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ attendees: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), avgSalary: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), hours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), minutes: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), overheadPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'attendees', label: 'Number of Attendees', type: 'number', min: 1, step: '1' },
    { name: 'avgSalary', label: 'Avg Annual Salary ($)', type: 'number', min: 0, step: '10000' },
    { name: 'hours', label: 'Meeting Hours', type: 'number', min: 0, step: '0.5' },
    { name: 'minutes', label: 'Extra Minutes', type: 'number', min: 0, step: '5' },
    { name: 'overheadPct', label: 'Overhead % (space, tech, etc.)', type: 'number', min: 0, step: '5' },
  ],
  compute: (v) => { const totalMins = v.hours * 60 + v.minutes; const hourlyCostPerPerson = v.avgSalary / 2080; const totalHourlyCost = hourlyCostPerPerson * v.attendees; const minCost = totalHourlyCost / 60; const baseCost = minCost * totalMins; const overhead = baseCost * (v.overheadPct / 100); const totalCost = baseCost + overhead; const costPerPerson = totalCost / v.attendees; return { result: totalCost, label: 'Total Meeting Cost', unit: '$', steps: [{ label: 'Duration', value: `${v.hours}h ${v.minutes}m (${totalMins} min)` }, { label: 'Cost per Attendee/hr', value: `$${hourlyCostPerPerson.toFixed(2)}` }, { label: 'Base Cost', value: `$${baseCost.toFixed(2)}` }, { label: 'Overhead', value: `$${overhead.toFixed(2)}` }, { label: 'Total Cost', value: `$${totalCost.toFixed(2)}` }] } },
  description: 'Calculate the true cost of a meeting based on attendee salaries, duration, and overhead to improve meeting efficiency decisions.',
  formula: 'Cost = (AvgSalary / 2080 hrs × Attendees × Minutes / 60) × (1 + Overhead%)',
  interpretation: 'A 1-hour meeting with 10 people earning $100k costs ~$480+ in direct salary. Add overhead for benefits (30-40%) and productivity loss. Consider if the meeting could be an email.'
}

export default calcDef
