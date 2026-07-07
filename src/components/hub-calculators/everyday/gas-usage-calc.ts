import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ gasApplianceWatts: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gasUsageHours: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gasRatePerTherm: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'gasApplianceWatts', label: 'Appliance Input (BTU/hr)', type: 'number', min: 1000, step: '1000' },
    { name: 'gasUsageHours', label: 'Hours Used per Day', type: 'number', min: 0.5, step: '0.5' },
    { name: 'gasRatePerTherm', label: 'Gas Rate per Therm ($)', type: 'number', min: 0.5, step: '0.25' },
  ],
  compute: (v) => {
    const btusPerDay = v.gasApplianceWatts * v.gasUsageHours
    const thermsPerDay = btusPerDay / 100000
    const thermsPerMonth = thermsPerDay * 30
    const monthlyCost = thermsPerMonth * v.gasRatePerTherm
    return { result: monthlyCost, label: 'Monthly Gas Cost', unit: '$', steps: [{ label: 'Daily BTU Usage', value: `${btusPerDay.toFixed(0)} BTU` }, { label: 'Daily Therms', value: `${thermsPerDay.toFixed(3)} therms` }, { label: 'Monthly Cost', value: `$${monthlyCost.toFixed(2)}` }] }
  },
  description: 'Calculate natural gas usage cost for appliances based on BTU rating, daily usage hours, and gas rate per therm.',
  formula: 'Monthly Cost = (BTU/hr × Hours/Day × 30 / 100,000) × Rate per Therm',
  interpretation: '1 therm = 100,000 BTU. Water heaters: 30,000-50,000 BTU/hr. Furnaces: 60,000-120,000 BTU/hr. Gas is typically cheaper than electric for heating. Seasonal usage varies significantly.'
}

export default calcDef
