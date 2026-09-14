import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ herbArea: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), herbType: z.string().min(1) }),
  fields: [
    { name: 'herbArea', label: 'Garden Area (sq ft)', type: 'number', min: 1, step: '1' },
    { name: 'herbType', label: 'Herb Type', type: 'select', options: [{ label: 'Basil', value: 'basil' }, { label: 'Mint', value: 'mint' }, { label: 'Rosemary', value: 'rosemary' }, { label: 'Thyme', value: 'thyme' }, { label: 'Parsley', value: 'parsley' }, { label: 'Cilantro', value: 'cilantro' }, { label: 'Chives', value: 'chives' }, { label: 'Mixed Herbs', value: 'mixed' }] },
  ],
  defaults: { herbArea: "16", herbType: "basil" },
  presets: [
    { label: "Kitchen Windowsill", values: { herbArea: "3", herbType: "mixed" } },
    { label: "Raised Bed (4×4)", values: { herbArea: "16", herbType: "mixed" } },
    { label: "Basil for Pesto", values: { herbArea: "20", herbType: "basil" } },
    { label: "Mint Ground Cover", values: { herbArea: "12", herbType: "mint" } },
  ],
  compute: (v) => {
    const spacingRecord: Record<string, number> = { basil: 1, mint: 1.5, rosemary: 1.5, thyme: 0.75, parsley: 0.75, cilantro: 0.5, chives: 0.5, mixed: 1 }
    const spacing = spacingRecord[v.herbType as keyof typeof spacingRecord] || 1
    const plantsPerSqFt = 1 / (spacing * spacing)
    const totalPlants = Math.ceil(v.herbArea * plantsPerSqFt)
    const varieties = v.herbType === 'mixed' ? Math.min(totalPlants, 4) : 1
    const seedCost = totalPlants * 0.25
    const harvestPerPlant = v.herbType === 'basil' ? 8 : v.herbType === 'mint' ? 12 : v.herbType === 'mixed' ? 6 : 4
    const weeklyHarvestOz = totalPlants * harvestPerPlant * 0.5
    return { result: totalPlants, label: 'Plants Needed', unit: '', steps: [{ label: 'Herb Type', value: `${v.herbType.charAt(0).toUpperCase() + v.herbType.slice(1)}` }, { label: 'Garden Area', value: `${v.herbArea} sq ft` }, { label: 'Recommended Spacing', value: `${spacing} ft (${(spacing * 12).toFixed(0)} in)` }, { label: 'Plants per Sq Ft', value: `${plantsPerSqFt.toFixed(2)}` }, { label: 'Total Plants Needed', value: `${totalPlants}` }, { label: 'Varieties Included', value: `${varieties}` }, { label: 'Est. Weekly Harvest', value: `${weeklyHarvestOz.toFixed(0)} oz` }, { label: 'Seed Cost Estimate', value: `$${seedCost.toFixed(2)}` }] ,
    extras: [
      { label: "Sunlight Requirements", value: "Most culinary herbs need 6-8 hours of direct sunlight daily. Basil loves heat; mint and parsley tolerate partial shade." },
      { label: "Companion Planting", value: "Basil near tomatoes improves flavor. Mint repels ants but is invasive — always use containers for mint." },
      { label: "Harvesting Best Practice", value: "Harvest by cutting stems above a leaf node (not individual leaves) to encourage bushier growth." },
      { label: "Container Gardening", value: "All these herbs grow well in 6-12 in pots with drainage holes. Use quality potting mix, not garden soil." },
      { label: "Watering Schedule", value: "Water when top 1 in of soil is dry. Basil needs consistent moisture; rosemary and thyme prefer drier conditions between watering." },
      { label: "Succession Planting", value: "Cilantro and basil bolt in heat — plant small batches every 2-3 weeks for continuous harvest." },
      { label: "Winter Care", value: "Chives, mint, and thyme are perennials. In cold climates, mulch heavily or move containers indoors before frost." },
      { label: "Fertilizing Tips", value: "Use a balanced liquid fertilizer (5-5-5) every 2-4 weeks during growing season. Avoid over-fertilizing — it reduces flavor intensity." },
    ]}
  },
  description: 'Plan the perfect herb garden with precise plant spacing calculations. Determine exactly how many plants fit your bed, estimate weekly harvest volume, and learn variety-specific growing tips.',
  formula: 'Plants per Sq Ft = 1 ÷ (Spacing × Spacing) | Total Plants = Area × Plants per Sq Ft | Basil/Mint: 12-18 in centers, Thyme/Chives: 6-9 in centers',
  interpretation: 'A 4×4 ft raised bed (16 sq ft) of mixed herbs can supply a family of four with fresh herbs weekly. Basil is the most productive culinary herb — 4 plants yield enough for pesto all summer. Mint is extremely invasive and must be container-planted or confined with underground barriers. Most culinary herbs are surprisingly drought-tolerant once established and actually produce more aromatic oils when not over-watered. Start with 3-5 plants per variety for a household.'
}

export default calcDef
