import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalHarvest: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), harvestUnit: z.string().min(1), area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), areaUnit: z.string().min(1) }),
  fields: [
    { name: 'totalHarvest', label: 'Total Harvest', type: 'number', min: 1, step: '10' },
    { name: 'harvestUnit', label: 'Harvest Unit', type: 'select', options: [{ label: 'Bushels', value: 'bushel' }, { label: 'Pounds', value: 'lb' }, { label: 'Tons', value: 'ton' }, { label: 'Kilograms', value: 'kg' }] },
    { name: 'area', label: 'Field Area', type: 'number', min: 0.1, step: '0.5' },
    { name: 'areaUnit', label: 'Area Unit', type: 'select', options: [{ label: 'Acres', value: 'acre' }, { label: 'Hectares', value: 'ha' }] },
  ],
  defaults: { totalHarvest: '8000', harvestUnit: 'bushel', area: '50', areaUnit: 'acre' },
  presets: [
    { label: 'Corn (US Midwest)', values: { totalHarvest: '17500', harvestUnit: 'bushel', area: '100', areaUnit: 'acre' } },
    { label: 'Soybean Field', values: { totalHarvest: '2700', harvestUnit: 'bushel', area: '60', areaUnit: 'acre' } },
    { label: 'Wheat (Metric)', values: { totalHarvest: '12000', harvestUnit: 'kg', area: '5', areaUnit: 'ha' } },
    { label: 'Small Market Garden', values: { totalHarvest: '2000', harvestUnit: 'lb', area: '1', areaUnit: 'acre' } },
  ],
  compute: (v) => {
    const areaAcres = v.areaUnit === 'ha' ? v.area * 2.471 : v.area
    const areaHa = v.areaUnit === 'acre' ? v.area / 2.471 : v.area
    const yieldPerAcre = v.totalHarvest / areaAcres
    const yieldPerHa = v.totalHarvest / areaHa
    const benchmarkValues: Record<string, string> = { bushel: 'Corn: 150-200 | Soy: 40-70 | Wheat: 40-80', lb: 'Mixed veg: 5,000-15,000 | Potatoes: 20,000-30,000', ton: 'Hay: 3-6 | Silage corn: 20-30', kg: 'Corn: 9,400-12,500 | Wheat: 2,700-5,000' }
    return { result: yieldPerAcre, label: 'Yield per Acre', unit: `${v.harvestUnit}/acre`, steps: [{ label: 'Total Harvest', value: `${v.totalHarvest.toLocaleString()} ${v.harvestUnit}` }, { label: 'Field Area', value: `${areaAcres.toFixed(2)} acres (${areaHa.toFixed(2)} ha)` }, { label: 'Yield per Acre', value: `${yieldPerAcre.toFixed(2)} ${v.harvestUnit}/acre` }, { label: 'Yield per Hectare', value: `${yieldPerHa.toFixed(2)} ${v.harvestUnit}/ha` }, { label: 'Regional Benchmark', value: benchmarkValues[v.harvestUnit] || 'Check local extension service' }, { label: 'Percent vs Avg', value: yieldPerAcre > 0 ? `${(yieldPerAcre / 150 * 100).toFixed(0)}% of benchmark (adjust for crop)` : 'N/A' }, { label: 'Revenue Potential', value: `At $5/bu gross: ~$${(yieldPerAcre * 5).toFixed(0)}/acre` }] ,
    extras: [
      { label: "Yield Benchmark", value: "USDA reports county-level yield averages. Corn: 150-200 bu/ac, Soybeans: 40-70 bu/ac, Wheat: 40-80 bu/ac, Cotton: 2-3 bales/ac." },
      { label: "Profitability Link", value: "Yield is the #1 driver of farm profitability. A 10 bu/ac increase in corn at $5/bu adds $50/ac gross revenue before input costs." },
      { label: "Soil Testing", value: "Test NPK, pH, and organic matter annually. Optimal pH (6.0-7.0) alone can improve yield 10-25% by making existing nutrients available." },
      { label: "Variable Rate Tech", value: "VRR (Variable Rate Application) adjusts seed and fertilizer by zone within a field, typically boosting yield 5-15% while reducing input costs." },
      { label: "Irrigation Impact", value: "Irrigated corn yields 200-240 bu/ac vs dryland 120-160 bu/ac. The yield gap widens in drought years. Center pivot costs $800-1,200/ac installed." },
      { label: "Crop Insurance", value: "Yield history determines your APH (Actual Production History) for insurance. Maintain 10 years of yield records to maximize coverage options." },
      { label: "Precision Harvest", value: "GPS yield mapping reveals low-yield zones for targeted remediation. Many farmers recover 5-10% yield by addressing compaction or drainage." },
      { label: "Sustainability", value: "Cover crops and reduced tillage improve long-term yield stability by 5-15% while building soil carbon. NRCS offers cost-share programs." },
    ]}
  },
  description: 'Calculate crop yield per acre and per hectare from total harvest and field area. Compare against regional benchmarks, estimate revenue potential, and make data-driven decisions for next season\'s inputs.',
  formula: 'Yield per Acre = Total Harvest ÷ Field Area (acres) | Yield per Hectare = Total Harvest ÷ Field Area (ha) | 1 ha = 2.471 ac',
  interpretation: 'Crop yield is the primary driver of farm profitability. US benchmarks: corn 150-200 bu/ac, soybeans 40-70 bu/ac, winter wheat 40-80 bu/ac. A 10% yield improvement on 500 acres of corn at $5/bu adds ~$4,000-5,000 to gross revenue. Compare your yield to county-level USDA data to identify improvement opportunities in soil management, irrigation, and precision agriculture.'
}

export default calcDef
