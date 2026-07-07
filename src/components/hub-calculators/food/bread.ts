import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'flour', label: 'Flour Weight', type: 'number', unit: 'g', min: 100, step: '10' },
      { name: 'hydration', label: 'Hydration %', type: 'select', options: [
        { label: '60% (firm dough)', value: '60' }, { label: '65% (standard)', value: '65' },
        { label: '70% (rustic)', value: '70' }, { label: '75% (ciabatta)', value: '75' },
        { label: '80% (high hydration)', value: '80' }, { label: '85%+ (artisan)', value: '85' },
      ] },
      { name: 'saltPct', label: 'Salt %', type: 'select', options: [
        { label: '1.5% (low salt)', value: '1.5' }, { label: '2% (standard)', value: '2' },
        { label: '2.5% (artisan)', value: '2.5' },
      ] },
    ],
    compute: (v) => {
      const water = v.flour * (v.hydration / 100); const salt = v.flour * (v.saltPct / 100); const total = v.flour + water + salt
      return { result: water, label: 'Water Needed', unit: 'g', steps: [
        { label: 'Flour', value: `${v.flour} g` },
        { label: 'Water', value: `${water.toFixed(0)} g (${v.hydration}% hydration)` },
        { label: 'Salt', value: `${salt.toFixed(0)} g (${v.saltPct}%)` },
        { label: 'Total dough weight', value: `${total.toFixed(0)} g` },
      ]}
    },
    description: 'Calculate ingredients for bread using baker\'s percentages. The hydration ratio determines crumb structure — higher hydration yields more open, airy bread.',
    example: { label: '500g flour, 70% hydration, 2% salt', value: '350g water, 10g salt' }
}

export default calcDef
