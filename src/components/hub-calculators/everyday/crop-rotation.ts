import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ gardenArea: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), currentFamily: z.string().min(1), lastYearFamily: z.string().min(1), yearsBetween: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'gardenArea', label: 'Garden Area (sq ft)', type: 'number', min: 10, step: '10' },
    { name: 'currentFamily', label: 'This Year\'s Crop Family', type: 'select', options: [{ label: 'Solanaceae (Tomato/Pepper)', value: 'solanaceae' }, { label: 'Brassicas (Cabbage/Broccoli)', value: 'brassica' }, { label: 'Cucurbits (Squash/Cucumber)', value: 'cucurbit' }, { label: 'Fabaceae (Beans/Peas)', value: 'fabaceae' }, { label: 'Alliums (Onion/Garlic)', value: 'allium' }, { label: 'Apiaceae (Carrot/Dill)', value: 'apiaceae' }] },
    { name: 'lastYearFamily', label: 'Last Year\'s Family', type: 'select', options: [{ label: 'Solanaceae (Tomato/Pepper)', value: 'solanaceae' }, { label: 'Brassicas (Cabbage/Broccoli)', value: 'brassica' }, { label: 'Cucurbits (Squash/Cucumber)', value: 'cucurbit' }, { label: 'Fabaceae (Beans/Peas)', value: 'fabaceae' }, { label: 'Alliums (Onion/Garlic)', value: 'allium' }, { label: 'Apiaceae (Carrot/Dill)', value: 'apiaceae' }] },
    { name: 'yearsBetween', label: 'Years Before Replanting Same Family', type: 'number', min: 1, max: 6, step: '1' },
  ],
  compute: (v) => {
    const isSame = v.currentFamily === v.lastYearFamily
    const compatible = !isSame || v.yearsBetween >= 3
    const recommendation = isSame ? (v.yearsBetween >= 3 ? 'Adequate rotation' : 'Rotate out! Same family planted too soon') : 'Good rotation'
    const families = ['solanaceae', 'brassica', 'cucurbit', 'fabaceae', 'allium', 'apiaceae']
    const nextIdx = (families.indexOf(v.currentFamily) + 1) % families.length
    const nextFamily = families[nextIdx]
    return { result: compatible ? 1 : 0, label: compatible ? 'Rotation OK' : 'Risk of Disease', unit: '', steps: [{ label: 'Current Crop', value: v.currentFamily }, { label: 'Previous Crop', value: v.lastYearFamily }, { label: 'Status', value: recommendation }, { label: 'Next Recommended', value: nextFamily }, { label: 'Rotation Cycle', value: `${v.yearsBetween} year(s)` }] }
  },
  description: 'Plan crop rotation to prevent soil-borne diseases and nutrient depletion. Learn which plant families to rotate and recommended intervals.',
  formula: 'Rotation Rule: Never plant same family in same spot for at least 3 years. Follow nitrogen-fixing crops (beans) with nitrogen-heavy feeders (leafy greens).',
  interpretation: 'Solanaceae are heavy feeders prone to blight. Fabaceae fix nitrogen for following crops. Brassicas need firm soil and benefit from a preceding green manure. Maintain a 4-year rotation cycle ideally.'
}

export default calcDef
