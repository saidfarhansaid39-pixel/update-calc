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
  defaults: { attendees: '10', avgSalary: '100000', hours: '1', minutes: '0', overheadPct: '30' },
  presets: [
    { label: 'Quick Standup (15 min)', values: { attendees: '5', avgSalary: '120000', hours: '0', minutes: '15', overheadPct: '30' } },
    { label: 'Weekly Team Meeting (1 hr)', values: { attendees: '10', avgSalary: '100000', hours: '1', minutes: '0', overheadPct: '30' } },
    { label: 'All-Hands (1 hr)', values: { attendees: '50', avgSalary: '90000', hours: '1', minutes: '0', overheadPct: '30' } },
    { label: 'Strategy Session (2 hr)', values: { attendees: '8', avgSalary: '150000', hours: '2', minutes: '0', overheadPct: '35' } },
  ],
  compute: (v) => { const totalMins = v.hours * 60 + v.minutes; const hourlyCostPerPerson = v.avgSalary / 2080; const totalHourlyCost = hourlyCostPerPerson * v.attendees; const minCost = totalHourlyCost / 60; const baseCost = minCost * totalMins; const overhead = baseCost * (v.overheadPct / 100); const totalCost = baseCost + overhead; const costPerPerson = totalCost / v.attendees; const weeklyCost = totalCost * 1; const annualCost = totalCost * 52; const productivityLoss = v.attendees * 0.15 * totalMins / 60 * hourlyCostPerPerson; return { result: totalCost, label: 'Total Meeting Cost', unit: '$', steps: [
    { label: 'Meeting Duration', value: `${v.hours}h ${v.minutes}m (${totalMins} min)` },
    { label: 'Hourly Cost per Person', value: `$${v.avgSalary.toFixed(0)} / 2080 hrs = $${hourlyCostPerPerson.toFixed(2)}/hr` },
    { label: 'Combined Hourly Rate', value: `$${hourlyCostPerPerson.toFixed(2)} × ${v.attendees} people = $${totalHourlyCost.toFixed(2)}/hr` },
    { label: 'Base Salary Cost', value: `$${totalHourlyCost.toFixed(2)}/hr × ${(totalMins / 60).toFixed(2)} hr = $${baseCost.toFixed(2)}` },
    { label: 'Overhead (${v.overheadPct}%)', value: `$${baseCost.toFixed(2)} × ${v.overheadPct}% = $${overhead.toFixed(2)}` },
    { label: 'Total Cost This Meeting', value: `$${totalCost.toFixed(2)}` },
    { label: 'Cost per Attendee', value: `$${costPerPerson.toFixed(2)}` },
    { label: 'Annual Cost (weekly meeting)', value: `$${annualCost.toFixed(0)}/year ($${(annualCost / v.attendees / 52).toFixed(2)}/person/meeting)` },
  ] ,
    extras: [
      { label: 'The "Could Be an Email" Test', value: 'If a meeting has no interactive/decision-making component, it could be an async update. Save 30-50% by replacing status updates with written reports.' },
      { label: 'Meeting Math', value: 'A 1-hour weekly meeting with 10 people at $100k average salary costs $48,000+/year. Cutting it to biweekly saves $24,000.' },
      { label: 'Productivity Cost', value: 'Context switching after each meeting costs ~15 min/person to refocus. Your meeting adds ~$${productivityLoss.toFixed(0)} in hidden switching costs.' },
      { label: 'Overhead Explained', value: 'Overhead (30-40%) covers: employer payroll taxes (7.65%), benefits (20-30%), office space, equipment, IT, and facilities.' },
      { label: 'Meeting Diet Tips', value: 'Use timeboxing (25/50 min), standing meetings (shorter by ~25%), clear agendas, attendee audits (invite only necessary people), and async-first culture.' },
      { label: 'Salary Benchmarks', value: `$100k salary ≈ $${((100000 / 2080) * 1.3).toFixed(2)}/hr fully loaded (with 30% overhead). A 10-person 1-hr meeting = $${(10 * (100000 / 2080) * 1.3).toFixed(0)} all-in.` },
    ]} },
  description: 'Calculate the true cost of a meeting based on attendee salaries, duration, and overhead. Understand the real financial impact of your meetings to make data-driven decisions about meeting efficiency.',
  formula: 'TotalCost = (AvgSalary / 2080hrs × Attendees × Minutes / 60) × (1 + Overhead%) | Annual = WeeklyMeetingCost × 52 | ProductivityLoss = Attendees × 0.25hr × HourlyRate (context switching) | Standard work year: 2,080 hours (40hrs × 52wks)',
  interpretation: 'A 1-hour meeting with 10 people earning $100k/year costs ~$625+ fully loaded (including 30% overhead). That same meeting held weekly costs ~$32,500/year. For large meetings (50 people at $90k), a single hour costs ~$3,000+. Before scheduling, ask: could this be an email? Can we cut the attendee list? Can we shorten to 30 min? The most expensive meetings are recurring ones with too many people.'
}

export default calcDef
