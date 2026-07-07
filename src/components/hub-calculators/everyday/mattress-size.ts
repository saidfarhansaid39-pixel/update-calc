import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sleeperHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sleeperWeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bedPartner: z.string().min(1), sleepPosition: z.string().min(1) }),
  fields: [
    { name: 'sleeperHeight', label: 'Your Height (in)', type: 'number', min: 48, max: 84, step: '1' },
    { name: 'sleeperWeight', label: 'Weight (lb)', type: 'number', min: 50, max: 400, step: '10' },
    { name: 'bedPartner', label: 'Sleep with Partner?', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
    { name: 'sleepPosition', label: 'Sleep Position', type: 'select', options: [{ label: 'Back', value: 'back' }, { label: 'Side', value: 'side' }, { label: 'Stomach', value: 'stomach' }, { label: 'Combination', value: 'combo' }] },
  ],
  compute: (v) => {
    const needExtra = v.sleeperHeight > 72
    const needPartnerSpace = v.bedPartner === 'yes'
    const sizeRecommendations: Array<{ name: string; minHeight: number; minWeight: number; partnerFriendly: boolean; width: number; length: number; desc: string }> = [
      { name: 'Twin', minHeight: 0, minWeight: 0, partnerFriendly: false, width: 38, length: 75, desc: '38×75 in — Best for children, single sleepers under 6 ft' },
      { name: 'Twin XL', minHeight: 72, minWeight: 0, partnerFriendly: false, width: 38, length: 80, desc: '38×80 in — Tall single sleepers, college dorms' },
      { name: 'Full', minHeight: 0, minWeight: 0, partnerFriendly: false, width: 54, length: 75, desc: '54×75 in — Single adult, tight for two' },
      { name: 'Queen', minHeight: 0, minWeight: 0, partnerFriendly: false, width: 60, length: 80, desc: '60×80 in — Most popular for couples under 6 ft' },
      { name: 'King', minHeight: 0, minWeight: 0, partnerFriendly: true, width: 76, length: 80, desc: '76×80 in — Standard for couples, 15 in wider than Queen' },
      { name: 'California King', minHeight: 0, minWeight: 0, partnerFriendly: true, width: 72, length: 84, desc: '72×84 in — Extra length for tall couples' },
    ]
    let recommended = needExtra && needPartnerSpace ? sizeRecommendations[5] : needPartnerSpace ? sizeRecommendations[4] : needExtra ? sizeRecommendations[1] : sizeRecommendations[3]
    if (v.sleeperWeight > 230 && needPartnerSpace) recommended = sizeRecommendations[5]
    return { result: recommended.width * recommended.length, label: 'Recommended Size', unit: 'sq in', steps: [{ label: 'Recommended', value: `${recommended.name} — ${recommended.desc}` }, { label: 'Dimensions', value: `${recommended.width}×${recommended.length} in (${recommended.width * recommended.length} sq in)` }] }
  },
  description: 'Find the best mattress size based on your height, weight, sleeping position, and whether you share a bed.',
  formula: 'Recommendation based on height thresholds, weight categories, and partner space needs',
  interpretation: 'Queen is the most popular size (60×80). King adds 16 in width. California King adds 4 in length but is 4 in narrower. Measure your bedroom before buying.'
}

export default calcDef
