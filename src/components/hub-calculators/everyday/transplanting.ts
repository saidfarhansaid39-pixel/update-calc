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
  defaults: { tranPlantAge: '12', tranCurrentPot: '6', tranNewPot: '8', tranRootBound: 'some' },
  presets: [
    { label: 'Young Seedling (3 mo)', values: { tranPlantAge: '3', tranCurrentPot: '4', tranNewPot: '6', tranRootBound: 'none' } },
    { label: 'Root-Bound Pothos (18 mo)', values: { tranPlantAge: '18', tranCurrentPot: '6', tranNewPot: '8', tranRootBound: 'severe' } },
    { label: 'Monstera (2 years)', values: { tranPlantAge: '24', tranCurrentPot: '8', tranNewPot: '10', tranRootBound: 'some' } },
    { label: 'Succulent (6 mo)', values: { tranPlantAge: '6', tranCurrentPot: '3', tranNewPot: '4', tranRootBound: 'none' } },
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
    return { result: sizeRatio, label: 'Pot Size Ratio', unit: '', steps: [
      { label: 'Formula', value: 'Volume Increase = (NewPot ÷ CurrentPot)³ - 1. Optimal: +2 in diameter' },
      { label: 'Current Pot', value: v.tranCurrentPot + ' in diameter' },
      { label: 'New Pot', value: v.tranNewPot + ' in diameter' },
      { label: 'Size Ratio', value: sizeRatio.toFixed(2) + '×' },
      { label: 'Volume Increase', value: (volumeIncrease * 100).toFixed(0) + '% more soil volume' },
      { label: 'Recommendation', value: sizeAdvice },
      { label: 'Urgency', value: urgency },
      { label: 'Timing Advice', value: timing },
    ] ,
    extras: [
      { label: 'The 2-Inch Rule', value: 'Go up 2 in (5 cm) in pot diameter maximum. Jumping from 6 in to 12 in risks root rot from excess soil moisture' },
      { label: 'Root-Bound Signs', value: 'Roots circling the bottom, growing out of drainage holes, water running straight through — these mean it\'s time' },
      { label: 'Seasonal Timing', value: 'Early spring (March-April) is best — plants are entering active growth. Avoid transplanting in winter dormancy' },
      { label: 'Water Before', value: 'Water the plant thoroughly 24 hours before transplanting — hydrated roots handle stress better and soil holds together' },
      { label: 'Pot Material', value: 'Terracotta dries faster (good for succulents). Plastic retains moisture (good for ferns). Ceramic glazed = slow drying' },
      { label: 'Soil Mix', value: 'Use fresh potting mix — garden soil compacts in containers. Add perlite (20-30%) for drainage in larger pots' },
      { label: 'Root Care', value: 'Gently tease apart circling roots. Trim any dead/rotting roots with sterilized scissors. Don\'t wash roots bare' },
      { label: 'Aftercare', value: 'Keep transplanted plants in indirect light for 3-5 days. Don\'t fertilize for 4-6 weeks — fresh soil has nutrients' },
    ]}
  },
  description: 'Determine if and when to transplant your houseplant or garden plant based on pot size comparison, root-bound condition, and plant age. Provides timing advice and pot size recommendations for healthy plant growth.',
  formula: 'Volume Increase = (New Pot Diameter ÷ Current Pot Diameter)³ - 1. Optimal step-up: +2 in diameter (typically 30-50% volume increase). Good ratio range: 1.25× to 1.5× the current pot diameter.',
  interpretation: 'The golden rule: go up only 2 in (5 cm) in pot diameter at a time. A 6 in → 8 in pot increases soil volume by ~137%, giving roots room to grow without excess moisture. Plants need transplanting every 12-18 months when root-bound. Severe root-binding requires immediate action; moderate cases can wait 1-2 weeks. Always transplant during the active growing season for best recovery.'
}

export default calcDef
