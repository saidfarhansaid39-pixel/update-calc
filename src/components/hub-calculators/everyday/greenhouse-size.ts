import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ghLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ghWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ghHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'ghLength', label: 'Greenhouse Length (ft)', type: 'number', min: 4, step: '2' },
    { name: 'ghWidth', label: 'Greenhouse Width (ft)', type: 'number', min: 4, step: '2' },
    { name: 'ghHeight', label: 'Greenhouse Height (ft)', type: 'number', min: 4, step: '1' },
  ],
  defaults: { ghLength: '12', ghWidth: '8', ghHeight: '7' },
  presets: [
    { label: 'Hobby (2 raised beds)', values: { ghLength: '10', ghWidth: '8', ghHeight: '7' } },
    { label: 'Serious Grower', values: { ghLength: '16', ghWidth: '10', ghHeight: '8' } },
    { label: 'Family Food Production', values: { ghLength: '24', ghWidth: '14', ghHeight: '10' } },
    { label: 'Small Hoop House', values: { ghLength: '20', ghWidth: '10', ghHeight: '6' } },
  ],
  compute: (v) => {
    const floorArea = v.ghLength * v.ghWidth
    const volume = floorArea * v.ghHeight
    const ventArea = floorArea * 0.15
    const heatingNeeded = floorArea * 0.5
    const hoopFrameCost = floorArea * 3
    const glassCost = floorArea * 15
    const plantCapacity = Math.floor(floorArea / 1.5)
    const annualTomatoes = plantCapacity * 8
    return { result: floorArea, label: 'Floor Area', unit: 'sq ft', steps: [{ label: 'Dimensions', value: `${v.ghLength} × ${v.ghWidth} × ${v.ghHeight} ft` }, { label: 'Floor Area', value: `${floorArea.toFixed(0)} sq ft` }, { label: 'Interior Volume', value: `${volume.toFixed(0)} cu ft` }, { label: 'Ventilation Needed', value: `${ventArea.toFixed(0)} sq ft (15% of floor)` }, { label: 'Heating (est BTU/hr)', value: `${heatingNeeded.toFixed(0)} BTU/hr` }, { label: 'Plant Capacity', value: `~${plantCapacity} plants (1.5 sq ft/plant avg)` }, { label: 'Avg Annual Tomato Yield', value: `~${annualTomatoes} lbs/yr` }, { label: 'Hoop Frame Cost Est', value: `$${hoopFrameCost.toFixed(0)}-$${glassCost.toFixed(0)}` }] ,
    extras: [
      { label: 'Sizing by Growing Goals', value: `${floorArea.toFixed(0)} sq ft greenhouse. Small (<80 sq ft): 2-4 raised beds, 10-20 plants, seasonal extension. Medium (80-200 sq ft): 4-8 beds, year-round growing for 1-2 people. Large (200-400 sq ft): 8-16 beds, family food production (3-4 people). Commercial (>400 sq ft): market growing. Your ${floorArea.toFixed(0)} sq ft greenhouse supports ${plantCapacity} plants and ~${annualTomatoes} lbs of tomatoes per season.` },
      { label: 'Structural Cost Comparison', value: `Hoop house (PVC/metal): $2-5/sq ft = $${(floorArea * 3.5).toFixed(0)}-$${(floorArea * 5).toFixed(0)}. Glass or polycarbonate: $10-20/sq ft = $${(floorArea * 15).toFixed(0)}-$${(floorArea * 20).toFixed(0)}. Your ${floorArea.toFixed(0)} sq ft: hoop = $${hoopFrameCost.toFixed(0)}, glass = $${glassCost.toFixed(0)}. Add foundation ($2-5/sq ft), shelving ($200-500), irrigation ($100-300). Hoop houses are 60-70% cheaper but less durable in snow/wind.` },
      { label: 'Ventilation Requirements Detail', value: `Minimum vent area: ${ventArea.toFixed(0)} sq ft (equals ${(ventArea / 4).toFixed(1)} standard 2×2 ft vents). Ridge vents + side vents create natural convection. Add a fan for circulation: 1 CFM per cu ft of volume = need a ${volume.toFixed(0)} CFM fan minimum. For summer growing in warm climates, double vent area to 30% of floor. Automatic vent openers ($30-80 each) prevent overheating when you're away.` },
      { label: 'Heating & Climate Zone Factors', value: `Base heating need: ${heatingNeeded.toFixed(0)} BTU/hr at 50°F delta (outside 20°F → inside 70°F). For zone 5-6 (avg winter low 0-20°F): multiply by 1.5-2×. Zone 7-8 (20-30°F): multiply by 1-1.5×. Zone 9+ (<30°F): minimal heating. Your ${v.ghLength}×${v.ghWidth} greenhouse in a cold zone may need ${(heatingNeeded * 2).toFixed(0)} BTU/hr. Double-layer polycarbonate reduces heat loss 40% vs single layer.` },
      { label: 'Growing Season Extension', value: `Unheated greenhouse: extends season 4-6 weeks (spring + fall). Heated to 50°F min: year-round growing in zones 5-8. At ${heatingNeeded.toFixed(0)} BTU/hr, heating costs ~$${(heatingNeeded * v.ghLength / 100000 * 1.20 * v.ghWidth * 6).toFixed(0)}/month in gas (assuming ${volume.toFixed(0)} cu ft volume). Solar heating (water barrels, thermal mass) reduces heating 20-40%. Each $1 in greenhouse heat saves ~$3 in grocery store produce.` },
      { label: 'Plant Spacing & Layout Optimization', value: `${plantCapacity} plants at 1.5 sq ft avg spacing. Efficient layout: 3-ft paths between 4-ft beds. Your ${v.ghLength}×${v.ghWidth} ft greenhouse can fit ${floorArea >= 200 ? '4-6 beds with center path' : '2-3 beds along sides'}. Trellising vines (tomatoes, cucumbers) vertically saves floor space — each trellised plant uses 1 sq ft instead of 3-4. Seedling shelves add 50-100% more capacity.` },
      { label: 'Foundation & Site Preparation', value: `Level site required — grading costs $1-3/sq ft. Foundation options: wood frame on gravel ($1-2/sq ft), concrete piers ($3-5/sq ft), concrete slab ($5-10/sq ft). Your ${floorArea.toFixed(0)} sq ft greenhouse: gravel base = $${(floorArea * 1.5).toFixed(0)}, piers = $${(floorArea * 4).toFixed(0)}, slab = $${(floorArea * 7).toFixed(0)}. Proper drainage is critical — install perimeter drainage if site has poor water runoff. Orient east-west for maximum winter light.` },
      { label: 'Water & Irrigation Systems', value: `Greenhouse plants need ~1 gal/sq ft/week = ${floorArea.toFixed(0)} gal/week for your size. Drip irrigation ($0.50-1.00/sq ft) saves 50-70% water vs hand watering = $${(floorArea * 0.75).toFixed(0)} for your greenhouse. Rainwater collection: 1 sq ft roof catches ~0.6 gal per 1 inch rain. Your ${floorArea.toFixed(0)} sq ft roof: ~$${(floorArea * 0.6).toFixed(0)} gal per inch of rain. Install a 55-gal rain barrel for regular watering without tapping household supply.` },
    ]}
  },
  description: 'Design and size the perfect greenhouse for your growing goals — from small hobby hoop houses to serious family food production. Calculate floor area, interior volume, ventilation requirements, heating needs, plant capacity, estimated yields, and structural costs for glass vs hoop-house options.',
  formula: 'Floor Area = Length × Width | Volume = L × W × Height | Ventilation = Floor Area × 15% min | Heating (BTU/hr) = Floor Area × 0.5 (50°F delta) | Plant Capacity = Floor Area ÷ 1.5 | Tomato Yield ≈ Plants × 8 lbs | Hoop Cost ≈ $3-5/sq ft | Glass Cost ≈ $10-20/sq ft',
  interpretation: 'Minimum greenhouse for serious growing: 8×10 ft (80 sq ft). Medium: 10×16 ft (160 sq ft, ~100 plants). Large: 14×24 ft (336 sq ft, ~225 plants). Hoop houses cost $3-5/sq ft (60-70% cheaper than glass). Ventilation must be 15-20% of floor area. Heating needs vary by climate zone (multiply by 1.5-2× for cold zones). Unheated greenhouses extend season 4-6 weeks. Year-round growing in zones 5+ requires supplemental heat. Orient east-west for maximum light. Budget $2-5/sq ft for foundation.'
}

export default calcDef
