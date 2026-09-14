import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ shedLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), shedWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wallHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), shelvingPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), hangingPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'shedLength', label: 'Shed Length (ft)', type: 'number', min: 4, step: '1' },
    { name: 'shedWidth', label: 'Shed Width (ft)', type: 'number', min: 4, step: '1' },
    { name: 'wallHeight', label: 'Wall Height (ft)', type: 'number', min: 4, step: '1' },
    { name: 'shelvingPct', label: 'Wall % for Shelving', type: 'number', min: 0, max: 80, step: '10' },
    { name: 'hangingPct', label: 'Wall % for Hanging Tools', type: 'number', min: 0, max: 80, step: '10' },
  ],
  defaults: { shedLength: '10', shedWidth: '8', wallHeight: '7', shelvingPct: '30', hangingPct: '30' },
  presets: [
    { label: 'Basic Garden Shed', values: { shedLength: '8', shedWidth: '6', wallHeight: '7', shelvingPct: '20', hangingPct: '40' } },
    { label: 'Workshop Shed', values: { shedLength: '12', shedWidth: '10', wallHeight: '8', shelvingPct: '40', hangingPct: '40' } },
    { label: 'Tool & Equipment', values: { shedLength: '10', shedWidth: '8', wallHeight: '7', shelvingPct: '30', hangingPct: '50' } },
    { label: 'Multi-Purpose Storage', values: { shedLength: '14', shedWidth: '12', wallHeight: '8', shelvingPct: '35', hangingPct: '25' } },
  ],
  compute: (v) => {
    const floorArea = v.shedLength * v.shedWidth
    const wallPerimeter = 2 * (v.shedLength + v.shedWidth)
    const wallArea = wallPerimeter * v.wallHeight
    const shelfArea = wallArea * (v.shelvingPct / 100)
    const hangingArea = wallArea * (v.hangingPct / 100)
    const storageSqFt = floorArea * 2 + shelfArea * 0.5 + hangingArea * 0.3
    return { result: storageSqFt, label: 'Effective Storage Space', unit: 'sq ft', steps: [{ label: 'Floor Area', value: `${floorArea} sq ft` }, { label: 'Wall Area', value: `${wallArea} sq ft` }, { label: 'Shelving Space', value: `${shelfArea.toFixed(1)} sq ft` }, { label: 'Hanging Tool Wall', value: `${hangingArea.toFixed(1)} sq ft` }, { label: 'Effective Storage', value: `${storageSqFt.toFixed(0)} sq ft` }] ,
    extras: [
      { label: 'Vertical Space Multiplier', value: 'An 8×10 ft shed with 7 ft walls has 80 sq ft floor + 252 sq ft wall space = 332 sq ft total surface area for organization' },
      { label: 'Ceiling Rack Storage', value: 'Install ceiling-mounted racks or loft for 30-50% more storage. Ideal for seasonal items, camping gear, and holiday decorations — items used 1-4x/year' },
      { label: 'Pegboard Efficiency', value: 'A single 4×8 ft pegboard holds $500+ worth of tools in 32 sq ft of wall space. Use pegboard for tools you access weekly. Combine with hooks, baskets, and shelves' },
      { label: 'Tool Storage by Frequency', value: 'Daily use: floor zone near door. Weekly use: pegboard/shelving at eye level (3-5 ft). Monthly/seasonal: upper shelves (5-7 ft) and ceiling racks' },
      { label: 'Walking Path Requirement', value: 'Maintain minimum 2 ft walking path — a 10×8 ft shed with a 2 ft path around reduces usable floor by ~30%. Plan layout before installing shelves' },
      { label: 'Moisture Protection', value: 'Sheds need ventilation (vents/eaves) and a 4-6 mil vapor barrier under floor. Store items off floor on pallets/shelves — prevents rust and rot' },
      { label: 'Weight Distribution', value: 'Heaviest items (lawn mower, snow blower) at floor level. Medium (power tools, paint) on lower shelves 1-3 ft. Light items (seasonal decor, garden supplies) on upper shelves' },
    ]}
  },
  description: 'Calculate effective storage capacity for your shed by analyzing floor area, wall shelving, hanging tool walls, and vertical stacking potential.',
  formula: 'EffectiveStorageSqFt = FloorArea × 2 (double-stack) + (WallArea × Shelving%) × 0.5 + (WallArea × Hanging%) × 0.3. WallPerimeter = 2 × (Length + Width). WallArea = Perimeter × Height.',
  interpretation: 'An 8×10 ft shed (80 sq ft floor) with 30% shelving and 30% hanging wall space effectively stores ~240 sq ft worth of items through vertical optimization. Floor storage (double-stacked) provides the bulk of accessible space. Wall shelving efficiently stores lighter items at 50% effective density due to shelf depth limitations. Hanging pegboards are the most accessible tool storage at 30% density but with the fastest retrieval. Maximize space by: (1) using ceiling racks for seasonal items, (2) storing by frequency of use, (3) leaving a 2 ft walking path, and (4) using uniform storage bins for stackability.'
}

export default calcDef
