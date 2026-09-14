import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sleeperHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sleeperWeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bedPartner: z.string().min(1), sleepPosition: z.string().min(1) }),
  defaults: { sleeperHeight: '68', sleeperWeight: '170', bedPartner: 'yes', sleepPosition: 'side' },
  presets: [
    { label: 'Tall Couple', values: { sleeperHeight: '74', sleeperWeight: '210', bedPartner: 'yes', sleepPosition: 'back' } },
    { label: 'Single Adult', values: { sleeperHeight: '66', sleeperWeight: '150', bedPartner: 'no', sleepPosition: 'stomach' } },
    { label: 'College Student', values: { sleeperHeight: '70', sleeperWeight: '180', bedPartner: 'no', sleepPosition: 'combo' } },
  ],
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
    const h = parseFloat(v.sleeperHeight)
    const w = parseFloat(v.sleeperWeight)
    return { result: recommended.width * recommended.length, label: 'Recommended Size', unit: 'sq in', steps: [
      { label: '1. Height Check', value: `${h} in — ${h > 72 ? 'needs extra length' : 'standard length OK'}` },
      { label: '2. Partner Check', value: v.bedPartner === 'yes' ? 'Shared bed — need ≥ Queen width' : 'Solo sleeper — width flexibility' },
      { label: '3. Weight Consideration', value: `${w} lb — ${w > 230 && v.bedPartner === 'yes' ? 'needs King+ for space' : 'within standard range'}` },
      { label: '4. Position Notes', value: `Position: ${v.sleepPosition} — side sleepers need extra shoulder room, stomach sleepers need firm support` },
      { label: '5. Best Match', value: `${recommended.name} (${recommended.width}×${recommended.length} in)` },
      { label: '6. Surface Area', value: `${recommended.width} × ${recommended.length} = ${recommended.width * recommended.length} sq in` },
      { label: '7. Room Minimum', value: `Room needs to be at least ${recommended.width + 30}×${recommended.length + 30} in for clearance` },
    ],
    extras: [
      { label: 'Bedroom Fit', value: 'Measure your room before buying. Queen needs 10×10 ft minimum, King needs 12×12 ft.' },
      { label: 'Side Sleepers', value: 'Side sleepers need softer mattresses and ideally 60+ in width for arm/leg extension.' },
      { label: 'Back Sleepers', value: 'Back sleepers need medium-firm support with pillow height under 3 inches.' },
      { label: 'Stomach Sleepers', value: 'Stomach sleepers need firmer mattresses to prevent lower back arching.' },
      { label: 'Weight & Support', value: 'Heavier individuals (>230 lb) should consider King or split-top options for better edge support.' },
      { label: 'Twin XL Popularity', value: 'Twin XL is the standard dorm size (38×80 in) — 5 in longer than standard Twin.' },
      { label: 'Return Policy', value: 'Most mattress companies offer 90-120 night trial periods. Use it — it takes weeks to adjust.' },
      { label: 'Box Spring or Platform', value: 'King and Queen need center support bars. Platform beds work with all sizes and often last longer.' },
    ]}
  },
  description: 'Find the best mattress size based on your height, weight, sleeping position, and whether you share a bed. Includes room fit and sleep position guidance.',
  formula: 'Recommendation = Logic(height > 72" → XL, partner → Queen+, weight > 230lb + partner → Cal King). Area = Width × Length',
  interpretation: 'Queen is the most popular size (60×80 in). King adds 16 in width. California King adds 4 in length but is 4 in narrower. Always measure your bedroom and doorway before buying. Side sleepers benefit from extra width for arm positioning.'
}

export default calcDef
