import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ homeValue: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), homeAgeYears: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), squareFootage: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), recentRenovations: z.string().min(1) }),
  fields: [
    { name: 'homeValue', label: 'Home Value ($)', type: 'number', min: 50000, step: '50000' },
    { name: 'homeAgeYears', label: 'Home Age (years)', type: 'number', min: 0, step: '5' },
    { name: 'squareFootage', label: 'Square Footage', type: 'number', min: 200, step: '100' },
    { name: 'recentRenovations', label: 'Recent Renovations', type: 'select', options: [{ label: 'None', value: 'none' }, { label: 'Minor (paint, fixtures)', value: 'minor' }, { label: 'Major (kitchen, bath)', value: 'major' }, { label: 'Full Renovation', value: 'full' }] },
  ],
  defaults: { homeValue: "350000", homeAgeYears: "15", squareFootage: "1800", recentRenovations: "minor" },
  presets: [
    { label: "New Construction", values: { homeValue: "450000", homeAgeYears: "2", squareFootage: "2400", recentRenovations: "none" } },
    { label: "Fixer-Upper", values: { homeValue: "200000", homeAgeYears: "40", squareFootage: "1400", recentRenovations: "full" } },
    { label: "Starter Home", values: { homeValue: "280000", homeAgeYears: "15", squareFootage: "1500", recentRenovations: "minor" } },
    { label: "Luxury Estate", values: { homeValue: "800000", homeAgeYears: "10", squareFootage: "4000", recentRenovations: "major" } },
  ],
  compute: (v) => {
    const valueBased = v.homeValue * 0.01
    const sqftBased = v.squareFootage * 1.50
    const ageMultiplier = Math.min(3, 1 + v.homeAgeYears * 0.03)
    const renoFactors: Record<string, number> = { none: 1, minor: 0.9, major: 0.7, full: 0.5 }
    const renoFactor = renoFactors[v.recentRenovations as keyof typeof renoFactors] || 1
    const annualBudget = Math.max(valueBased, sqftBased) * ageMultiplier * renoFactor
    const monthlyBudget = annualBudget / 12
    const fiveYearReserve = annualBudget * 5
    const majorRepairBudget = annualBudget * 3
    return { result: annualBudget, label: 'Annual Maintenance Reserve', unit: '$', steps: [{ label: '1% of Home Value', value: `$${valueBased.toFixed(0)}/yr` }, { label: '$1.50/sq ft Rule', value: `$${sqftBased.toFixed(0)}/yr` }, { label: 'Method Used (greater)', value: `$${Math.max(valueBased, sqftBased).toFixed(0)}/yr` }, { label: 'Age Multiplier', value: `${v.homeAgeYears} yr → ${ageMultiplier.toFixed(2)}×` }, { label: 'Renovation Discount', value: `${renoFactor.toFixed(1)}×` }, { label: 'Annual Reserve Needed', value: `$${annualBudget.toFixed(0)}` }, { label: 'Monthly Set Aside', value: `$${monthlyBudget.toFixed(0)}` }, { label: '5-Year Reserve Target', value: `$${fiveYearReserve.toFixed(0)}` }] ,
    extras: [
      { label: "The 1% Rule Explained", value: "Set aside 1% of your home's value annually for maintenance. On a $350K home: $3,500/yr = $292/mo. Newer homes may need 0.5%; older homes 1.5-2%." },
      { label: "Roof Replacement Timeline", value: "Asphalt shingles: 15-25 yrs ($5,000-12,000) | Metal: 40-70 yrs ($12,000-25,000) | Tile: 50+ years ($15,000-35,000). Most expensive single repair." },
      { label: "HVAC System Lifespan", value: "Furnace: 15-25 yrs ($3,000-8,000) | AC: 10-15 yrs ($4,000-9,000) | Heat pump: 10-15 yrs ($5,000-10,000). Annual service: $150-300." },
      { label: "Plumbing & Electrical", value: "Water heater: 8-12 yrs ($600-1,500) | Repiping: 40-50 yrs ($4,000-15,000) | Panel upgrade: $1,500-4,000 | Sump pump: 5-10 yrs ($200-500)" },
      { label: "Painting & Finishes", value: "Interior paint: every 5-7 yrs ($2,000-6,000) | Exterior paint: every 7-10 yrs ($3,000-8,000) | Deck stain: every 2-3 yrs ($500-2,000)" },
      { label: "Emergency Fund Target", value: "Keep 2-3 months of take-home pay ($10,000-20,000) in a dedicated home repair fund for unexpected failures (burst pipe, HVAC death, roof leak)." },
      { label: "Seasonal Maintenance Checklist", value: "Spring: HVAC tune-up, gutter cleaning, exterior inspection | Fall: furnace service, weatherstripping, pipe insulation | Quarterly: replace HVAC filters" },
      { label: "Renovation vs Repair", value: "Major renovations (kitchen/bath) add value but don't reduce maintenance costs long-term. Systems (roof, HVAC, plumbing) need replacement regardless of cosmetic upgrades." },
    ]}
  },
  description: 'Calculate your home maintenance budget using dual methods (1% of value vs $1.50/sq ft) with adjustments for age and recent renovations. Plan for both annual upkeep and major repairs.',
  formula: 'Annual = Max(Home Value × 1%, Sq Ft × $1.50) × Age Factor × Renovation Factor | Age Factor = 1 + (Years × 0.03) capped at 3.0 | Monthly = Annual ÷ 12',
  interpretation: 'The 1% rule is the industry standard: budget 1% of your home value annually for maintenance. However, for larger homes in expensive markets, the $1.50/sq ft method may give more realistic figures. Older homes need significantly more — a 40-year-old home may need 2-3% of value annually. Recent major renovations reduce short-term needs but major systems still age. The biggest maintenance expenses are roof replacement ($8,000-25,000), HVAC replacement ($6,000-15,000), and repiping ($5,000-15,000). Aim to have 1-2% of home value in a liquid repair fund at all times.'
}

export default calcDef
