import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'puffs', label: 'Number of Puffs', type: 'number', min: 6, step: '6' },
      { name: 'filling', label: 'Filling', type: 'select', options: [{ label: 'Pastry cream', value: 'cream' }, { label: 'Whipped cream', value: 'whipped' }, { label: 'Ice cream', value: 'icecream' }] }
    ],
    compute: (v) => {
      const batches = Math.ceil(v.puffs / 6); const water = batches * 125; const butter = batches * 60; const flour = batches * 75; const eggs = batches * 2; return { result: v.puffs, label: 'Choux Pastry', unit: 'puffs', steps: [{ label: 'Puffs', value: v.puffs }, { label: 'Batches of 6', value: batches }, { label: 'Water', value: water + ' mL' }, { label: 'Butter', value: butter + ' g' }, { label: 'Flour', value: flour + ' g' }, { label: 'Eggs', value: eggs + ' large' }, { label: 'Filling', value: v.filling }] }
    },
    description: 'Choux pastry (cream puffs). Each batch of 6: 125mL water, 60g butter, 75g flour, 2 eggs.',
    example: { label: '24 cream puffs', value: '4 batches' }
}

export default calcDef
