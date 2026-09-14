import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hours: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hourlyRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), materialCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'hours', label: 'Estimated Hours', type: 'number', min: 0.5, step: '0.5' },
    { name: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', min: 10, step: '5' },
    { name: 'materialCost', label: 'Materials Cost ($)', type: 'number', min: 0, step: '10' },
  ],
  defaults: { hours: "4", hourlyRate: "65", materialCost: "50" },
  presets: [
    { label: "TV Wall Mount", values: { hours: "2", hourlyRate: "75", materialCost: "30" } },
    { label: "Drywall Repair", values: { hours: "3", hourlyRate: "60", materialCost: "25" } },
    { label: "Ceiling Fan Install", values: { hours: "2.5", hourlyRate: "70", materialCost: "15" } },
    { label: "Furniture Assembly", values: { hours: "1.5", hourlyRate: "55", materialCost: "0" } },
  ],
  compute: (v) => { const h = parseFloat(v.hours)||0; const r = parseFloat(v.hourlyRate)||0; const mat = parseFloat(v.materialCost)||0; const labor = h * r; const total = labor + mat; const materialPct = total > 0 ? (mat / total) * 100 : 0; const withBuffer = total * 1.15; return { result: total, label: 'Total Job Cost', unit: '$', steps: [{ label: 'Labor Cost', value: `$${labor.toFixed(2)} (${h} hrs × $${r}/hr)` }, { label: 'Materials', value: `$${mat.toFixed(2)}` }, { label: 'Material Share', value: `${materialPct.toFixed(0)}% of total` }, { label: 'Total (Excl. Tax)', value: `$${total.toFixed(2)}` }, { label: 'With 15% Buffer', value: `$${withBuffer.toFixed(2)}` }, { label: 'Per Hour Effective', value: `$${(total / h).toFixed(2)}/hr blended` }] ,
    extras: [
      { label: "Typical Rates by Area", value: "Rural $40-60/hr, Suburban $50-80/hr, Urban $65-100/hr" },
      { label: "Minimum Service Call", value: "Most handymen charge a 1-2 hour minimum per visit" },
      { label: "Material Markup", value: "Pros typically mark up materials 10-20% above retail" },
      { label: "Permit Considerations", value: "Electrical, plumbing, or structural work may require permits ($50-500)" },
      { label: "Seasonal Demand", value: "Spring/summer rates can be 15-25% higher due to demand" },
      { label: "Bundle Discounts", value: "Multiple repairs in one visit often reduce per-task cost by 20-30%" },
      { label: "Emergency vs Scheduled", value: "Emergency call-outs cost 1.5-2× the standard hourly rate" },
      { label: "Insurance Check", value: "Verify handyman has liability insurance before hiring for jobs over $500" },
    ]} },
  description: 'Get accurate handyman cost estimates for home repairs, installations, and assembly. Factors in labor hours, local rates, materials markup, and a 15% contingency buffer.',
  formula: 'Total Cost = (Hours × Hourly Rate) + Materials | Blended Rate = Total ÷ Hours',
  interpretation: 'Typical handyman rates range from $50-100/hr depending on location and expertise. Most pros charge a 1-2 hour minimum per visit. Materials are usually marked up 10-20% above retail. For jobs over $500, always get 3 quotes. Complex electrical, plumbing, or structural work often requires licensed specialists at higher rates ($80-150/hr) and may need permits. Bundling multiple small tasks into one visit saves substantially on travel and minimum charges.'
}

export default calcDef
