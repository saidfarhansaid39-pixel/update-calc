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
  compute: (v) => {
    const areaSqIn = v.tile2AreaLength * 12 * v.tile2AreaWidth * 12
    const tileSqIn = v.tile2TileLength * v.tile2TileWidth
    const tilesNeeded = Math.ceil(areaSqIn / tileSqIn)
    const waste = Math.ceil(tilesNeeded * (v.tile2WastePct / 100))
    const totalTiles = tilesNeeded + waste
    const totalCost = totalTiles * v.tile2PricePerTile
    const sqft = v.tile2AreaLength * v.tile2AreaWidth
    const costPerSqft = sqft > 0 ? totalCost / sqft : 0
    return { result: totalTiles, label: 'Total Tiles Needed', unit: 'tiles', steps: [{ label: 'Area', value: sqft.toFixed(1) + ' sq ft' }, { label: 'Tile Size', value: v.tile2TileLength + 'x' + v.tile2TileWidth + ' in' }, { label: 'Tiles (base)', value: '' + tilesNeeded }, { label: 'Waste', value: '+' + waste + ' (' + v.tile2WastePct + '%)' }, { label: 'Total Tiles', value: '' + totalTiles }, { label: 'Total Cost', value: '$' + totalCost.toFixed(2) }] }
  },
  description: 'Calculate tiles needed for any area including waste factor. Supports any tile size and provides total material cost.',
  formula: 'Tiles = ceil(AreaSqIn / TileSqIn) + Waste | Cost = TotalTiles x Price/Tile | Common waste: 10% straight, 15% diagonal',
  interpretation: 'Standard tiles: 12x12 in (1 sq ft), 6x24 in (1 sq ft), 18x18 in (2.25 sq ft). Add 10% for straight layouts, 15% for diagonal. Buy extra boxes for future repairs - store unopened for returns.'
}

export default calcDef
