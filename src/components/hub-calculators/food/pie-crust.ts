import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'crusts', label: 'Crust', type: 'select', options: [{ label: 'Single 9"', value: '150_single' }, { label: 'Double 9"', value: '275_double' }, { label: 'Single 10"', value: '200_single' }, { label: 'Double 10"', value: '350_double' }] },
      { name: 'butter', label: 'Fat Type', type: 'select', options: [{ label: 'All-butter (flakiest)', value: '0.7' }, { label: 'Shortening', value: '0.6' }, { label: 'Half butter/half shortening', value: '0.65' }] }
    ],
    compute: (v) => {
      const p = v.crusts.split('_'); const flour = parseFloat(p[0]); const fat = flour * parseFloat(v.butter); const water = flour * 0.25; return { result: flour, label: 'Flour', unit: 'g', steps: [{ label: 'Type', value: p.slice(1).join(' ') + ' crust' }, { label: 'Flour', value: flour + ' g' }, { label: 'Fat', value: fat.toFixed(0) + ' g' }, { label: 'Ice water', value: water.toFixed(0) + ' g' }] }
    },
    description: 'Pie crust: 3:2:1 ratio (flour:fat:water). Keep ingredients COLD for flaky texture.',
    example: { label: 'Double 9" all-butter', value: '275g flour, 193g butter, 69g water' }
}

export default calcDef
