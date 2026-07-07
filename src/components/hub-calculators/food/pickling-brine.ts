import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'water', label: 'Water Volume', type: 'number', unit: 'cups', min: 1, step: '1' },
      { name: 'vinegar', label: 'Vinegar Ratio', type: 'select', options: [{ label: '50:50 (standard pickles)', value: '50' }, { label: '60:40 (less tangy)', value: '60' }, { label: '40:60 (more tangy)', value: '40' }] },
      { name: 'salt', label: 'Salt Type', type: 'select', options: [{ label: 'Pickling salt', value: '1' }, { label: 'Kosher salt', value: '1.25' }, { label: 'Table salt (not recommended)', value: '0.8' }] }
    ],
    compute: (v) => {
      const wc = v.water * 240; const vc = wc * (v.vinegar / 100); const salt = parseFloat(v.salt) * (wc / 1000) * 30; return { result: vc + wc, label: 'Total Brine', unit: 'mL', steps: [{ label: 'Water', value: wc.toFixed(0) + ' mL' }, { label: 'Vinegar (' + v.vinegar + '%)', value: vc.toFixed(0) + ' mL' }, { label: 'Salt', value: salt.toFixed(0) + ' g' }, { label: 'Total brine', value: (vc + wc).toFixed(0) + ' mL' }] }
    },
    description: 'Pickling brine ratios. Standard: 50% water, 50% vinegar, 3% salt by water weight. Use pickling salt for clarity.',
    example: { label: '2 cups water, 50% vinegar', value: '~960mL brine' }
}

export default calcDef
