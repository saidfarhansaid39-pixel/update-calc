import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ containerCount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), containerSize: z.string().min(1), plantType: z.string().min(1), soilCost: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'containerCount', label: 'Number of Containers', type: 'number', min: 1, step: '1' },
    { name: 'containerSize', label: 'Container Size', type: 'select', options: [{ label: 'Small (1-2 gal)', value: 'small' }, { label: 'Medium (3-5 gal)', value: 'medium' }, { label: 'Large (5+ gal)', value: 'large' }] },
    { name: 'plantType', label: 'Plant Type', type: 'select', options: [{ label: 'Herbs', value: 'herbs' }, { label: 'Vegetables', value: 'veggies' }, { label: 'Flowers', value: 'flowers' }, { label: 'Succulents', value: 'succulents' }] },
    { name: 'soilCost', label: 'Potting Soil Cost per Bag ($)', type: 'number', min: 5, step: '5' },
  ],
  compute: (v) => {
    const soilGallons: Record<string, number> = { small: 1.5, medium: 4, large: 7 }
    const bagsNeeded = Math.ceil((v.containerCount * soilGallons[v.containerSize]) / 8)
    const totalSoilCost = bagsNeeded * v.soilCost
    const containerCost = v.containerCount * (v.containerSize === 'small' ? 5 : v.containerSize === 'medium' ? 12 : 20)
    const totalCost = totalSoilCost + containerCost
    return { result: totalCost, label: 'Container Garden Setup', unit: '$', steps: [{ label: 'Containers', value: `${v.containerCount} × $${(containerCost / v.containerCount).toFixed(2)}` }, { label: 'Soil Needed', value: `${bagsNeeded} bags (${(v.containerCount * soilGallons[v.containerSize]).toFixed(0)} gal total)` }, { label: 'Soil Cost', value: `$${totalSoilCost.toFixed(2)}` }, { label: 'Total Cost', value: `$${totalCost.toFixed(2)}` }] }
  },
  description: 'Estimate the cost to set up a container garden including containers, potting soil, and plant type recommendations.',
  formula: 'Total Cost = Containers (Count × Price) + Soil (Bags × Cost/Bag)',
  interpretation: 'Containers need drainage holes. Use potting mix, not garden soil. Water more frequently than in-ground (daily in summer). Fertilize every 2-4 weeks. Herbs are easiest for beginners.'
}

export default calcDef
