import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ vgWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), vgHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), vgPocketSpacing: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), vgPlantType: z.string().min(1) }),
  fields: [
    { name: 'vgWidth', label: 'Wall Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'vgHeight', label: 'Wall Height (ft)', type: 'number', min: 1, step: '1' },
    { name: 'vgPocketSpacing', label: 'Pocket Spacing (in)', type: 'number', min: 4, step: '2' },
    { name: 'vgPlantType', label: 'Plant Type', type: 'select', options: [{ label: 'Succulents (low water)', value: 'succulent' }, { label: 'Herbs (kitchen)', value: 'herb' }, { label: 'Ferns/Shade Plants', value: 'fern' }, { label: 'Flowering Annuals', value: 'flower' }] },
  ],
  defaults: { vgWidth: '4', vgHeight: '6', vgPocketSpacing: '8', vgPlantType: 'herb' },
  presets: [
    { label: 'Small Kitchen Herb Wall', values: { vgWidth: '3', vgHeight: '4', vgPocketSpacing: '6', vgPlantType: 'herb' } },
    { label: 'Living Room Succulent Art', values: { vgWidth: '5', vgHeight: '5', vgPocketSpacing: '10', vgPlantType: 'succulent' } },
    { label: 'Balcony Fern Privacy Screen', values: { vgWidth: '6', vgHeight: '7', vgPocketSpacing: '8', vgPlantType: 'fern' } },
  ],
  compute: (v) => {
    const pocketsHorizontal = Math.floor((v.vgWidth * 12) / v.vgPocketSpacing)
    const pocketsVertical = Math.floor((v.vgHeight * 12) / v.vgPocketSpacing)
    const totalPockets = pocketsHorizontal * pocketsVertical
    const waterNeeds: Record<string, number> = { succulent: 0.5, herb: 1, fern: 1.5, flower: 1 }
    const waterFactor = waterNeeds[v.vgPlantType] || 1
    const dailyWaterL = totalPockets * waterFactor * 0.05
    const weeklyWaterL = dailyWaterL * 7
    const monthlyWaterL = dailyWaterL * 30
    return { result: totalPockets, label: 'Total Plants/Pockets', unit: '', steps: [{ label: 'Wall Area', value: `${v.vgWidth} × ${v.vgHeight} ft = ${(v.vgWidth * v.vgHeight).toFixed(0)} sq ft` }, { label: 'Pockets Horizontally', value: `floor(${v.vgWidth} × 12 ÷ ${v.vgPocketSpacing}) = ${pocketsHorizontal}` }, { label: 'Pockets Vertically', value: `floor(${v.vgHeight} × 12 ÷ ${v.vgPocketSpacing}) = ${pocketsVertical}` }, { label: 'Total Pockets', value: `${pocketsHorizontal} × ${pocketsVertical} = ${totalPockets}` }, { label: 'Plant Density', value: `${totalPockets} plants on ${(v.vgWidth * v.vgHeight).toFixed(0)} sq ft = ${(totalPockets / (v.vgWidth * v.vgHeight)).toFixed(1)} plants/sq ft` }, { label: `Daily Water (${v.vgPlantType}, factor ${waterFactor})`, value: `${totalPockets} × ${waterFactor} × 0.05 L = ${dailyWaterL.toFixed(1)} L` }, { label: 'Weekly Water Need', value: `${weeklyWaterL.toFixed(1)} L` }, { label: 'Monthly Water Need', value: `${monthlyWaterL.toFixed(1)} L` }] ,
    extras: [
      { label: 'Plant Spacing Guidelines', value: 'Succulents: 8-12 in spacing (thrive closer). Herbs: 6-8 in (basil, mint, oregano). Ferns: 10-14 in (fronds spread wide). Flowers: 8-10 in. Too-tight spacing causes competition for water and nutrients. Too-wide spacing leaves bare wall visible.' },
      { label: 'Weight & Structural Load', value: 'A 4×6 ft vertical garden with soil and plants weighs 200-400 lb (50-100 lb per sq ft of wall). Ensure wall can support the weight — mounting to studs or concrete is essential. For balconies, check weight restrictions. Use lightweight growing medium (coconut coir, perlite mix).' },
      { label: 'Irrigation System Options', value: 'Drip irrigation is recommended for vertical gardens — overhead watering causes runoff. Drip line with 0.5 GPH emitters per pocket. Timer: water 5-10 min daily (adjust for season). Self-watering systems with reservoir reduce maintenance to weekly refills.' },
      { label: 'Sunlight Requirements', value: 'Succulents: 4-6 hrs direct sun (south-facing). Herbs: 4-6 hrs (basil 6+, mint 3-4). Ferns: indirect light (north-facing or shaded). Flowers: vary — petunias 6 hrs sun, impatiens shade. Match plant selection to wall orientation for success.' },
      { label: 'Seasonal Maintenance', value: 'Spring: fertilize monthly, increase water. Summer: monitor daily for pests, water may need 2×/day in heat. Fall: reduce water, trim dead growth. Winter: protect from frost or move indoors. Succulents need winter rest (less water, cooler temps).' },
      { label: 'Air Quality Benefits', value: 'Vertical gardens improve indoor air quality by filtering VOCs (benzene, formaldehyde, xylene). One 4×6 ft green wall filters ~50 sq ft of air per hour. Plants also increase humidity by 5-10% in dry indoor environments, reducing respiratory issues.' },
      { label: 'Cost to Build', value: 'DIY felt pocket system: $5-10/sq ft. Modular panel system: $15-30/sq ft. Custom installed: $30-75/sq ft. Plants: $3-10 each. Irrigation system: $50-150. Total for 4×6 ft DIY wall: $150-300. Payback in herbs alone: $50-100/year in grocery savings on herbs.' },
    ]}
  },
  description: 'Plan a vertical garden wall with precise pocket layout, plant density calculations, and daily/weekly water requirements based on wall dimensions, spacing, and plant type. Covers succulents, herbs, ferns, and flowering annuals.',
  formula: 'PocketsHorizontal = floor(WallWidth_ft × 12 ÷ Spacing_in). PocketsVertical = floor(WallHeight_ft × 12 ÷ Spacing_in). TotalPockets = Horizontal × Vertical. DailyWater_L = TotalPockets × PlantFactor × 0.05. Plant water factors: Succulent 0.5, Herb 1.0, Fern 1.5, Flower 1.0.',
  interpretation: 'A 4×6 ft wall with 8 in spacing holds 6 plants horizontally (48 ÷ 8) × 9 vertically (72 ÷ 8) = 54 plants total at 2.25 plants/sq ft. With herbs (factor 1.0), daily water = 54 × 1.0 × 0.05 = 2.7 L/day, 18.9 L/week. The same wall with 6 in spacing holds 8 × 12 = 96 plants — nearly double the density. Wider spacing (10-12 in) creates a more open, modern look with fewer plants (30-40 for this wall size). Choose spacing based on plant type: succulents look best with wider spacing, herbs benefit from tighter spacing for fuller harvest.'
}

export default calcDef
