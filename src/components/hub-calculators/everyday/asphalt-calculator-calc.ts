import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), thickness: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), density: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'area', label: 'Area (sq ft)', type: 'number', min: 1, step: '10' },
    { name: 'thickness', label: 'Thickness (in)', type: 'number', min: 1, step: '0.5' },
    { name: 'density', label: 'Asphalt Density (lb/cu ft)', type: 'number', min: 100, step: '5' },
  ],
  defaults: { area: '600', thickness: '2', density: '145' },
  presets: [
    { label: 'Residential Driveway (600 sq ft)', values: { area: '600', thickness: '2', density: '145' } },
    { label: 'Parking Spot (200 sq ft)', values: { area: '200', thickness: '3', density: '145' } },
    { label: 'Walkway/Path (100 sq ft)', values: { area: '100', thickness: '1.5', density: '145' } },
    { label: 'Commercial Lot (5000 sq ft)', values: { area: '5000', thickness: '4', density: '150' } },
  ],
  compute: (v) => {
    const thicknessFt = v.thickness / 12
    const volumeCF = v.area * thicknessFt
    const weightLbs = volumeCF * v.density
    const tons = weightLbs / 2000
    const wasteTons = tons * 1.1
    const coverage2in = v.area / (600 / 2)
    const truckloads = Math.ceil(tons / 20)
    const sqYards = v.area / 9
    return { result: tons, label: 'Asphalt Required', unit: 'tons', steps: [
      { label: '1. Thickness in feet', value: `${v.thickness}" ÷ 12 = ${thicknessFt.toFixed(3)} ft` },
      { label: '2. Volume in cubic feet', value: `${v.area} sq ft × ${thicknessFt.toFixed(3)} ft = ${volumeCF.toFixed(1)} cu ft` },
      { label: '3. Weight in pounds', value: `${volumeCF.toFixed(1)} cu ft × ${v.density} lb/cu ft = ${weightLbs.toFixed(0)} lbs` },
      { label: '4. Convert to tons', value: `${weightLbs.toFixed(0)} lbs ÷ 2000 = ${tons.toFixed(2)} tons` },
      { label: '5. With 10% waste buffer', value: `${tons.toFixed(2)} × 1.10 = ${wasteTons.toFixed(2)} tons` },
      { label: '6. Truckloads (20 ton each)', value: `${wasteTons.toFixed(2)} ÷ 20 = ${truckloads} truck(s)` },
      { label: '7. Area in sq yards', value: `${v.area} sq ft ÷ 9 = ${sqYards.toFixed(1)} sq yd` },
    ] ,
    extras: [
      { label: "Thickness Guidelines", value: `Walkways: 1-1.5". Driveways: 2-3" (residential), 3-4" (commercial). Roads: 4-6". Parking lots: 3-4" plus 6-8" base. Thicker = longer lifespan.` },
      { label: "Compaction Factor", value: "Asphalt compacts 5-10% during rolling. Order 5-8% extra to account for compaction loss. Quote 'compacted tons' to your supplier for accurate pricing." },
      { label: "Base Preparation", value: `Proper base is critical — 4-8" of crushed stone or recycled concrete base, compacted to 95%+ density. Poor base = cracking within 1-2 years regardless of asphalt quality.` },
      { label: "Temperature Matters", value: "Asphalt must be laid above 50°F and rising for proper compaction. Cool weather = shorter workable time. Hot mix asphalt cools to unworkable temps in 30-45 minutes." },
      { label: "Cost Estimation", value: `Asphalt costs $100-200 per ton installed (varies by region). A 600 sq ft driveway at 2" = ~$800-1,600. Add $300-600 for sealing and striping.` },
      { label: "Sealcoating Schedule", value: "Sealcoat 6-12 months after new installation, then every 2-3 years. Sealcoating costs $0.15-0.30/sq ft and extends pavement life by 5-10 years." },
      { label: "Recycled Asphalt (RAP)", value: "Reclaimed Asphalt Pavement (RAP) can replace 15-30% of virgin material, reducing cost by 10-20%. RAP performs similarly but has a darker appearance initially." },
      { label: "Drainage Planning", value: `Grade the surface at 1-2% slope (1/8-1/4" per ft) for water runoff. Standing water accelerates deterioration. Crown the center of driveways for lateral drainage.` },
    ]}
  },
  description: 'Estimate asphalt tonnage needed for driveways, parking lots, walkways, or roads. Includes waste buffer, truckload count, and coverage area in square yards.',
  formula: 'Tons = (Area sq ft × (Thickness in ÷ 12) × Density lb/cu ft) ÷ 2000 | Waste = Tons × 1.10 | Truckloads = Tons ÷ 20',
  interpretation: 'Residential driveway (600 sq ft, 2"): ~7 tons. Density ranges from 140-155 lb/cu ft. Add 10% for waste/compaction. A semi-truck carries ~20 tons of asphalt.'
}

export default calcDef
