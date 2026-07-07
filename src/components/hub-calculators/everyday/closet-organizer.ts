import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ closetWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), closetDepth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sections: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), budgetPerSection: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'closetWidth', label: 'Closet Width (ft)', type: 'number', min: 2, step: '1' },
    { name: 'closetDepth', label: 'Closet Depth (ft)', type: 'number', min: 1, step: '0.5' },
    { name: 'sections', label: 'Number of Sections', type: 'number', min: 1, step: '1' },
    { name: 'budgetPerSection', label: 'Budget per Section ($)', type: 'number', min: 10, step: '25' },
  ],
  compute: (v) => {
    const area = v.closetWidth * v.closetDepth
    const totalCost = v.sections * v.budgetPerSection
    const costPerSqFt = totalCost / area
    return { result: totalCost, label: 'Closet Organizer Cost', unit: '$', steps: [{ label: 'Closet Area', value: `${area.toFixed(1)} sq ft` }, { label: 'Sections Planned', value: `${v.sections}` }, { label: 'Per Section Budget', value: `$${v.budgetPerSection.toFixed(2)}` }, { label: 'Total Cost', value: `$${totalCost.toFixed(2)}` }, { label: 'Cost per Sq Ft', value: `$${costPerSqFt.toFixed(2)}/sq ft` }] }
  },
  description: 'Plan and budget for a closet organization system based on closet dimensions, number of sections, and budget per section.',
  formula: 'Total Cost = Sections × Budget Per Section | Cost/sq ft = Total / (Width × Depth)',
  interpretation: 'DIY closet systems (Elfa, IKEA) cost $10-30/sq ft. Custom built-ins run $50-150/sq ft. A reach-in closet typically needs 3-4 sections; a walk-in needs 5-8 sections.'
}

export default calcDef
