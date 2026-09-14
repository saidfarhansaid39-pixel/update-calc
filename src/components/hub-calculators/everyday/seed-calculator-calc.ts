import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bedLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bedWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), spacingInches: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), seedsPerCell: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'bedLength', label: 'Bed Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'bedWidth', label: 'Bed Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'spacingInches', label: 'Spacing Between Plants (in)', type: 'number', min: 1, step: '1' },
    { name: 'seedsPerCell', label: 'Seeds per Planting Spot', type: 'number', min: 1, step: '1' },
  ],
  defaults: { bedLength: '8', bedWidth: '4', spacingInches: '6', seedsPerCell: '2' },
  presets: [
    { label: 'Raised Bed (lettuce)', values: { bedLength: '8', bedWidth: '4', spacingInches: '12', seedsPerCell: '2' } },
    { label: 'Raised Bed (carrots)', values: { bedLength: '8', bedWidth: '4', spacingInches: '2', seedsPerCell: '3' } },
    { label: 'In-Ground Row (beans)', values: { bedLength: '20', bedWidth: '3', spacingInches: '4', seedsPerCell: '2' } },
    { label: 'Raised Bed (tomatoes)', values: { bedLength: '8', bedWidth: '4', spacingInches: '24', seedsPerCell: '1' } },
  ],
  compute: (v) => {
    const spacingFt = v.spacingInches / 12
    const plantsPerRow = Math.floor(v.bedLength / spacingFt) + 1
    const rows = Math.floor(v.bedWidth / spacingFt) + 1
    const totalPlants = plantsPerRow * rows
    const totalSeeds = totalPlants * v.seedsPerCell
    return { result: totalSeeds, label: 'Total Seeds Needed', unit: '', steps: [{ label: 'Plants per Row', value: `${plantsPerRow}` }, { label: 'Number of Rows', value: `${rows}` }, { label: 'Total Plants', value: `${totalPlants}` }, { label: 'Total Seeds', value: `${totalSeeds} (${v.seedsPerCell} seeds/spot)` }] ,
    extras: [
      { label: 'Thinning Guide', value: 'Plant 2-3 seeds per spot, keep the strongest seedling after true leaves appear. Expected loss rate: 10-30% germination failure — plant extra to compensate' },
      { label: 'Seed Viability by Crop', value: 'Onion/parsley: 1-2 years. Corn/pepper: 2 years. Tomato/bean/pea: 3-4 years. Cucumber/melon: 5 years. Store seeds in cool, dark, dry place (refrigerator works well)' },
      { label: 'Spacing by Crop Type', value: 'Large: tomatoes 18-24 in, peppers 12-18 in, cabbage 12-18 in. Medium: lettuce 8-12 in, beans 3-4 in, spinach 4-6 in. Small: carrots 2-3 in, radishes 1-2 in, beets 3-4 in' },
      { label: 'Square Foot Planting', value: 'For raised beds: divide into 1 ft squares. Per square: 16 carrots, 9 beets/onions, 4 lettuce/peppers, 1 tomato/cabbage. Adjust spacing per square' },
      { label: 'Seed Depth Rule', value: 'General rule: plant seeds at depth = 2× seed diameter. Fine seeds (carrots, lettuce): surface sow or barely cover. Large seeds (beans, squash): 1 in deep' },
      { label: 'Succession Planting', value: 'Stagger plantings 2-3 weeks apart for continuous harvest. Calculate seeds for each succession. Carrots: 3 successions = 3× the seeds for same bed area' },
      { label: 'Germination Temperature', value: 'Warm season (tomatoes, peppers, squash): soil temp 70-85°F, germinate 5-14 days. Cool season (lettuce, peas, carrots): 50-65°F, germinate 5-21 days. Use soil thermometer for accuracy' },
    ]}
  },
  description: 'Calculate the exact number of seeds needed for your garden bed based on bed dimensions, spacing between plants, and seeds planted per spot.',
  formula: 'PlantsPerRow = Floor(BedLength(ft) ÷ Spacing(ft)) + 1. Rows = Floor(BedWidth(ft) ÷ Spacing(ft)) + 1. TotalPlants = PlantsPerRow × Rows. TotalSeeds = TotalPlants × SeedsPerSpot. Spacing(ft) = Spacing(in) ÷ 12.',
  interpretation: 'An 8×4 ft raised bed with 6 in spacing and 2 seeds per spot needs: 17 plants per row (8 ft ÷ 0.5 ft + 1), 9 rows (4 ft ÷ 0.5 ft + 1), 153 total plants, and 306 seeds. Plant 2-3 seeds per spot to account for germination failure (typically 10-30% loss under ideal conditions). Thin to the strongest seedling after true leaves appear. Spacing varies dramatically by crop: tomatoes at 24 in need only 20 seeds for a full 8×4 ft bed, while carrots at 2 in spacing need 1,275+ seeds. Always buy extra seeds — they remain viable for 2-5 years when stored properly in cool, dark conditions.'
}

export default calcDef
