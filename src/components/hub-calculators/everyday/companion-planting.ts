import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ gardenArea: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mainCrop: z.string().min(1), companionChoice: z.string().min(1) }),
  fields: [
    { name: 'gardenArea', label: 'Garden Area (sq ft)', type: 'number', min: 10, step: '10' },
    { name: 'mainCrop', label: 'Main Crop', type: 'select', options: [{ label: 'Tomatoes', value: 'tomato' }, { label: 'Carrots', value: 'carrot' }, { label: 'Lettuce', value: 'lettuce' }, { label: 'Peppers', value: 'pepper' }, { label: 'Beans', value: 'beans' }, { label: 'Cucumbers', value: 'cucumber' }] },
    { name: 'companionChoice', label: 'Companion Plant', type: 'select', options: [{ label: 'Basil', value: 'basil' }, { label: 'Marigold', value: 'marigold' }, { label: 'Nasturtium', value: 'nasturtium' }, { label: 'Dill', value: 'dill' }, { label: 'Mint', value: 'mint' }, { label: 'Garlic', value: 'garlic' }] },
  ],
  compute: (v) => {
    const companions: Record<string, string[]> = { tomato: ['basil', 'marigold', 'garlic'], carrot: ['dill', 'garlic'], lettuce: ['mint', 'garlic'], pepper: ['basil', 'marigold'], beans: ['nasturtium', 'marigold'], cucumber: ['dill', 'nasturtium'] }
    const goodCompanions = companions[v.mainCrop] || []
    const isGood = goodCompanions.includes(v.companionChoice)
    const companionArea = v.gardenArea * 0.2
    return { result: isGood ? 1 : 0, label: isGood ? 'Good Companion' : 'Avoid Pairing', unit: '', steps: [{ label: 'Main Crop', value: v.mainCrop }, { label: 'Companion', value: v.companionChoice }, { label: 'Compatibility', value: isGood ? 'Beneficial' : 'Not Recommended' }, { label: 'Reserved Area', value: `${companionArea.toFixed(0)} sq ft` }] }
  },
  description: 'Check if two plants are compatible companion plants. Good companions improve growth, repel pests, or provide shade.',
  formula: 'Compatibility: Check companion planting matrix for pest-repelling, nutrient-sharing, and growth-enhancing pairs.',
  interpretation: 'Basil with tomatoes repels hornworms and improves flavor. Marigolds deter nematodes. Never plant tomatoes with corn (same pest), or beans with onions (stunt growth). Rotate companions yearly.'
}

export default calcDef
