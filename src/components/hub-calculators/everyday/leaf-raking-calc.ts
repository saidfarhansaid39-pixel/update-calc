import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ lawnArea: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), leafCoverage: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), treeCount: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  defaults: { lawnArea: '5000', leafCoverage: '60', treeCount: '3' },
  presets: [
    { label: 'Small Yard (2,500 sq ft)', values: { lawnArea: '2500', leafCoverage: '50', treeCount: '2' } },
    { label: 'Medium Yard (5,000 sq ft)', values: { lawnArea: '5000', leafCoverage: '70', treeCount: '4' } },
    { label: 'Large Yard (10,000 sq ft)', values: { lawnArea: '10000', leafCoverage: '80', treeCount: '6' } },
  ],
  fields: [
    { name: 'lawnArea', label: 'Lawn Area (sq ft)', type: 'number', min: 100, step: '500' },
    { name: 'leafCoverage', label: 'Leaf Coverage (%)', type: 'number', min: 0, max: 100, step: '10' },
    { name: 'treeCount', label: 'Number of Trees', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const A = parseFloat(v.lawnArea)||0; const C = parseFloat(v.leafCoverage)||0; const T = parseFloat(v.treeCount)||0
    const coveredArea = A * (C / 100)
    const bags = Math.ceil(coveredArea / 150)
    const timeMin = coveredArea / 50
    const extraBags = Math.ceil(T * 3.5)
    const totalBags = bags + extraBags
    return { result: totalBags, label: 'Total Bags Needed', unit: 'bags', steps: [
      { label: '1. Covered Area', value: `${A} × ${C}% = ${coveredArea.toFixed(0)} sq ft` },
      { label: '2. Raking Time', value: `${coveredArea.toFixed(0)} sq ft ÷ 50 sq ft/min = ${timeMin.toFixed(0)} min (${(timeMin/60).toFixed(1)} hr)` },
      { label: '3. Leaf Bags (lawn)', value: `${coveredArea.toFixed(0)} sq ft ÷ 150 sq ft/bag = ${bags} bags` },
      { label: '4. Extra from Trees', value: `${T} trees × 3.5 bags/tree = ${extraBags} bags` },
      { label: '5. Total Bags', value: `${bags} + ${extraBags} = ${totalBags} bags` },
    ] ,
    extras: [
      { label: 'Leaf Bag Capacity', value: 'Standard paper lawn bags hold ~150 sq ft of light leaf cover. Heavy/wet leaves fill bags faster — expect 75-100 sq ft per bag when wet.' },
      { label: 'Mulching Mower', value: 'Mulching blades chop leaves into fine pieces that decompose into fertilizer. You can mow over leaves 2-3 in deep — no raking needed. Saves 50+ hrs/season.' },
      { label: 'Leaf Disposal Rules', value: 'Many towns require paper yard waste bags (not plastic). Check local rules: some offer curbside pickup, others require drop-off. Fees: $1-3 per bag.' },
      { label: 'Composting Leaves', value: 'Leaves are "brown" carbon-rich compost material. Mix with grass clippings ("greens") for 3:1 ratio. Shredded leaves compost in 6-12 months.' },
      { label: 'Leaf Blower vs Rake', value: 'Gas blowers: 150-200 mph, 2-3× faster than raking. Electric: 100-140 mph, quieter. Raking burns 200-300 cal/hr — good exercise.' },
      { label: 'Leaf Vacuum Options', value: 'Leaf vacs shred leaves to 1/10 their original volume, reducing bags by 90%. Great for large yards. Average price: $100-300 for electric models.' },
      { label: 'Seasonal Timing', value: 'Rake when leaves are dry — wet leaves are 2-3× heavier and take 50% longer. Rake before rain to prevent matting that kills grass.' },
      { label: 'Lawn Health Tip', value: 'A thick layer of leaves (>1 in) blocks sunlight and traps moisture, causing fungal diseases (snow mold, brown patch). Don\'t leave leaves over winter.' },
    ]}
  },
  description: 'Estimate leaf raking workload: bags needed, time required, and total leaf volume based on lawn size and tree count. Includes mulching, composting, and disposal tips.',
  formula: 'Covered Area = Area × Coverage%. Bags = ceil(Area×C%/150) + ceil(Trees×3.5). Time (min) = Covered Area / 50. Average: 1 bag per 150 sq ft + 3.5 bags per mature tree.',
  interpretation: 'One lawn bag holds ~150 sq ft of light leaf cover. Average yard with 3 mature trees produces 10-15 bags per season. Raking speed: ~50 sq ft/min. Mulching with a mower reduces bagging by 80-90% and feeds your lawn naturally. A 5,000 sq ft yard with 60% coverage takes ~60 min to rake and fills ~6 bags.'
}

export default calcDef
