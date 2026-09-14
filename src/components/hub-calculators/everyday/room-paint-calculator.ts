import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ roomWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roomLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roomHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), coats: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), paintCostPerGal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'roomWidth', label: 'Room Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'roomLength', label: 'Room Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'roomHeight', label: 'Room Height (ft)', type: 'number', min: 4, step: '1' },
    { name: 'coats', label: 'Number of Coats', type: 'number', min: 1, max: 4, step: '1' },
    { name: 'paintCostPerGal', label: 'Paint Cost per Gallon ($)', type: 'number', min: 10, step: '10' },
  ],
  defaults: { roomWidth: '12', roomLength: '14', roomHeight: '9', coats: '2', paintCostPerGal: '40' },
  presets: [
    { label: 'Master Bedroom', values: { roomWidth: '14', roomLength: '16', roomHeight: '9', coats: '2', paintCostPerGal: '45' } },
    { label: 'Living Room', values: { roomWidth: '20', roomLength: '15', roomHeight: '10', coats: '2', paintCostPerGal: '50' } },
    { label: 'Small Bathroom', values: { roomWidth: '5', roomLength: '8', roomHeight: '8', coats: '2', paintCostPerGal: '35' } },
    { label: 'Accent Wall Only', values: { roomWidth: '12', roomLength: '14', roomHeight: '9', coats: '2', paintCostPerGal: '40' } },
  ],
  compute: (v) => {
    const wallArea = 2 * (v.roomWidth + v.roomLength) * v.roomHeight
    const ceilingArea = v.roomWidth * v.roomLength
    const totalArea = wallArea + ceilingArea
    const adjustedArea = totalArea * v.coats
    const gallons = Math.ceil(adjustedArea / 350)
    const paintCost = gallons * v.paintCostPerGal
    return { result: gallons, label: 'Paint Needed', unit: 'gal', steps: [{ label: 'Wall Area', value: `${wallArea.toFixed(0)} sq ft` }, { label: 'Ceiling Area', value: `${ceilingArea.toFixed(0)} sq ft` }, { label: 'Total (×${v.coats} coats)', value: `${adjustedArea.toFixed(0)} sq ft` }, { label: 'Gallons Needed', value: `${gallons} gal (covers 350 sq ft/gal)` }, { label: 'Paint Cost', value: `$${paintCost.toFixed(2)}` }] ,
    extras: [
      { label: 'Coverage Basics', value: '1 gallon covers ~350-400 sq ft for smooth surfaces. Flat/matte: best coverage. Eggshell/satin: slightly less. Semi-gloss/gloss: least coverage. Textured surfaces need 10-20% more' },
      { label: 'Window & Door Deduction', value: 'For most rooms, subtract ~15 sq ft per window and ~20 sq ft per door from wall area. Typical room with 2 windows and 1 door: subtract 50 sq ft from total wall area' },
      { label: 'Primer Requirements', value: 'Use primer if: painting over dark colors, new drywall/plaster, patched walls, or painting wood/laminate. One gallon of primer covers ~300 sq ft. Tinted primer improves topcoat coverage' },
      { label: 'Color Change Impact', value: 'Going from dark to light: 3-4 coats may be needed. White to light color: 2 coats standard. Same color touch-up: 1 coat. Dark colors (red, navy, deep green) often need 3+ coats for even coverage' },
      { label: 'Paint Quality vs Cost', value: 'Budget paint ($15-25/gal): thin, needs 3+ coats, less durable. Mid-range ($35-50/gal): sweet spot, 2 coat coverage, good durability. Premium ($55-70/gal): best coverage, 1-2 coats, stain resistant' },
      { label: 'Professional Cost Estimate', value: 'Pro painters charge $1.50-4.00/sq ft of wall area (labor + materials). For a 12×14 ft room with 9 ft ceilings: walls + ceiling = 624 sq ft. Pro cost: $936-2,496. DIY paint cost: $40-160 for 2-4 gallons' },
      { label: 'Paint Type Selection Guide', value: 'Ceiling: flat white (hides imperfections). Walls: eggshell/satin (washable, slight sheen). Trim: semi-gloss (durable, easy to clean). Bathroom/kitchen: satin/semi-gloss (moisture resistant, mildew resistant)' },
    ]}
  },
  description: 'Calculate the exact amount of paint needed for walls and ceiling, including gallons required and total paint cost for any number of coats.',
  formula: 'WallArea(sq ft) = 2 × (Width + Length) × Height. CeilingArea = Width × Length. TotalArea = WallArea + CeilingArea. Gallons = Ceil(TotalArea × Coats ÷ 350sqft/gal). PaintCost = Gallons × PricePerGallon.',
  interpretation: 'A 12×14 ft room with 9 ft ceilings needs: walls = 468 sq ft, ceiling = 168 sq ft, total = 636 sq ft. With 2 coats: 1,272 sq ft covered = 4 gallons (1,400 sq ft coverage) at a cost of $160 ($40/gal). For this room — buy 2 gallons for walls (covers ~700-800 sq ft per coat) and 1 gallon for ceiling. Subtract ~50 sq ft for windows and doors. Paint coverage varies by texture: smooth walls cover 400 sq ft/gal, textured covers 250-350 sq ft/gal. Darker colors and drastic color changes require additional coats. Always buy paint from the same batch (same store visit) to avoid color variation.'
}

export default calcDef
