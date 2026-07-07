import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ lawnArea: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), leafCoverage: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), treeCount: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'lawnArea', label: 'Lawn Area (sq ft)', type: 'number', min: 100, step: '500' },
    { name: 'leafCoverage', label: 'Leaf Coverage (%)', type: 'number', min: 0, max: 100, step: '10' },
    { name: 'treeCount', label: 'Number of Trees', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const coveredArea = v.lawnArea * (v.leafCoverage / 100)
    const bags = Math.ceil(coveredArea / 150)
    const timeMin = coveredArea / 50
    const leavesPerTree = v.treeCount * 3.5
    const totalLeavesBags = Math.ceil((coveredArea / 150) + leavesPerTree)
    return { result: totalLeavesBags, label: 'Total Bags Needed', unit: 'bags', steps: [{ label: 'Covered Area', value: `${coveredArea.toFixed(0)} sq ft` }, { label: 'Raking Time', value: `${timeMin.toFixed(0)} min` }, { label: 'Leaf Bags', value: `${bags} bags (lawn) + ${Math.ceil(leavesPerTree)} bags (trees) = ${totalLeavesBags} bags` }] }
  },
  description: 'Estimate leaf raking workload: bags needed, time required, and total leaf volume based on lawn size and tree count.',
  formula: 'Bags = (Area × Coverage%/100)/150 + Trees × 3.5 | Time = Area/50 min',
  interpretation: 'One lawn bag holds ~150 sq ft of light leaf cover. Average yard with 3 mature trees produces 10-15 bags per season. Raking speed: ~50 sq ft/min.'
}

export default calcDef
