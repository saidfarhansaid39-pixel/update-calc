import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tcc2RoomLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tcc2RoomWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tcc2TileSize: z.string().min(1), tcc2WastePct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tcc2PricePerBox: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tcc2TilesPerBox: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'tcc2RoomLength', label: 'Room Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'tcc2RoomWidth', label: 'Room Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'tcc2TileSize', label: 'Tile Size', type: 'select', options: [{ label: '12x12 in (1 sq ft)', value: '12x12' }, { label: '12x24 in (2 sq ft)', value: '12x24' }, { label: '18x18 in (2.25 sq ft)', value: '18x18' }, { label: '24x24 in (4 sq ft)', value: '24x24' }] },
    { name: 'tcc2WastePct', label: 'Waste Factor (%)', type: 'number', min: 0, max: 30, step: '5' },
    { name: 'tcc2PricePerBox', label: 'Price per Box ($)', type: 'number', min: 0, step: '10' },
    { name: 'tcc2TilesPerBox', label: 'Tiles per Box', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const tileSizes: Record<string, number> = { '12x12': 1, '12x24': 2, '18x18': 2.25, '24x24': 4 }
    const tileSqFt = tileSizes[v.tcc2TileSize] || 1
    const sqft = v.tcc2RoomLength * v.tcc2RoomWidth
    const tilesNeeded = Math.ceil(sqft / tileSqFt)
    const waste = Math.ceil(tilesNeeded * (v.tcc2WastePct / 100))
    const totalTiles = tilesNeeded + waste
    const boxes = Math.ceil(totalTiles / v.tcc2TilesPerBox)
    const totalCost = boxes * v.tcc2PricePerBox
    const extraTiles = boxes * v.tcc2TilesPerBox - totalTiles
    return { result: totalCost, label: 'Total Tile Cost', unit: '$', steps: [{ label: 'Room Area', value: sqft.toFixed(1) + ' sq ft' }, { label: 'Tile Size', value: tileSqFt + ' sq ft each' }, { label: 'Tiles Needed', value: tilesNeeded + ' + ' + waste + ' waste = ' + totalTiles }, { label: 'Boxes to Buy', value: '' + boxes + ' (' + (boxes * v.tcc2TilesPerBox) + ' tiles)' }, { label: 'Total Cost', value: '$' + totalCost.toFixed(2) }, { label: 'Extra Tiles', value: '' + extraTiles + ' spare' }] }
  },
  description: 'Calculate total tile cost including room dimensions, tile size, waste, boxes, and price per box with spare tile count.',
  formula: 'Boxes = ceil((Area/TileSize x (1+Waste%)) / TilesPerBox) | Cost = Boxes x Price/Box',
  interpretation: 'Always buy full boxes - most stores accept unopened returns. Store 5-10% extra for future repairs. Common box sizes: 10-15 sq ft per box for standard tile. Grout adds ~$1-2/sq ft.'
}

export default calcDef
