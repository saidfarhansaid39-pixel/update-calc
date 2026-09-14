import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), depth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'length', label: 'Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'depth', label: 'Depth (in)', type: 'number', min: 1, step: '0.5' },
  ],
  defaults: { length: '20', width: '12', depth: '4' },
  presets: [
    { label: 'Driveway (2-car)', values: { length: '40', width: '20', depth: '6' } },
    { label: 'Garden Path', values: { length: '30', width: '3', depth: '2' } },
    { label: 'Patio Base', values: { length: '12', width: '16', depth: '4' } },
    { label: 'Parking Pad', values: { length: '20', width: '12', depth: '8' } },
  ],
  compute: (v) => {
    const volumeCF = v.length * v.width * (v.depth / 12)
    const volumeCY = volumeCF / 27
    const tons = volumeCY * 1.4
    const tonsWithCompaction = tons * 1.1
    const costEstimateLow = tons * 30
    const costEstimateHigh = tons * 60
    const areaSqFt = v.length * v.width
    const costPerSqFtLow = costEstimateLow / areaSqFt
    const costPerSqFtHigh = costEstimateHigh / areaSqFt
    return { result: tons, label: 'Gravel Needed (base)', unit: 'tons', steps: [{ label: 'Area', value: `${areaSqFt.toFixed(0)} sq ft` }, { label: 'Depth', value: `${v.depth} in` }, { label: 'Volume (cu ft)', value: `${volumeCF.toFixed(1)} cu ft` }, { label: 'Volume (cu yd)', value: `${volumeCY.toFixed(2)} cu yd` }, { label: 'Tons (no compaction)', value: `${tons.toFixed(2)} tons` }, { label: 'Tons (+10% compaction)', value: `${tonsWithCompaction.toFixed(2)} tons` }, { label: 'Estimated Cost Range', value: `$${costEstimateLow.toFixed(0)} - $${costEstimateHigh.toFixed(0)}` }, { label: 'Cost per Sq Ft', value: `$${costPerSqFtLow.toFixed(2)} - $${costPerSqFtHigh.toFixed(2)}/sq ft` }] ,
    extras: [
      { label: 'Gravel Types & Weight Variations', value: `Crushed stone #57 (3/4"): 1.4 tons/cu yd — most common for driveways. Pea gravel (3/8"): 1.3 tons/cu yd — best for walkways. Crushed concrete: 1.35 tons/cu yd — cheaper recycled option. Decomposed granite: 1.5 tons/cu yd — compacts well for paths. River rock: 1.5-1.7 tons/cu yd — heaviest, decorative only. Your ${tons.toFixed(1)} tons estimate is for standard crushed stone.` },
      { label: 'Depth Guidelines by Use Case', value: `${v.depth} in depth. Recommended: Driveway: 4-6 in base + 2-3 in surface (6-9 in total). Walkway: 2-3 in. Patio base: 4 in (under pavers). French drain: 12 in. Parking pad: 6-8 in. If you're laying ${v.depth} in for a ${v.depth <= 2 ? 'walkway or light path' : v.depth <= 4 ? 'typical base layer' : v.depth <= 6 ? 'driveway or heavy traffic area' : 'extra-duty surface'}, ${v.depth <= 2 ? 'that\'s appropriate depth' : v.depth <= 4 ? 'consider additional base layer for vehicles' : 'that\'s heavy-duty depth'}.` },
      { label: 'Compaction & Settlement Factor', value: `Add ${Math.round(tonsWithCompaction / tons * 100 - 100)}% for compaction/settlement: ${(tonsWithCompaction - tons).toFixed(2)} extra tons. Gravel compacts 8-12% under weight and rain. Order ${tonsWithCompaction.toFixed(1)} tons total. Don't skip — insufficient gravel leads to mud, ruts, and rework costing 3× more than ordering extra upfront.` },
      { label: 'Delivery & Spreading Logistics', value: `Typical delivery truck: 10-20 tons per load. Your ${tons.toFixed(1)} tons needs ${tons <= 10 ? 'a small dump truck' : tons <= 15 ? 'a standard dump truck' : 'a large tandem truck or multiple loads'}. Delivery fee: $50-150. Save by: combining orders with neighbors (split delivery fee), ordering from a yard vs big-box store (saves 20-40%). Self-spread: rent a wheelbarrow ($15/day) and a landscape rake ($10/day).` },
      { label: 'Cost Comparison: Bulk vs Bagged', value: `Bulk gravel: $30-60/ton ($${costEstimateLow.toFixed(0)}-${costEstimateHigh.toFixed(0)} for ${tons.toFixed(1)} tons). Bagged (0.5 cu ft bags): $4-6/bag = ${(volumeCF / 0.5).toFixed(0)} bags @ $5 = $${(volumeCF / 0.5 * 5).toFixed(0)} — 3-5× more expensive. For ${volumeCY.toFixed(1)} cu yd, bulk saves $${((volumeCF / 0.5 * 5) - costEstimateHigh).toFixed(0)}-$${((volumeCF / 0.5 * 5) - costEstimateLow).toFixed(0)}. Always order bulk for projects over 0.5 cu yd.` },
      { label: 'Base Layer Requirements', value: `${v.depth} in of gravel. For driveways: 4-6 in of #57 crushed stone as base, then 2-3 in of #8 or #9 stone for surface. For patios: 4 in compacted base + 1 in leveling sand. For walkways: 2-3 in pea gravel. Your project needs ${v.depth} in of surface material. ${v.depth >= 6 ? 'This is sufficient as a combined base+surface for driveways.' : v.depth >= 4 ? 'Good for patios; add base layer for driveways.' : 'Good for walkways only.'} Consider geotextile fabric underneath to prevent gravel migration into soil.` },
      { label: 'Geotextile Fabric & Edge Restraints', value: `Landscape fabric under gravel prevents weeds and mixing with soil (saves $${(tons * 10 * 0.20).toFixed(0)} in maintenance/yr). Edge restraints (plastic/metal edging) keep gravel contained — without them, 15-20% of gravel migrates away within 2 years. Cost: fabric ~$0.10-0.30/sq ft = $${(areaSqFt * 0.20).toFixed(0)} for your ${areaSqFt.toFixed(0)} sq ft. Edging: $0.50-2.00/linear ft.` },
      { label: 'DIY Installation vs Professional', value: `DIY: save 40-60% on labor but $${(areaSqFt).toFixed(0)} sq ft of gravel is ${areaSqFt >= 400 ? 'significant work — expect 2-4 days for 2 people' : 'doable in a weekend for 2 people'}. Professional installation: $3-8/sq ft installed vs $${(costPerSqFtLow.toFixed(2))}-$${(costPerSqFtHigh.toFixed(2))}/sq ft for materials only. For complex grading or drainage, hire a pro. For flat areas with good access, DIY saves $${((3 - costPerSqFtHigh) * areaSqFt).toFixed(0)}-${((8 - costPerSqFtLow) * areaSqFt).toFixed(0)}.` },
    ]}
  },
  description: 'Calculate gravel, crushed stone, or base material needed for driveways, paths, patios, and parking areas. Get volume in cubic feet and cubic yards, weight in tons with compaction factor, cost estimates for bulk vs bagged, delivery logistics, and DIY vs professional installation comparison.',
  formula: 'Volume (cu ft) = Length × Width × (Depth in ÷ 12) | Cubic Yards = Cu Ft ÷ 27 | Tons = Cu Yds × 1.4 (crushed stone density) | Tons with Compaction = Tons × 1.1 | Cost = Tons × Price per Ton ($30-60)',
  interpretation: 'Gravel weighs ~1.4 tons per cubic yard (crushed stone #57). Add 10% for compaction/settlement. Driveway: 4-6 in base + 2-3 in surface (6-9 in total). Walkway: 2-3 in. Patio base: 4 in. Bulk costs $30-60/ton (3-5× cheaper than bagged). Delivery: $50-150. Geotextile fabric prevents weed/migration issues. DIY saves 40-60% vs professional installation for flat, accessible areas.'
}

export default calcDef
