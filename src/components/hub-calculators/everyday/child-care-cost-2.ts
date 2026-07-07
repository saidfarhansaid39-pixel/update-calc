import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ children: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), costPerChild: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), daysPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), registrationFees: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'children', label: 'Number of Children', type: 'number', min: 1, step: '1' },
    { name: 'costPerChild', label: 'Cost per Child per Day ($)', type: 'number', min: 10, step: '10' },
    { name: 'daysPerWeek', label: 'Days per Week', type: 'number', min: 1, max: 5, step: '1' },
    { name: 'registrationFees', label: 'Annual Registration/Fees ($)', type: 'number', min: 0, step: '50' },
  ],
  compute: (v) => {
    const weeklyCost = v.children * v.costPerChild * v.daysPerWeek
    const monthlyCost = weeklyCost * 4.33
    const annualCost = monthlyCost * 12 + v.registrationFees
    return { result: monthlyCost, label: 'Monthly Childcare Cost', unit: '$', steps: [{ label: 'Daily Cost', value: `$${(v.children * v.costPerChild).toFixed(2)}` }, { label: 'Weekly Cost', value: `$${weeklyCost.toFixed(2)}` }, { label: 'Monthly Cost', value: `$${monthlyCost.toFixed(2)}` }, { label: 'Annual Cost', value: `$${annualCost.toFixed(2)}` }] }
  },
  description: 'Calculate monthly and annual childcare expenses based on number of children, daily rate, days per week, and registration fees.',
  formula: 'Monthly = Children × Daily Rate × Days/Week × 4.33 + Annual Fees/12',
  interpretation: 'Average childcare costs $200-400/week per child in the US. Infant care is typically 20-30% more expensive than preschooler care. The Child and Dependent Care Tax Credit can offset up to $3,000 per child.'
}

export default calcDef
