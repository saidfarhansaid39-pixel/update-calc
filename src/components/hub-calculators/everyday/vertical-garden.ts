import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ vgWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), vgHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), vgPocketSpacing: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), vgPlantType: z.string().min(1) }),
  fields: [
    { name: 'vgWidth', label: 'Wall Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'vgHeight', label: 'Wall Height (ft)', type: 'number', min: 1, step: '1' },
    { name: 'vgPocketSpacing', label: 'Pocket Spacing (in)', type: 'number', min: 4, step: '2' },
    { name: 'vgPlantType', label: 'Plant Type', type: 'select', options: [{ label: 'Succulents (low water)', value: 'succulent' }, { label: 'Herbs (kitchen)', value: 'herb' }, { label: 'Ferns/Shade Plants', value: 'fern' }, { label: 'Flowering Annuals', value: 'flower' }] },
  ],
  compute: (v) => {
    const pocketsHorizontal = Math.floor((v.vgWidth * 12) / v.vgPocketSpacing)
    const pocketsVertical = Math.floor((v.vgHeight * 12) / v.vgPocketSpacing)
    const totalPockets = pocketsHorizontal * pocketsVertical
    const waterNeeds: Record<string, number> = { succulent: 0.5, herb: 1, fern: 1.5, flower: 1 }
    const waterFactor = waterNeeds[v.vgPlantType] || 1
    const dailyWaterL = totalPockets * waterFactor * 0.05
    const weeklyWaterL = dailyWaterL * 7
    return { result: totalPockets, label: 'Total Plants/Pockets', unit: '', steps: [{ label: 'Pockets Horizontal', value: '' + pocketsHorizontal }, { label: 'Pockets Vertical', value: '' + pocketsVertical }, { label: 'Total Plants', value: '' + totalPockets }, { label: 'Daily Water Needed', value: dailyWaterL.toFixed(1) + ' L' }, { label: 'Weekly Water', value: weeklyWaterL.toFixed(1) + ' L' }] }
  },
  description: 'Plan a vertical garden wall. Calculate number of plants, pocket layout, and daily water needs based on wall size and plant type.',
  formula: 'Pockets = floor(Wx12/Spacing) x floor(Hx12/Spacing) | Water = Pockets x Factor x 0.05 L/day',
  interpretation: 'Vertical gardens save floor space and improve air quality. Succulents need least water, ferns most. Space pockets 6-12 in apart. A 4x6 ft wall holds 24-48 plants. Install drip irrigation for easy watering.'
}

export default calcDef
