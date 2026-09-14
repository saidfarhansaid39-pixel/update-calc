import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ roomLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roomWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), carpetPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wastePct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'roomLength', label: 'Room Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'roomWidth', label: 'Room Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'carpetPrice', label: 'Carpet Price ($/sq ft)', type: 'number', min: 0.5, step: '1' },
    { name: 'wastePct', label: 'Waste % (cutting/pattern)', type: 'number', min: 0, max: 30, step: '5' },
  ],
  defaults: { roomLength: '12', roomWidth: '14', carpetPrice: '4', wastePct: '10' },
  presets: [
    { label: 'Master Bedroom Suite', values: { roomLength: '16', roomWidth: '14', carpetPrice: '5', wastePct: '10' } },
    { label: 'Open Living Room', values: { roomLength: '20', roomWidth: '18', carpetPrice: '6', wastePct: '15' } },
    { label: 'Guest Bedroom', values: { roomLength: '10', roomWidth: '12', carpetPrice: '3', wastePct: '5' } },
    { label: 'Basement Rec Room', values: { roomLength: '25', roomWidth: '20', carpetPrice: '3', wastePct: '15' } },
  ],
  compute: (v) => {
    const area = v.roomLength * v.roomWidth
    const wasteArea = area * (v.wastePct / 100)
    const totalArea = area + wasteArea
    const materialCost = totalArea * v.carpetPrice
    const paddingCost = totalArea * 1.2
    const installCost = totalArea * 3.5
    const totalProjectCost = materialCost + paddingCost + installCost
    const costSqYd = materialCost / (totalArea / 9)
    return {
      result: materialCost, label: 'Total Carpet Cost', unit: '$',
      steps: [
        { label: 'Room Area', value: `${area.toFixed(1)} sq ft` },
        { label: 'Waste Added', value: `+${wasteArea.toFixed(1)} sq ft (${v.wastePct}% for cutting/pattern)` },
        { label: 'Total Carpet Needed', value: `${totalArea.toFixed(1)} sq ft` },
        { label: 'Material Cost', value: `$${materialCost.toFixed(2)} (${totalArea.toFixed(1)} sq ft × $${v.carpetPrice})` },
        { label: 'Padding (est.)', value: `~$${paddingCost.toFixed(2)} ($${1.2}/sq ft avg)` },
        { label: 'Installation (est.)', value: `~$${installCost.toFixed(0)} ($${3.5}/sq ft avg)` },
        { label: 'Total Project Cost', value: `$${totalProjectCost.toFixed(2)} (materials + padding + install)` },
        { label: 'Cost per Square Yard', value: `$${costSqYd.toFixed(2)}/sq yd (carpet often priced per yard)` },
      ],
      extras: [
        { label: 'Complete Project Budget', value: `Materials: $${materialCost.toFixed(2)} (${((materialCost / totalProjectCost) * 100).toFixed(0)}%) | Padding: $${paddingCost.toFixed(2)} (${((paddingCost / totalProjectCost) * 100).toFixed(0)}%) | Install: $${installCost.toFixed(0)} (${((installCost / totalProjectCost) * 100).toFixed(0)}%) | Total: $${totalProjectCost.toFixed(2)}` },
        { label: 'Carpet Pricing by Fiber', value: '$2-4/sq ft: Polyester/PET (fade-resistant, eco-friendly). $4-7/sq ft: Nylon (best durability, stain-resistant). $5-8/sq ft: Triexta (SmartStrand, stain-resistant). $8-15/sq ft: Wool (natural, luxurious, 25+ year lifespan).' },
        { label: 'Padding Cost & Quality', value: 'Padding: $0.50-1.50/sq ft. Recommended: 7/16 in rebond, 6-8 lb density. Premium: 1/2 in memory foam, 8-10 lb. Good padding doubles carpet lifespan. Never use padding thinner than 3/8 in.' },
        { label: 'Installation Pricing Model', value: 'Installers typically charge per sq ft: $2-3 for basic rooms, $3-5 for stairs ($10-15/step), $4-6 for custom patterns. Additional charges: furniture moving ($50-150), old carpet disposal ($25-75), subfloor repair ($100-300).' },
        { label: 'Carpet Grade Face Weight', value: 'Face weight (oz/sq yd) determines durability: 30-40 oz: economy (bedrooms). 40-55 oz: mid-grade (living rooms). 55-80 oz: premium (high-traffic). Higher face weight = more yarn = longer life, typically +$1-2/sq ft per 10 oz.' },
        { label: 'DIY vs Professional Install', value: 'DIY: saves $2-4/sq ft but requires rented tools ($50-100/day: knee kicker, power stretcher, seaming iron). Professional: includes removal, subfloor prep, proper stretching, seam sealing. Mistakes in DIY can void carpet warranty.' },
        { label: 'Stair Carpet Costs', value: 'Stairs cost 2-3× more per sq ft than rooms: $5-10/step for materials + $10-15/step for installation. A 13-step staircase adds $200-325 to the project. Patterned stair runners require 20-30% extra waste.' },
        { label: 'Payment & Warranty Tips', value: 'Most installers require 30-50% deposit. Full payment only after completion and inspection. Carpet warranty: 5-15 years (manufacturer), 1-5 years (stain protection). Labor warranty: 1 year minimum. Get everything in writing.' },
      ]
    }
  },
  description: 'Calculate total carpet cost for a room — including material, waste factor, padding, and professional installation. Get a complete project budget with cost per square yard breakdown.',
  formula: 'Total Cost = (L × W) × (1 + Waste%) × Price/sq ft | Project Cost = Material + Padding ($1.20/sq ft) + Install ($3.50/sq ft)',
  interpretation: 'Standard waste factor: 5-10% for plain carpet, 15-20% for patterned. Budget $3-8/sq ft for mid-grade carpet. Padding adds $0.50-1.50/sq ft. Professional installation: $2-5/sq ft. Total project for a 12×14 room ($4/sq ft carpet): ~$1,200-1,600 fully installed. Get 3 quotes minimum.'
}

export default calcDef
