import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'meat', label: 'Meat Type', type: 'select', options: [{ label: 'Brisket (1.5 hrs/kg at 110°C)', value: '1.5_93_brisket' }, { label: 'Pork shoulder (1.5 hrs/kg)', value: '1.5_93_pork' }, { label: 'Ribs (5-6 hrs at 110°C)', value: '5.5_93_ribs' }, { label: 'Chicken (40 min/kg at 135°C)', value: '0.67_74_chicken' }, { label: 'Fish (1 hr at 100°C)', value: '1_63_fish' }] },
      { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 0.5, step: '0.5' }
    ],
    compute: (v) => {
      const p = v.meat.split('_'); const hpk = parseFloat(p[0]); const tc = parseFloat(p[1]); const isFixed = v.meat.includes('ribs') || v.meat.includes('fish'); const th = isFixed ? hpk : hpk * v.weight; return { result: th * 60, label: 'Smoke Time', unit: 'min', steps: [{ label: 'Meat', value: p.slice(2).join(' ') }, { label: 'Weight', value: isFixed ? 'Fixed' : v.weight + ' kg' }, { label: 'Time', value: th.toFixed(1) + ' hrs (' + (th * 60).toFixed(0) + ' min)' }, { label: 'Target temp', value: tc + '°C' }] }
    },
    description: 'Smoking times at 110°C (225°F). Wrap in foil at the stall (~70°C internal).',
    example: { label: '5kg brisket', value: '~7.5 hrs at 110°C' }
}

export default calcDef
