import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tile2AreaLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tile2AreaWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tile2TileLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tile2TileWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tile2WastePct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tile2PricePerTile: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'tile2AreaLength', label: 'Area Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'tile2AreaWidth', label: 'Area Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'tile2TileLength', label: 'Tile Length (in)', type: 'number', min: 1, step: '2' },
    { name: 'tile2TileWidth', label: 'Tile Width (in)', type: 'number', min: 1, step: '2' },
    { name: 'tile2WastePct', label: 'Waste Factor (%)', type: 'number', min: 0, max: 30, step: '5' },
    { name: 'tile2PricePerTile', label: 'Price per Tile ($)', type: 'number', min: 0, step: '1' },
  ],
  defaults: { tile2AreaLength: '10', tile2AreaWidth: '12', tile2TileLength: '12', tile2TileWidth: '12', tile2WastePct: '10', tile2PricePerTile: '3' },
  presets: [
    { label: 'Small Bathroom (5×7 ft)', values: { tile2AreaLength: '5', tile2AreaWidth: '7', tile2TileLength: '12', tile2TileWidth: '12', tile2WastePct: '10', tile2PricePerTile: '2.50' } },
    { label: 'Kitchen Backsplash (12×2 ft)', values: { tile2AreaLength: '12', tile2AreaWidth: '2', tile2TileLength: '3', tile2TileWidth: '6', tile2WastePct: '15', tile2PricePerTile: '1.50' } },
    { label: 'Living Room (14×18 ft)', values: { tile2AreaLength: '14', tile2AreaWidth: '18', tile2TileLength: '18', tile2TileWidth: '18', tile2WastePct: '10', tile2PricePerTile: '4.50' } },
    { label: 'Hallway (20×3 ft)', values: { tile2AreaLength: '20', tile2AreaWidth: '3', tile2TileLength: '6', tile2TileWidth: '24', tile2WastePct: '15', tile2PricePerTile: '3.25' } },
  ],
  compute: (v) => {
    const areaSqIn = v.tile2AreaLength * 12 * v.tile2AreaWidth * 12
    const tileSqIn = v.tile2TileLength * v.tile2TileWidth
    const tilesNeeded = Math.ceil(areaSqIn / tileSqIn)
    const waste = Math.ceil(tilesNeeded * (v.tile2WastePct / 100))
    const totalTiles = tilesNeeded + waste
    const totalCost = totalTiles * v.tile2PricePerTile
    const sqft = v.tile2AreaLength * v.tile2AreaWidth
    const costPerSqft = sqft > 0 ? totalCost / sqft : 0
    return { result: totalTiles, label: 'Total Tiles Needed', unit: 'tiles', steps: [
      { label: 'Formula', value: 'Tiles Needed = ceil(Area sq in ÷ Tile sq in) + Waste%' },
      { label: 'Room Area', value: v.tile2AreaLength + ' × ' + v.tile2AreaWidth + ' ft = ' + sqft.toFixed(1) + ' sq ft (' + areaSqIn.toFixed(0) + ' sq in)' },
      { label: 'Tile Size', value: v.tile2TileLength + ' × ' + v.tile2TileWidth + ' in = ' + tileSqIn + ' sq in per tile' },
      { label: 'Tiles (base)', value: '' + tilesNeeded + ' tiles to cover area' },
      { label: 'Waste Factor', value: '+' + waste + ' tiles (' + v.tile2WastePct + '%)' },
      { label: 'Total Tiles to Buy', value: '' + totalTiles },
      { label: 'Total Cost', value: totalTiles + ' × $' + v.tile2PricePerTile.toFixed(2) + ' = $' + totalCost.toFixed(2) },
      { label: 'Cost per Sq Ft', value: '$' + costPerSqft.toFixed(2) + '/sq ft' },
    ] ,
    extras: [
      { label: 'Waste Guidelines', value: 'Straight lay (grid pattern): 10% waste. Diagonal/45°: 15% waste. Herringbone: 15-20%. Patterned layouts need more' },
      { label: 'Box Coverage', value: 'Tiles usually come in boxes covering 10-15 sq ft. A 12×12 in tile box of 10 tiles covers ~10 sq ft. Buy full boxes only' },
      { label: 'Returns Policy', value: 'Most home improvement stores accept unopened boxes for return within 90 days. Keep receipts and do not open boxes you might return' },
      { label: 'Extra for Repairs', value: 'Store 5-10 extra tiles for future repairs. Tile dyes/finishes vary by dye lot — matching years later is nearly impossible' },
      { label: 'Grout Factor', value: 'Grout adds ~$1-2/sq ft for materials. Wider grout lines use more grout but are more forgiving of imperfect tile cuts' },
      { label: 'Subfloor Prep', value: 'Factor $0.50-1.00/sq ft for cement backer board or uncoupling membrane. Never tile directly on wood subfloor' },
      { label: 'Layout Planning', value: 'Start tile layout from the center of the room, not the wall. Avoid thin slivers of tile at edges — adjust layout to balance cuts' },
      { label: 'Tile Cutting', value: 'Porcelain/ceramic: wet saw ($50-100 rental) or manual snap cutter ($20-40). Natural stone: diamond blade wet saw required' },
    ]}
  },
  description: 'Calculate the exact number of tiles needed for flooring, backsplash, or wall projects including waste factor. Supports any tile size and provides total material cost and cost per square foot.',
  formula: 'Tiles Needed = ceil((Area Length × 12 × Area Width × 12) ÷ (Tile Length × Tile Width)) × (1 + Waste%). Total Cost = Total Tiles × Price Per Tile. Cost per sq ft = Total Cost ÷ (Length × Width).',
  interpretation: 'For a 10×12 ft room (120 sq ft) with 12×12 in tiles, you need 120 tiles + 10% waste (12) = 132 tiles total. At $3/tile, total cost is $396 ($3.30/sq ft). Add 10% for straight layouts, 15% for diagonal or patterned installations. Always buy all tiles from the same dye lot to ensure color consistency.'
}

export default calcDef
