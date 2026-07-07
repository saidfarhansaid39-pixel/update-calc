import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'guests', label: 'Number of Guests', type: 'number', min: 1, step: '1' },
      { name: 'appetite', label: 'Appetite Level', type: 'select', options: [
        { label: 'Light (300g meat/guest)', value: '300' }, { label: 'Moderate (400g meat/guest)', value: '400' },
        { label: 'Generous (500g meat/guest)', value: '500' }, { label: 'Hearty (600g meat/guest)', value: '600' },
      ] },
    ],
    compute: (v) => {
      const meat = v.guests * v.appetite; const sausage = v.guests * 150; const drinks = v.guests * 2
      return { result: meat, label: 'Total Meat Needed', unit: 'g', steps: [
        { label: 'Guests', value: `${v.guests}` },
        { label: 'Main meat', value: `${meat} g (${(meat / 1000).toFixed(1)} kg)` },
        { label: 'Sausages/extra', value: `${sausage} g extra` },
        { label: 'Sides per guest', value: '~200g salad + bread per person' },
        { label: 'Drinks', value: `~${drinks} drinks per guest (${v.guests * drinks} total)` },
      ]}
    },
    description: 'Plan the perfect BBQ with the right amount of food and drinks. Estimate 400-500g of meat per guest, plus sides, bread, and 2 drinks per person for a 4-hour party.',
    example: { label: '10 guests, moderate appetite', value: '4kg meat + 1.5kg sausages + sides' }
}

export default calcDef
