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
    return { result: pctUsed, label: 'Floor Space Used', unit: '%', steps: [{ label: 'Total Area', value: totalArea + ' sq ft (' + v.wslLength + 'x' + v.wslWidth + ')' }, { label: 'Equipment', value: benchArea + ' + ' + machineArea + ' + ' + storageArea + ' = ' + totalEquip + ' sq ft' }, { label: 'Clearance Buffer', value: clearanceBuffer.toFixed(0) + ' sq ft' }, { label: 'Walkways', value: walkwayArea.toFixed(0) + ' sq ft' }, { label: 'Open Space Remaining', value: Math.max(0, openArea).toFixed(0) + ' sq ft' }, { label: 'Space Utilization', value: pctUsed.toFixed(0) + '%' }] }
  },
  description: 'Plan your workshop layout by calculating space needed for workbenches, machines, storage, and walkway clearances.',
  formula: 'Used% = (Workbenchx16 + Machinex12 + Storagex6) x 1.5 / (LxW) x 100 | Walkways: 2 x (L+W) x Clearance',
  interpretation: 'Ideal workshop: 40-50% equipment, 30% walkways, 20-30% open space. Minimum 3 ft walkways for comfortable movement. Table saw needs 4 ft infeed/outfeed. Allow 6 ft clearance for assembly projects. Wall-mounted storage saves floor space.'
}

export default calcDef
