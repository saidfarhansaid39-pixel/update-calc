import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tranPlantAge: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tranCurrentPot: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tranNewPot: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tranRootBound: z.string().min(1) }),
  fields: [
    { name: 'tranPlantAge', label: 'Plant Age (months)', type: 'number', min: 1, step: '1' },
    { name: 'tranCurrentPot', label: 'Current Pot Size (in)', type: 'number', min: 2, step: '1' },
    { name: 'tranNewPot', label: 'New Pot Size (in)', type: 'number', min: 2, step: '1' },
    { name: 'tranRootBound', label: 'Root-Bound Signs', type: 'select', options: [{ label: 'None (healthy roots)', value: 'none' }, { label: 'Some (roots circling)', value: 'some' }, { label: 'Severe (crowded)', value: 'severe' }] },
  ],
  compute: (v) => {
    const sizeRatio = v.tranNewPot / v.tranCurrentPot
    const volumeIncrease = Math.pow(sizeRatio, 3) - 1
    const recommendedSize = v.tranCurrentPot + 2
    let sizeAdvice = ''
    if (recommendedSize > v.tranNewPot) sizeAdvice = 'Go up to ' + recommendedSize + ' in (2 in larger)'
    else if (v.tranNewPot <= v.tranCurrentPot * 2) sizeAdvice = 'Good size match'
    else sizeAdvice = 'Pot may be too large (risk of overwatering)'
    let urgency = ''
    if (v.tranRootBound === 'severe') urgency = 'Transplant immediately'
    else if (v.tranRootBound === 'some') urgency = 'Transplant within 1-2 weeks'
    else urgency = 'No rush, monitor growth'
    let timing = ''
    if (v.tranPlantAge < 3) timing = 'Spring is best for transplanting'
    else if (v.tranPlantAge < 12) timing = 'Any growing season works'
    else timing = 'Mature plants: early spring or fall'
    return { result: sizeRatio, label: 'Pot Size Ratio', unit: '', steps: [{ label: 'Current Pot', value: v.tranCurrentPot + ' in' }, { label: 'New Pot', value: v.tranNewPot + ' in' }, { label: 'Volume Increase', value: (volumeIncrease * 100).toFixed(0) + '%' }, { label: 'Recommendation', value: sizeAdvice }, { label: 'Urgency', value: urgency }, { label: 'Timing Advice', value: timing }] }
  },
  description: 'Determine if and when to transplant your plant based on pot size, root-bound condition, plant age, and optimal timing.',
  formula: 'Ratio = NewPot / CurrentPot | Volume Increase = Ratio^3 - 1 | Optimal: +2 in diameter (30-50% volume increase)',
  interpretation: 'General rule: go up 2 in (5 cm) in pot diameter. Too large a pot risks waterlogging. Root-bound plants need transplanting every 12-18 months. Best times: early spring or early fall. Water 24h before transplanting.'
}

export default calcDef
