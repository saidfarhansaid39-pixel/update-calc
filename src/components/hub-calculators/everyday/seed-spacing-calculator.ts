import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ gardenLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gardenWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rowSpacing: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), plantSpacing: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'gardenLength', label: 'Garden Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'gardenWidth', label: 'Garden Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'rowSpacing', label: 'Row Spacing (in)', type: 'number', min: 1, step: '6' },
    { name: 'plantSpacing', label: 'Plant Spacing (in)', type: 'number', min: 1, step: '2' },
  ],
  defaults: { gardenLength: '20', gardenWidth: '8', rowSpacing: '24', plantSpacing: '12' },
  presets: [
    { label: 'Tomatoes (staked)', values: { gardenLength: '20', gardenWidth: '8', rowSpacing: '36', plantSpacing: '18' } },
    { label: 'Carrots & Beets', values: { gardenLength: '20', gardenWidth: '8', rowSpacing: '12', plantSpacing: '3' } },
    { label: 'Square Foot Garden', values: { gardenLength: '8', gardenWidth: '4', rowSpacing: '12', plantSpacing: '12' } },
    { label: 'Corn (block method)', values: { gardenLength: '20', gardenWidth: '10', rowSpacing: '30', plantSpacing: '10' } },
  ],
  compute: (v) => {
    const rowSpacingFt = v.rowSpacing / 12
    const plantSpacingFt = v.plantSpacing / 12
    const rows = Math.floor(v.gardenWidth / rowSpacingFt)
    const plantsPerRow = Math.floor(v.gardenLength / plantSpacingFt)
    const totalPlants = rows * plantsPerRow
    const sqftPerPlant = rowSpacingFt * plantSpacingFt
    return { result: totalPlants, label: 'Total Plants', unit: '', steps: [{ label: 'Rows (width/row spacing)', value: `${rows} rows` }, { label: 'Plants per Row', value: `${plantsPerRow}` }, { label: 'Total Plants', value: `${totalPlants}` }, { label: 'Space per Plant', value: `${sqftPerPlant.toFixed(2)} sq ft` }] ,
    extras: [
      { label: 'Crop Spacing Quick Reference', value: 'Tomatoes: 18-24 in apart, 36-48 in rows. Peppers: 12-18 in, 24-36 in rows. Lettuce: 8-12 in, 12-18 in rows. Carrots: 2-3 in, 12-18 in rows. Corn: 8-12 in, 30-36 in rows' },
      { label: 'Square Foot Gardening Method', value: 'Divide garden into 1 ft × 1 ft squares. Per square: 16 small (carrots), 9 medium (beets), 4 large (lettuce), 1 extra-large (tomato/cabbage). Uses 100% of space efficiently' },
      { label: 'Row Orientation', value: 'Run rows north-south for maximum sun exposure. East-west rows shade each other. In hot climates, east-west provides some afternoon shade to plants' },
      { label: 'Companion Planting', value: 'Plant basil near tomatoes (repels pests). Carrots near onions (both repel each other\'s pests). Avoid planting fennel near most vegetables. Corn, beans, squash = Three Sisters guild' },
      { label: 'Succession Planting', value: 'After harvesting early crops (lettuce, peas, radishes), plant warm-season crops or fall vegetables in the same space. Maximizes yield from the same garden bed' },
      { label: 'Air Circulation Importance', value: 'Wider row spacing (36+ in for large crops) improves air circulation and reduces fungal diseases by 40-60%. Powdery mildew and blight thrive in crowded, humid conditions' },
      { label: 'Trellising to Save Space', value: 'Vertical trellising for cucumbers, pole beans, tomatoes, and melons reduces row spacing by 50-70% and increases yield per sq ft by 2-3x compared to bush varieties' },
    ]}
  },
  description: 'Calculate how many plants fit in your garden based on bed dimensions, row spacing, and in-row plant spacing. Optimize garden layout for maximum yield.',
  formula: 'Rows = Floor(GardenWidth(ft) ÷ RowSpacing(ft)). PlantsPerRow = Floor(GardenLength(ft) ÷ PlantSpacing(ft)). TotalPlants = Rows × PlantsPerRow. Convert spacing from inches to feet: ÷ 12.',
  interpretation: 'A 20×8 ft garden with 24 in row spacing and 12 in plant spacing accommodates 4 rows with 20 plants per row = 80 total plants at 2 sq ft per plant. Adjust spacing based on mature plant size, not seedling size. Wider spacing (36 in rows for tomatoes) improves air circulation and reduces fungal disease by 40-60%. Square foot gardening maximizes small spaces: an 8×4 ft bed with 12 in spacing holds 32 plants. Vertical trellising can double or triple effective planting density. Use succession planting to maximize yield — plant fast-growing crops (radishes, lettuce) between slower ones.'
}

export default calcDef
