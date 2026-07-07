import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'spice', label: 'Spice', type: 'select', options: [{ label: 'Cinnamon (allspice or nutmeg)', value: 'cinnamon' }, { label: 'Paprika (chili powder)', value: 'paprika' }, { label: 'Cumin (coriander)', value: 'cumin' }, { label: 'Nutmeg (mace)', value: 'nutmeg' }, { label: 'Ginger (allspice)', value: 'ginger' }, { label: 'Turmeric (curry powder)', value: 'turmeric' }] },
      { name: 'amount', label: 'Amount', type: 'number', unit: 'tsp', min: 0.25, step: '0.25' }
    ],
    compute: (v) => {
      const subs: Record<string, string> = { cinnamon: 'allspice or nutmeg (1:1)', paprika: 'chili powder (1:1)', cumin: 'ground coriander (1:1)', nutmeg: 'mace (1:1)', ginger: 'allspice (1:1)', turmeric: 'curry powder (1:1)' }; return { result: v.amount, label: 'Substitute', unit: 'tsp', steps: [{ label: 'Spice', value: v.spice }, { label: 'Need', value: v.amount + ' tsp' }, { label: 'Use', value: subs[v.spice] }] }
    },
    description: 'Spice substitutions when you\'re missing a specific spice. Most are 1:1 swaps.',
    example: { label: '1 tsp cinnamon', value: '1 tsp allspice' }
}

export default calcDef
