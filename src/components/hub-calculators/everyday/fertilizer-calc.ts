import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), nRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), nPct: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'area', label: 'Lawn Area (sq ft)', type: 'number', min: 100, step: '100' },
    { name: 'nRate', label: 'Desired N Rate (lb N/1000 sq ft)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'nPct', label: 'Fertilizer N (%)', type: 'number', min: 1, max: 50, step: '1' },
  ],
  defaults: { area: '5000', nRate: '1.0', nPct: '30' },
  presets: [
    { label: 'Spring Cool-Season Grass', values: { area: '5000', nRate: '1.0', nPct: '30' } },
    { label: 'Summer Bermuda Grass', values: { area: '8000', nRate: '0.75', nPct: '21' } },
    { label: 'New Lawn Establishment', values: { area: '3000', nRate: '1.5', nPct: '15' } },
    { label: 'Fall Overseeding Prep', values: { area: '4000', nRate: '0.5', nPct: '10' } },
  ],
  compute: (v) => {
    const fertilizerLbs = (v.area / 1000) * v.nRate / (v.nPct / 100)
    const totalNPerYear = v.nRate * 4
    const recommendedN = v.area / 1000 * totalNPerYear
    const annualFertilizerLbs = recommendedN / (v.nPct / 100)
    const totalPK = fertilizerLbs * 0.1
    const nPerBag = 40 * (v.nPct / 100)
    const bagsNeeded = Math.ceil(fertilizerLbs / 40)
    const coveragePerBag = (40 * (v.nPct / 100) * 1000) / v.nRate
    const nPerSqFt = v.nRate / 1000
    return { result: fertilizerLbs, label: 'Fertilizer per Application', unit: 'lbs', steps: [
      { label: 'Lawn Area', value: `${v.area.toLocaleString()} sq ft (${(v.area / 43560).toFixed(2)} acres)` },
      { label: 'Target Nitrogen Rate', value: `${v.nRate} lb N per 1,000 sq ft` },
      { label: 'Fertilizer N-P-K', value: `${v.nPct}% nitrogen (balance is P, K, filler)` },
      { label: 'Product Needed', value: `${v.area} / 1000 × ${v.nRate} / (${v.nPct} / 100) = ${fertilizerLbs.toFixed(1)} lbs` },
      { label: 'Nitrogen Applied', value: `${(v.area / 1000 * v.nRate).toFixed(2)} lbs N total` },
      { label: '40 lb Bags Needed', value: `${bagsNeeded} bag${bagsNeeded > 1 ? 's' : ''} (${coveragePerBag.toFixed(0)} sq ft/bag)` },
      { label: 'Annual Total (4 apps)', value: `${annualFertilizerLbs.toFixed(0)} lbs/yr` },
      { label: 'N per 1,000 sq ft', value: `${v.nRate} lbs (${(v.nRate / 1000 * 453.592).toFixed(0)} g per 1,000 sq ft)` },
    ] ,
    extras: [
      { label: "Soil Testing First", value: "Always test soil before fertilizing. Home kits ($10-20) test N-P-K + pH. Lab tests ($15-40 via your state's extension service) give precise recommendations. Optimal pH for most lawns: 6.0-7.0. Below 6.0: add lime (50 lbs/1,000 sq ft raises pH ~1.0). Above 7.0: add sulfur (5-10 lbs/1,000 sq ft). Testing prevents $50-100/yr in wasted fertilizer." },
      { label: "N-P-K Ratio Decoder", value: "First number = nitrogen (leaf growth). Second = phosphorus (root development). Third = potassium (stress tolerance). Lawn fertilizers: 30-0-4 (high N, no P, some K), 20-5-10 (balanced). Starter fertilizers: 10-20-10 (high P for roots). Fall fertilizers: 24-0-12 (high K for winter hardiness). Never use high-phosphorus fertilizer near waterways — causes algae blooms. Many states restrict P in lawn fertilizers." },
      { label: "Slow-Release vs Quick-Release N", value: "Quick-release (urea, ammonium sulfate): releases in 2-4 weeks, fast green-up, $15-25/40lb bag, burns lawn if over-applied. Slow-release (SCU, polymer-coated, organic): releases 8-12 weeks, even growth, $30-50/40lb bag, low burn risk. Best practice: use 50% slow-release in spring, 75% slow-release in summer. Slow-release costs 40% more per bag but lasts 3× as long." },
      { label: "Application Timing by Grass Type", value: "Cool-season (Kentucky bluegrass, fescue, ryegrass): N fertilize early spring (March-April), late spring (May), early fall (Sept), late fall (Nov). NOT in summer heat. Warm-season (Bermuda, zoysia, St. Augustine, centipede): N fertilize late spring (May), early summer (June), mid-summer (July), late summer (Aug). NOT after Sept 1. Wrong timing wastes 30-50% of N and damages grass." },
      { label: "Organic Fertilizer Options", value: "Compost: 1-2% N, apply 0.5 in layer, $30-50/cubic yard. Milorganite (5-2-0): slow-release biosolids, $15-25/36lb bag, non-burning. Blood meal (12-0-0): fast-release organic, $10-20/5lb bag, repels deer. Fish emulsion (5-1-1): liquid, $15-30/gal, fast green, short-lived. Corn gluten meal (9-0-0): pre-emergent weed control + fertilizer, $30-50/25lb, apply March-April." },
      { label: "Environmental & Runoff Prevention", value: "Never fertilize before heavy rain (forecast >0.5 in). 30-60% of broadcast fertilizer ends up in water if it rains within 24 hrs. Use drop spreader instead of rotary broadcast near water (5 ft buffer zone). Clean up granules from driveways and sidewalks (sweep back onto lawn). Phosphorus runoff causes toxic algae blooms — 500+ US water bodies affected annually. Buffer zone laws apply in 10+ states." },
      { label: "Spread Type & Calibration", value: "Broadcast spreader: faster, covers 8-12 ft swath, 15-25% overlap needed for even coverage. Drop spreader: precise, covers 2-3 ft swath, no overlap waste, better near edges. Calibration: set spreader to 1/2 - 2/3 of recommended setting, make 2 passes (crisscross pattern). Spreader calibration saves 15-25% fertilizer vs guessing. Cost: broadcast $50-150, drop $80-200. Rent from tool library: $15/day." },
      { label: "Iron vs Nitrogen for Green", value: "If your lawn is pale but growing fine: use iron supplement (ferrous sulfate, $10-20/20lb bag or liquid iron $15-30/gal). Iron greens lawn in 24-48 hrs without flush growth. N greens lawn but forces leaf growth = more mowing + more disease susceptibility. Rule: use N in spring/fall for growth, use iron in summer for color without forcing growth in stressful heat." },
    ]}
  },
  description: 'Calculate the exact amount of fertilizer needed for your lawn based on area, desired nitrogen application rate, and your chosen fertilizer\'s N-P-K percentage. Includes bags needed, annual projections, and coverage estimates.',
  formula: 'Fertilizer (lbs) = (Area / 1000) × N Rate / (N%/100) | Coverage per 40lb Bag = (40 × N%/100 × 1000) / N Rate sq ft | Annual Product = (Area/1000 × Annual N Rate) / (N%/100)',
  interpretation: 'For a typical 5,000 sq ft lawn needing 1 lb N/1,000 sq ft with a 30-0-4 fertilizer: apply 16.7 lbs of product. That is less than half a 40 lb bag — most homeowners over-apply by 2-3×. The #1 lawn care mistake is applying too much nitrogen too often, which creates disease-prone, shallow-rooted turf that requires more water, more mowing, and more chemicals. A soil test and careful rate calculation saves $100-200/yr and produces a healthier lawn.'
}

export default calcDef
