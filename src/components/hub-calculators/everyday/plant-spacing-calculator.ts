import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), spacing: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rows: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'length', label: 'Bed Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Bed Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'spacing', label: 'Plant Spacing (ft)', type: 'number', min: 0.25, step: '0.25' },
    { name: 'rows', label: 'Number of Rows', type: 'number', min: 1, step: '1' },
  ],
  defaults: { length: '8', width: '4', spacing: '1.5', rows: '3' },
  presets: [
    { label: 'Tomato Bed (4×8 ft)', values: { length: '8', width: '4', spacing: '2', rows: '2' } },
    { label: 'Lettuce Row (3×6 ft)', values: { length: '6', width: '3', spacing: '1', rows: '3' } },
    { label: 'Carrot Bed (4×4 ft)', values: { length: '4', width: '4', spacing: '0.33', rows: '12' } },
    { label: 'Flower Border (2×10 ft)', values: { length: '10', width: '2', spacing: '1.5', rows: '1' } },
  ],
  compute: (v) => {
    const plantsPerRow = Math.floor(v.length / v.spacing) + 1
    const totalPlants = plantsPerRow * v.rows
    const area = v.length * v.width
    const perSqFt = totalPlants / area
    const spacingInches = v.spacing * 12
    return { result: totalPlants, label: 'Total Plants Needed', unit: '',
      steps: [
        { label: 'Bed Area', value: `${v.length} ft × ${v.width} ft = ${area} ft²` },
        { label: 'Plant Spacing', value: `${v.spacing} ft (${spacingInches.toFixed(0)} in) apart` },
        { label: 'Plants per Row', value: `Floor(${v.length} ÷ ${v.spacing}) + 1 = ${plantsPerRow}` },
        { label: 'Number of Rows', value: `${v.rows} row(s)` },
        { label: 'Total Plants', value: `${plantsPerRow} × ${v.rows} = ${totalPlants}` },
        { label: 'Plant Density', value: `${totalPlants} ÷ ${area} ft² = ${perSqFt.toFixed(2)} plants/ft²` },
        { label: 'Soil Needed (cubic ft)', value: `${(area * 0.5).toFixed(1)} ft³ (at 6" depth)` },
        { label: 'Seed Packets Required', value: `≈ ${Math.ceil(totalPlants / 50)} packet(s) (50 seeds avg)` },
      ],
      extras: [
        { label: '🥕 Spacing Guide by Vegetable', value: 'Tomatoes/Peppers: 18-24". Lettuce: 8-12". Carrots/Onions: 3-4". Cucumbers: 12-18". Corn: 8-12". Potatoes: 12-15". Squash/Zucchini: 24-36".' },
        { label: '🌿 Square Foot Gardening', value: 'Mel Bartholomew\'s method divides beds into 1-ft² grid sections. Plant 1 tomato, 4 lettuce, 9 spinach, or 16 carrots per square foot. Maximizes yield in small spaces.' },
        { label: '☀️ Sunlight Requirements', value: 'Most vegetables need 6-8 hours of direct sun. Leafy greens tolerate partial shade (4-6 hrs). Root vegetables need 6+ hrs. Fruiting plants (tomatoes, peppers) need 8+ hrs.' },
        { label: '💧 Water Access Planning', value: 'Place beds within reach of a hose (max 50 ft). Drip irrigation reduces water use by 30-50% compared to overhead watering. Group plants with similar water needs together.' },
        { label: '🌱 Companion Planting', value: 'Plant basil near tomatoes (improves flavor, repels pests). Marigolds near most vegetables (repels nematodes). Avoid planting fennel near most other vegetables.' },
        { label: '🔄 Crop Rotation Importance', value: 'Don\'t grow the same plant family in the same bed 2 years in a row. Rotate between: leafy (lettuce), fruiting (tomato), root (carrot), legume (beans). Prevents soil depletion and disease.' },
        { label: '📏 Row Orientation', value: 'Run rows north-south for even sun exposure. East-west rows create shading — the taller plants shade shorter ones. Adjust spacing accordingly if your garden has partial shade.' },
        { label: '🛠️ Raised Bed Depth', value: 'Minimum 6" for shallow-rooted greens, 12" for most vegetables, 18" for deep-rooted tomatoes and carrots. The dimensions in this calculator assume a standard flat bed layout.' },
      ]
    }
  },
  description: 'Calculate exactly how many plants fit in your garden bed based on bed dimensions and desired plant spacing. Includes plant density, seed packet estimates, soil volume, and spacing recommendations.',
  formula: 'Plants per Row = Floor(Length ÷ Spacing) + 1 | Total Plants = Plants per Row × Rows | Density = Total Plants ÷ (Length × Width) | Soil Volume = Area × Depth (default 6")',
  interpretation: 'Proper spacing is critical for plant health — too close causes competition for water/nutrients, too far wastes valuable garden space. Wide spacing (18-36") for large plants like tomatoes, peppers, and squash. Medium spacing (8-12") for lettuce, spinach, and flowers. Tight spacing (3-6") for carrots, onions, and radishes. The square foot gardening method is an excellent alternative for small spaces, planting by a grid system rather than traditional rows.'
}

export default calcDef
