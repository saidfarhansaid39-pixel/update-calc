import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wslLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wslWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wslWorkbenches: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wslMachines: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wslStorage: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wslClearance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'wslLength', label: 'Workshop Length (ft)', type: 'number', min: 8, step: '2' },
    { name: 'wslWidth', label: 'Workshop Width (ft)', type: 'number', min: 8, step: '2' },
    { name: 'wslWorkbenches', label: 'Number of Workbenches', type: 'number', min: 0, step: '1' },
    { name: 'wslMachines', label: 'Large Machines/Tools', type: 'number', min: 0, step: '1' },
    { name: 'wslStorage', label: 'Storage Units/Cabinets', type: 'number', min: 0, step: '1' },
    { name: 'wslClearance', label: 'Clearance Around Items (ft)', type: 'number', min: 1, step: '0.5' },
  ],
  defaults: { wslLength: '20', wslWidth: '16', wslWorkbenches: '2', wslMachines: '3', wslStorage: '4', wslClearance: '3' },
  presets: [
    { label: 'Small Garage Shop', values: { wslLength: '12', wslWidth: '10', wslWorkbenches: '1', wslMachines: '2', wslStorage: '2', wslClearance: '2.5' } },
    { label: 'Two-Car Garage Workshop', values: { wslLength: '22', wslWidth: '20', wslWorkbenches: '2', wslMachines: '4', wslStorage: '4', wslClearance: '3' } },
    { label: 'Pro Woodworking Shop', values: { wslLength: '30', wslWidth: '24', wslWorkbenches: '3', wslMachines: '6', wslStorage: '6', wslClearance: '4' } },
  ],
  compute: (v) => {
    const totalArea = v.wslLength * v.wslWidth
    const benchArea = v.wslWorkbenches * 16
    const machineArea = v.wslMachines * 12
    const storageArea = v.wslStorage * 6
    const totalEquip = benchArea + machineArea + storageArea
    const clearanceBuffer = totalEquip * 0.5
    const totalUsed = totalEquip + clearanceBuffer
    const walkwayArea = (v.wslLength + v.wslWidth) * 2 * v.wslClearance
    const openArea = totalArea - totalUsed - walkwayArea
    const pctUsed = (totalUsed / totalArea) * 100
    return { result: pctUsed, label: 'Floor Space Used', unit: '%', steps: [{ label: 'Total Floor Area', value: `${v.wslLength} × ${v.wslWidth} = ${totalArea} sq ft` }, { label: 'Workbenches (16 sq ft each)', value: `${v.wslWorkbenches} × 16 = ${benchArea} sq ft` }, { label: 'Large Machines (12 sq ft each)', value: `${v.wslMachines} × 12 = ${machineArea} sq ft` }, { label: 'Storage Units (6 sq ft each)', value: `${v.wslStorage} × 6 = ${storageArea} sq ft` }, { label: 'Clearance Buffer (50%)', value: `${totalEquip} × 0.5 = ${clearanceBuffer.toFixed(0)} sq ft` }, { label: 'Walkway Perimeter', value: `2 × (${v.wslLength} + ${v.wslWidth}) × ${v.wslClearance} = ${walkwayArea.toFixed(0)} sq ft` }, { label: 'Open Space Remaining', value: `${Math.max(0, openArea).toFixed(0)} sq ft` }, { label: 'Space Utilization', value: `${pctUsed.toFixed(0)}% of floor used` }] ,
    extras: [
      { label: 'Optimal Workshop Ratio', value: 'Ideal layout: 40-50% equipment footprint, 30% walkways/clearance, 20-30% open assembly space. A 20×16 ft shop (320 sq ft) should have ~128-160 sq ft for equipment, ~96 sq ft for walkways, and ~64-96 sq ft open.' },
      { label: 'Minimum Walkway Width', value: 'Primary walkways: 3 ft minimum for comfortable movement, 4 ft for wheeled tool carts. Table saw infeed/outfeed: 4 ft each side. Assembly area: 6×6 ft minimum for cabinet-sized projects.' },
      { label: 'Machine Placement Rules', value: 'Table saw: centered in room with 4 ft infeed + 4 ft outfeed clearance. Jointer/planer: against wall (3 ft clearance). Drill press: corner location (2 ft clearance). Band saw: against wall (2.5 ft clearance).' },
      { label: 'Vertical Space Strategy', value: 'Wall-mounted storage uses zero floor space. French cleat systems hold $500+ of tools in 12 sq ft of wall. Ceiling racks for lumber storage (8 ft+ ceiling needed). Pegboard above workbench for frequently used tools.' },
      { label: 'Traffic Flow Design', value: 'Arrange equipment in workflow order: rough cut (radial arm saw) → dimension (table saw) → joint/plane → assembly → finishing. Avoid crossing paths between dirty (sawing) and clean (finishing) zones.' },
      { label: 'Lighting Requirements', value: 'Workshops need 75-100 foot-candles at work surface height (vs 30-50 for general rooms). One 4-ft LED shop light per 100 sq ft. Task lighting over each machine. Light-colored walls reflect 70%+ of light.' },
      { label: 'Electrical & Dust Collection', value: 'Plan 20-amp circuits every 6 ft along walls. Each large machine needs a dedicated circuit. Dust collection: 4-6 in duct runs to each machine, with 1 CFM per sq ft of shop volume minimum. Locate dust collector centrally.' },
    ]}
  },
  description: 'Plan your workshop layout by calculating space needed for workbenches, machines, storage units, clearance buffers, and walkways. Optimize floor space utilization for woodworking, metalworking, or multi-purpose shops.',
  formula: 'TotalArea = L × W. Equipment = Benches×16 + Machines×12 + Storage×6. ClearanceBuf = Equipment × 0.5 (50%). Walkways = 2 × (L+W) × Clearance. Used% = (Equipment + Clearance) ÷ TotalArea × 100. OpenSpace = TotalArea - Equipment - Clearance - Walkways.',
  interpretation: 'An ideal workshop layout dedicates 40-50% of floor area to equipment with clearance, 25-35% to walkways and access paths, and 15-25% remaining as open assembly space. For a typical 20×16 ft garage shop (320 sq ft), target ~144-160 sq ft for workstations with clearance, ~80-96 sq ft for 3 ft walkways around the perimeter, and ~64-80 sq ft of open space. If utilization exceeds 65%, the shop will feel cramped and workflow will suffer. Consider wall-mounted storage, fold-down workbenches, or mobile tool stands to reclaim floor space. Minimum 3 ft walkways ensure safe movement around machinery.'
}

export default calcDef
