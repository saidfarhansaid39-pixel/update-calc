import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'method', label: 'Method', type: 'select', options: [{ label: 'Direct heat', value: 'direct' }, { label: 'Indirect heat', value: 'indirect' }, { label: 'Two-zone', value: 'twozone' }] },
      { name: 'target', label: 'Heat Level', type: 'select', options: [{ label: 'High (230-290°C)', value: '230' }, { label: 'Med-high (200-230°C)', value: '200' }, { label: 'Medium (175-200°C)', value: '175' }, { label: 'Med-low (150-175°C)', value: '150' }, { label: 'Low (120-150°C)', value: '120' }] }
    ],
    compute: (v) => {
      const uses: Record<string, string> = { direct: 'Steaks, chops, burgers', indirect: 'Whole chicken, roasts', twozone: 'Sear then indirect' }; return { result: parseInt(v.target), label: 'Grill Temp', unit: '°C', steps: [{ label: 'Method', value: v.method }, { label: 'Temp range', value: v.target + '-' + (parseInt(v.target) + 30) + '°C' }, { label: 'Best for', value: uses[v.method] || 'Various' }] }
    },
    description: 'Grill temperatures by method. Direct for quick-cooking; indirect for larger cuts.',
    example: { label: 'Steak, direct high heat', value: '230-290°C' }
}

export default calcDef
