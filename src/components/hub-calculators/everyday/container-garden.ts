import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ containerCount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), containerSize: z.string().min(1), plantType: z.string().min(1), soilCost: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), containerMaterial: z.string().min(1), fertilizerCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'containerCount', label: 'Number of Containers', type: 'number', min: 1, step: '1' },
    { name: 'containerSize', label: 'Container Size', type: 'select', options: [{ label: 'Small (1-2 gal)', value: 'small' }, { label: 'Medium (3-5 gal)', value: 'medium' }, { label: 'Large (5+ gal)', value: 'large' }] },
    { name: 'containerMaterial', label: 'Container Material', type: 'select', options: [{ label: 'Plastic/Terracotta', value: 'standard' }, { label: 'Self-Watering', value: 'selfwater' }, { label: 'Fabric Grow Bag', value: 'fabric' }, { label: 'Decorative Ceramic', value: 'ceramic' }] },
    { name: 'plantType', label: 'Plant Type', type: 'select', options: [{ label: 'Herbs', value: 'herbs' }, { label: 'Vegetables', value: 'veggies' }, { label: 'Flowers', value: 'flowers' }, { label: 'Succulents', value: 'succulents' }] },
    { name: 'soilCost', label: 'Potting Soil Cost per Bag ($)', type: 'number', min: 5, step: '5' },
    { name: 'fertilizerCost', label: 'Annual Fertilizer ($)', type: 'number', min: 0, step: '10' },
  ],
  defaults: { containerCount: '5', containerSize: 'medium', containerMaterial: 'standard', plantType: 'herbs', soilCost: '12', fertilizerCost: '20' },
  presets: [
    { label: 'Herb Garden (4 pots)', values: { containerCount: '4', containerSize: 'small', containerMaterial: 'standard', plantType: 'herbs', soilCost: '10', fertilizerCost: '15' } },
    { label: 'Tomato & Pepper Garden', values: { containerCount: '6', containerSize: 'large', containerMaterial: 'selfwater', plantType: 'veggies', soilCost: '14', fertilizerCost: '30' } },
    { label: 'Balcony Flower Boxes', values: { containerCount: '8', containerSize: 'small', containerMaterial: 'ceramic', plantType: 'flowers', soilCost: '12', fertilizerCost: '25' } },
    { label: 'Succulent Collection', values: { containerCount: '10', containerSize: 'small', containerMaterial: 'fabric', plantType: 'succulents', soilCost: '10', fertilizerCost: '10' } },
  ],
  compute: (v) => {
    const soilGallons: Record<string, number> = { small: 1.5, medium: 4, large: 7 }
    const containerPrices: Record<string, number> = { standard: 5, selfwater: 15, fabric: 4, ceramic: 18 }
    const plantCosts: Record<string, number> = { herbs: 4, veggies: 5, flowers: 6, succulents: 5 }
    const totalSoilGallons = v.containerCount * soilGallons[v.containerSize]
    const bagsNeeded = Math.ceil(totalSoilGallons / 8)
    const totalSoilCost = bagsNeeded * v.soilCost
    const containerPrice = containerPrices[v.containerMaterial]
    const containerCost = v.containerCount * containerPrice
    const plantCost = v.containerCount * plantCosts[v.plantType]
    const firstYearTotal = totalSoilCost + containerCost + plantCost + v.fertilizerCost
    const annualRecurring = v.fertilizerCost + (v.plantType === 'veggies' || v.plantType === 'flowers' ? plantCost * 0.5 : plantCost * 0.3)
    const costPerContainer = firstYearTotal / v.containerCount
    const soilCostPerGallon = v.soilCost / 8
    return { result: firstYearTotal, label: 'First-Year Setup Cost', unit: '$', steps: [
      { label: 'Containers', value: `${v.containerCount} × ${v.containerMaterial} ($${containerPrice.toFixed(2)} ea) = $${containerCost.toFixed(2)}` },
      { label: 'Soil Volume Needed', value: `${v.containerCount} × ${soilGallons[v.containerSize]} gal = ${totalSoilGallons.toFixed(1)} gal` },
      { label: 'Soil Bags (8 cu ft each)', value: `${bagsNeeded} bags @ $${v.soilCost.toFixed(2)} = $${totalSoilCost.toFixed(2)}` },
      { label: 'Plants/Seeds', value: `${v.containerCount} × $${plantCosts[v.plantType].toFixed(2)} (${v.plantType}) = $${plantCost.toFixed(2)}` },
      { label: 'Fertilizer (annual)', value: `$${v.fertilizerCost.toFixed(2)}` },
      { label: 'First-Year Total', value: `$${firstYearTotal.toFixed(2)} ($${costPerContainer.toFixed(2)}/container)` },
      { label: 'Annual Recurring Cost', value: `$${annualRecurring.toFixed(2)}/yr (soil refresh, fertilizer, replacements)` },
      { label: 'Soil Cost per Gallon', value: `$${v.soilCost.toFixed(2)}/bag ÷ 8 gal = $${soilCostPerGallon.toFixed(2)}/gal` },
    ] ,
    extras: [
      { label: 'Container Material Comparison', value: v.containerMaterial === 'fabric' ? 'Fabric grow bags ($4 ea) are cheapest and prevent root circling (air-prunes roots). They dry out faster though — water daily in summer. Lifespan: 2-3 seasons. Best for: tomatoes, peppers, potatoes.' : v.containerMaterial === 'selfwater' ? 'Self-watering containers ($15 ea) have a reservoir that waters for 3-7 days. Great for: tomatoes (consistent moisture prevents blossom end rot) and vacation-prone gardeners. Slightly more complex to set up but reduces watering frequency by 70%.' : v.containerMaterial === 'ceramic' ? 'Ceramic pots ($18 ea) are the most attractive but heavy. Glazed ceramic retains moisture better than terracotta. Terracotta is porous — dries fast, needs frequent watering, and can crack in freeze-thaw. Best for: succulents (drying) or houseplants indoors.' : 'Standard plastic pots ($5 ea): cheapest option for large volumes. UV degrades over 2-4 years outdoors. Choose food-grade plastic for vegetables. Best for: budget-friendly starter gardens and annual flowers.' },
      { label: 'Growing Medium Economics', value: `At $${soilCostPerGallon.toFixed(2)}/gal, premium potting mix costs 2-3× garden soil but provides proper aeration and drainage. NEVER use garden soil — it compacts in containers and starves roots of oxygen. Mix ratio: 60% potting mix + 20% perlite + 20% compost for vegetables. Reuse soil yearly: refresh with 30% new mix + compost + perlite to restore structure.` },
      { label: 'Plant-Specific Container Needs', value: v.plantType === 'veggies' ? 'Vegetables need LARGE containers. Tomatoes: 5+ gal per plant. Peppers: 3+ gal. Lettuce: 1 gal/plant. Cucumbers: 5+ gal with trellis. Carrots: 2+ gal (deep containers). The biggest mistake with container veggies is undersized pots — they restrict roots and reduce yield by 50-70%.' : v.plantType === 'herbs' ? 'Herbs thrive in small-medium containers (1-2 gal each). Basil: needs consistent moisture, 6+ hrs sun. Mint: grows aggressively — give it its own pot. Rosemary: well-draining soil, don\'t overwater. Parsley & chives: tolerate partial shade. You\'ll save $20-40/month on grocery herbs with just 3-4 pots.' : v.plantType === 'flowers' ? 'Flowering containers need at least 6 hours of direct sun for most annuals. Petunias, geraniums, and zinnias are easiest. Deadhead (remove spent blooms) weekly for continuous flowering. Slow-release fertilizer at planting + liquid feed every 2 weeks gives best bloom.' : 'Succulents need SMALL containers with perfect drainage. Add 30% sand/perlite to potting mix — water only when soil is completely dry (every 7-14 days). Overwatering is the #1 killer of succulents. Small terracotta pots ($3-5) are ideal. They propagate easily from leaves — multiply your collection for free.' },
      { label: 'Watering & Maintenance Schedule', value: `Container gardens need more water than in-ground — ${v.containerSize === 'small' ? 'daily (sometimes twice in heat waves)' : v.containerSize === 'medium' ? 'every 1-2 days' : 'every 2-3 days'} in summer. Group plants by water needs. Self-watering pots reduce frequency by 50-70%. Morning watering is best (reduces evaporation and fungal disease). In winter, reduce to 1-2×/week depending on indoor heating.` },
      { label: 'Seasonal Planting Calendar', value: 'Spring (Mar-May): tomatoes, peppers, basil (start indoors 6-8 weeks before last frost). Summer (Jun-Aug): heat-lovers like eggplant, okra, sunflowers. Fall (Sep-Nov): lettuce, kale, spinach, peas, carrots. Winter (Dec-Feb): indoor herbs, microgreens (7-14 day harvest cycle). Stagger planting dates by 2-3 weeks for continuous harvest. Year-round microgreens: $0.50/tray vs $5-8 at stores.' },
      { label: 'Fertilizer Strategy & Cost', value: `At $${v.fertilizerCost.toFixed(2)}/year for ${v.containerCount} containers, you're spending $${(v.fertilizerCost / v.containerCount / 12).toFixed(2)}/container/month. Container plants need more fertilizer than in-ground because nutrients leach out with each watering. Schedule: slow-release granules at planting + water-soluble every 2 weeks for vegetables/flowers, monthly for herbs, quarterly for succulents. Organic: fish emulsion + kelp meal ($$20-30/yr).` },
      { label: 'Space, Light & Placement', value: `${v.containerCount} containers need ~${(v.containerCount * (v.containerSize === 'small' ? 1 : v.containerSize === 'medium' ? 2.5 : 4)).toFixed(0)} sq ft of space. Place in full sun (6+ hrs/day) for vegetables and most flowers. Partial shade (3-6 hrs) for leafy greens and herbs. Succulents need bright indirect light indoors. Use plant caddies (wheeled saucers) for heavy containers — lets you chase the sun through seasons.` },
      { label: 'Harvest Value & ROI', value: `First-year garden cost: $${firstYearTotal.toFixed(2)} vs grocery value. A single tomato plant ($5) yields 10-20 lbs ($30-60 at $3/lb). Basil: $4 plant = $40+ value over a season (grocery basil: $3/bunch × every 2 weeks = $78/year). 5 medium containers of vegetables can produce $300-600/year in fresh produce. Payback: typically 6-12 months. After year 1, annual cost drops to $${annualRecurring.toFixed(0)} (containers and soil already bought).` },
    ]}
  },
  description: 'Calculate the full cost to set up and maintain a container garden including containers (plastic, terracotta, self-watering, fabric, ceramic), potting soil, plants/seeds, and fertilizer. Compare by plant type (herbs, vegetables, flowers, succulents) and get watering schedules, harvest value projections, and annual upkeep costs.',
  formula: 'Setup = (Containers × ContainerPrice) + (Bags × SoilCost) + (Containers × PlantCost) + Fertilizer. Annual recurring = Fertilizer + PlantReplacement. Soil bags = ceil(Containers × SoilGal/Container ÷ 8). Container prices: standard $5, fabric $4, self-watering $15, ceramic $18.',
  interpretation: 'Container garden first-year cost: 5 medium containers = $100-150. After year 1, annual cost drops to $30-50. Herbs are easiest for beginners and offer the fastest ROI — 3-4 herb pots pay for themselves in 2-3 months vs grocery prices. Vegetables need large containers (5+ gal for tomatoes) and 6+ hours of direct sun. Self-watering pots cost 3× more but reduce watering frequency by 70%. Fabric grow bags are cheapest and healthiest for roots but dry fastest. Annual vegetables typically yield $300-600/year in produce value per 5 containers. Never use garden soil in containers — use potting mix with perlite for proper aeration.'
}

export default calcDef
