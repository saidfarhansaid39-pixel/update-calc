import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'water', label: 'Water Volume', type: 'number', unit: 'mL', min: 50, step: '10' },
      { name: 'ratio', label: 'Brew Ratio', type: 'select', options: [
        { label: '1:15 (strong — espresso style)', value: '15' },
        { label: '1:16 (standard pour-over)', value: '16' },
        { label: '1:17 (balanced)', value: '17' },
        { label: '1:18 (mild — drip)', value: '18' },
        { label: '1:12 (French press)', value: '12' },
        { label: '1:5 (cold brew concentrate)', value: '5' },
      ] },
    ],
    compute: (v) => ({ result: v.water / v.ratio, label: 'Coffee Grounds', unit: 'g', steps: [
      { label: 'Water volume', value: `${v.water} mL` },
      { label: 'Brew ratio', value: `1:${v.ratio}` },
      { label: 'Coffee needed', value: `${(v.water / v.ratio).toFixed(1)} g` },
      { label: 'Brew time', value: v.ratio <= 12 ? '4 min (French press)' : v.ratio >= 15 ? '2.5-3 min (pour-over)' : '3-4 min' },
    ]}),
    description: 'Perfect coffee-to-water ratio for any brewing method. The Specialty Coffee Association recommends 1:16-1:18 for pour-over, while French press and cold brew use stronger ratios.',
    example: { label: '300mL water, 1:16 ratio', value: '18.8g coffee grounds' }
}

export default calcDef
