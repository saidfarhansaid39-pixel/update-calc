import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ floorLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), floorWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), materialPricePerSqFt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wastePercent: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'floorLength', label: 'Room Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'floorWidth', label: 'Room Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'materialPricePerSqFt', label: 'Material Price per Sq Ft ($)', type: 'number', min: 0.5, step: '0.5' },
    { name: 'wastePercent', label: 'Waste Factor (%)', type: 'number', min: 0, max: 30, step: '1' },
  ],
  defaults: { floorLength: '18', floorWidth: '14', materialPricePerSqFt: '5', wastePercent: '10' },
  presets: [
    { label: 'Master Bedroom Engineered Wood', values: { floorLength: '16', floorWidth: '14', materialPricePerSqFt: '7', wastePercent: '8' } },
    { label: 'Living Room Luxury Vinyl', values: { floorLength: '22', floorWidth: '16', materialPricePerSqFt: '4.5', wastePercent: '10' } },
    { label: 'Bathroom Porcelain Tile', values: { floorLength: '10', floorWidth: '8', materialPricePerSqFt: '8', wastePercent: '15' } },
    { label: 'Home Office Carpet', values: { floorLength: '12', floorWidth: '10', materialPricePerSqFt: '3', wastePercent: '7' } },
  ],
  compute: (v) => {
    const area = v.floorLength * v.floorWidth
    const wasteAmount = area * (v.wastePercent / 100)
    const totalSqFt = area + wasteAmount
    const materialCost = totalSqFt * v.materialPricePerSqFt
    const costPerSqYd = materialCost / (totalSqFt / 9)
    const linearFt = 2 * (v.floorLength + v.floorWidth)
    const trimCost = linearFt * 1.5
    const totalWithTrim = materialCost + trimCost
    const totalSqYds = totalSqFt / 9
    const boxes = Math.ceil(totalSqFt / 20)
    return { result: materialCost, label: 'Total Material Cost', unit: '$', steps: [{ label: 'Room Size', value: `${v.floorLength} × ${v.floorWidth} ft = ${area.toFixed(0)} sq ft` }, { label: 'Waste Allowance', value: `${v.wastePercent}% = ${wasteAmount.toFixed(1)} sq ft` }, { label: 'Total to Purchase', value: `${totalSqFt.toFixed(1)} sq ft (${totalSqYds.toFixed(1)} sq yd)` }, { label: 'Boxes (20 sq ft/box)', value: `${boxes} boxes` }, { label: 'Material Cost', value: `$${materialCost.toFixed(2)} @ $${v.materialPricePerSqFt.toFixed(2)}/sq ft` }, { label: 'Linear Feet of Trim', value: `${linearFt.toFixed(0)} ft (baseboard/q-round)` }, { label: 'Trim/Molding Cost', value: `$${trimCost.toFixed(2)}` }, { label: 'Total with Trim', value: `$${totalWithTrim.toFixed(2)}` }] ,
    extras: [
      { label: 'Material Type Cost Comparison', value: `Your $${v.materialPricePerSqFt.toFixed(2)}/sq ft: Carpet $2-5 ($${(area * 3).toFixed(0)}-${(area * 5).toFixed(0)} for ${area.toFixed(0)} sq ft), Laminate $2-5 ($${(area * 3.5).toFixed(0)}), Vinyl $3-7 ($${(area * 5).toFixed(0)}), Engineered Wood $5-12 ($${(area * 8).toFixed(0)}), Solid Hardwood $6-15 ($${(area * 10).toFixed(0)}), Porcelain Tile $3-10 ($${(area * 6).toFixed(0)}). Your $${v.materialPricePerSqFt.toFixed(2)}/sq ft = ${v.materialPricePerSqFt < 3.5 ? 'budget carpet/laminate' : v.materialPricePerSqFt < 6 ? 'mid-range vinyl/laminate' : 'premium wood/tile'} range.` },
      { label: 'Room Shape Premium', value: `Rectangular ${v.floorLength}×${v.floorWidth} ft: base waste ${v.wastePercent}%. L-shaped room: +3-5% waste. Multiple angles: +5-10%. Room with closet: +2-3%. If your room is non-rectangular, add ${v.wastePercent >= 15 ? 'adequate buffer already' : '3-8% to waste for complex cuts'}. For this rectangular layout, ${v.wastePercent}% is ${v.wastePercent < 8 ? 'lean — minimal cuts needed' : 'generous — plenty for mistakes and angles'}. Total sq ft to order with safe buffer: ${Math.ceil(totalSqFt * 1.05)} sq ft.` },
      { label: 'Installation Method Impact', value: `Floating (click-lock): less waste, less subfloor prep = $${(area * 0.5).toFixed(0)} savings. Glue-down: more labor $${(area * 0.75).toFixed(0)} but better for high-traffic. Nail-down (hardwood): $${(area * 0.5).toFixed(0)} extra for materials. Your ${area.toFixed(0)} sq ft: floating $${(area * 2.5).toFixed(0)}, glue-down $${(area * 3).toFixed(0)}, nail-down $${(area * 3.5).toFixed(0)} labor. Pre-cut materials vs on-site cutting: precut reduces waste by 3-5% but costs more per sq ft.` },
      { label: 'Underlayment & Moisture Barrier', value: `Add $0.35-0.75/sq ft for underlayment: $${(area * 0.5).toFixed(0)}-${(area * 0.75).toFixed(0)} total. Foam (laminate/vinyl): $0.35/sq ft. Cork (sound reduction): $0.70/sq ft. Vapor barrier (concrete subfloor): $0.20/sq ft. For ${area.toFixed(0)} sq ft: $${(area * 0.55).toFixed(0)} standard. Below-grade (basement): require vapor barrier — add $${(area * 0.2).toFixed(0)}. Skip underlayment for glued-down floors but always for floating.` },
      { label: 'Multi-Room Bulk Pricing', value: `$${v.materialPricePerSqFt.toFixed(2)}/sq ft for ${totalSqFt.toFixed(0)} sq ft. Bulk: 500+ sq ft: 5-10% discount = $${(materialCost * 0.92).toFixed(2)}. 1000+ sq ft: 10-20% = $${(materialCost * 0.85).toFixed(2)}. ${totalSqFt > 500 ? 'Your quantity qualifies for bulk pricing!' : 'Adding ' + (500 - totalSqFt).toFixed(0) + ' more sq ft saves 5-10% on the full order.'} Check with supplier for "contractor pack" pricing on full boxes. Remnant pieces (last box) can often be negotiated at 30-50% off.` },
      { label: 'Color & Pattern Matching', value: `Order all from same lot # for consistent color/pattern. Different lots: visible variation. For ${boxes} boxes: check all boxes share same lot #. Order ${Math.ceil(boxes * 1.1)} boxes (${Math.ceil(boxes * 1.1) - boxes} extra) for future repairs — store under bed or in attic. Tile patterns (herringbone, diagonal) need 15-20% waste (vs your ${v.wastePercent}%). Patterned continuous flooring (plank): 10% minimum for matching seams.` },
      { label: 'Total Project Budget Worksheet', value: `Materials: $${materialCost.toFixed(2)} | Trim: $${trimCost.toFixed(2)} | Underlayment: $${(area * 0.55).toFixed(2)} | Labor: $${(area * 2.5).toFixed(2)} | Subfloor prep: $${(area * 1).toFixed(2)} | Disposal: $${(area * 0.15).toFixed(2)} | Total est: $${(materialCost + trimCost + area * 0.55 + area * 2.5 + area * 1 + area * 0.15).toFixed(2)}. Contingency (10%): $${((materialCost + trimCost + area * 0.55 + area * 2.5 + area * 1 + area * 0.15) * 0.1).toFixed(2)}. Grand total: $${((materialCost + trimCost + area * 0.55 + area * 2.5 + area * 1 + area * 0.15) * 1.1).toFixed(2)}.` },
    ]}
  },
  description: 'Calculate flooring material quantities and costs including waste factor, trim/molding, underlayment, and installation method. Supports any room shape with bulk pricing and multi-room estimates.',
  formula: 'Total Sq Ft = (L × W) × (1 + Waste%) | Cost = Total Sq Ft × Price/sq ft | Trim = 2 × (L + W) × $1.50 | Sq Yd = Sq Ft ÷ 9 | Boxes = Ceil(Sq Ft ÷ 20)',
  interpretation: 'Add 5-10% waste for straight layouts, 10-15% for diagonal or complex patterns. Hardwood costs $5-15/sq ft, laminate $2-5, tile $3-10, carpet $2-8, luxury vinyl $3-7 installed. Always order all materials from the same lot and keep 1-2 extra boxes for future repairs. A 252 sq ft room (18×14) costs $1,200-1,800 for mid-range materials installed. Pro installation adds $2-4/sq ft and is recommended for tile and hardwood. For DIY, click-lock vinyl or laminate are most forgiving.'
}

export default calcDef
