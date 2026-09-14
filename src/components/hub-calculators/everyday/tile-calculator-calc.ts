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
  defaults: { tcc2RoomLength: '12', tcc2RoomWidth: '10', tcc2TileSize: '12x12', tcc2WastePct: '10', tcc2PricePerBox: '35', tcc2TilesPerBox: '10' },
  presets: [
    { label: 'Small Bathroom (5×8 ft)', values: { tcc2RoomLength: '5', tcc2RoomWidth: '8', tcc2TileSize: '12x12', tcc2WastePct: '10', tcc2PricePerBox: '29', tcc2TilesPerBox: '10' } },
    { label: 'Kitchen (15×12 ft)', values: { tcc2RoomLength: '15', tcc2RoomWidth: '12', tcc2TileSize: '12x24', tcc2WastePct: '10', tcc2PricePerBox: '45', tcc2TilesPerBox: '8' } },
    { label: 'Living Room (18×14 ft)', values: { tcc2RoomLength: '18', tcc2RoomWidth: '14', tcc2TileSize: '18x18', tcc2WastePct: '15', tcc2PricePerBox: '55', tcc2TilesPerBox: '6' } },
    { label: 'Entryway (6×4 ft)', values: { tcc2RoomLength: '6', tcc2RoomWidth: '4', tcc2TileSize: '12x12', tcc2WastePct: '10', tcc2PricePerBox: '25', tcc2TilesPerBox: '12' } },
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
    return { result: totalCost, label: 'Total Tile Cost', unit: '$', steps: [
      { label: 'Formula', value: 'Boxes = ceil((Area ÷ TileSqFt × (1+Waste%)) ÷ TilesPerBox). Cost = Boxes × PricePerBox' },
      { label: 'Room Area', value: v.tcc2RoomLength + ' × ' + v.tcc2RoomWidth + ' ft = ' + sqft.toFixed(1) + ' sq ft' },
      { label: 'Tile Size', value: v.tcc2TileSize + ' = ' + tileSqFt + ' sq ft each' },
      { label: 'Base Tiles Needed', value: sqft.toFixed(1) + ' ÷ ' + tileSqFt + ' = ' + tilesNeeded + ' tiles' },
      { label: 'Waste', value: '+' + waste + ' tiles (' + v.tcc2WastePct + '%) = ' + totalTiles + ' total needed' },
      { label: 'Boxes to Buy', value: totalTiles + ' ÷ ' + v.tcc2TilesPerBox + ' per box = ' + boxes + ' boxes (' + (boxes * v.tcc2TilesPerBox) + ' tiles)' },
      { label: 'Total Cost', value: boxes + ' × $' + v.tcc2PricePerBox.toFixed(2) + ' = $' + totalCost.toFixed(2) },
      { label: 'Spare Tiles', value: '' + extraTiles + ' spare tiles for future repairs' },
    ] ,
    extras: [
      { label: 'Box Coverage', value: '12×12 tiles: 10-12 per box (10-12 sq ft). 12×24: 6-8 per box (12-16 sq ft). 18×18: 5-6 per box (11-13.5 sq ft)' },
      { label: 'Cost Efficiency', value: 'Larger tiles cost more per tile but fewer are needed. 18×18 tiles cover 2.25× more area than 12×12 — fewer cuts too' },
      { label: 'Store Unopened', value: 'Keep 1-2 full boxes unopened for returns. Most stores accept unopened boxes within 90 days with receipt' },
      { label: 'Dye Lot Matching', value: 'Check all boxes for the same dye lot number. Even slight color variations between lots are visible after installation' },
      { label: 'Installation Costs', value: 'Professional tile installation: $5-15/sq ft depending on tile size and layout complexity. Large format tiles cost more to install' },
      { label: 'Underlayment Required', value: 'For floor tile: cement backer board ($0.50-1.00/sq ft) or uncoupling membrane ($1.00-2.00/sq ft) is required' },
      { label: 'Grout & Sealant', value: 'Grout: $20-40 per bag (covers 100-200 sq ft). Sealer: $15-30 per quart. Epoxy grout costs 2-3× more but never needs sealing' },
      { label: 'Layout Complexity', value: 'Herringbone or diagonal patterns increase waste to 15-20% and installation cost by 25-50%. Simple straight lay is cheapest' },
    ]}
  },
  description: 'Calculate total tile project cost including room dimensions, tile size selection, waste factor, boxes needed, and price per box with spare tile count. Perfect for budgeting flooring, wall, and backsplash projects.',
  formula: 'Tiles Needed = ceil(Room Sq Ft ÷ Tile Sq Ft). Boxes Needed = ceil(Tiles Needed × (1 + Waste%) ÷ Tiles Per Box). Total Cost = Boxes × Price Per Box. Extra Tiles = (Boxes × Tiles Per Box) - (Tiles Needed + Waste).',
  interpretation: 'For a 12×10 ft room (120 sq ft) with 12×12 in tiles, 10% waste, 10 tiles per box at $35/box: 120 tiles + 12 waste = 132 tiles, 14 boxes ($490), 8 spare tiles. Larger tiles reduce total cost per square foot but increase installation complexity. Always buy full boxes — unopened boxes can be returned, and spares are essential for future repairs.'
}

export default calcDef
