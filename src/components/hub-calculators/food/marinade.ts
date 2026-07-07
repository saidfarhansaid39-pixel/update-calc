import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'meatWeight', label: 'Meat Weight', type: 'number', unit: 'g', min: 100, step: '50' },
      { name: 'intensity', label: 'Marinade Intensity', type: 'select', options: [
        { label: 'Light (30% of meat weight)', value: '0.3' }, { label: 'Medium (50% of meat weight)', value: '0.5' },
        { label: 'Generous (75% of meat weight)', value: '0.75' }, { label: 'Full cover (100% of meat weight)', value: '1' },
      ] },
    ],
    compute: (v) => {
      const totalMarinade = v.meatWeight * v.intensity; const oil = totalMarinade * 0.5; const acid = totalMarinade * 0.25; const seasonings = totalMarinade * 0.25
      return { result: totalMarinade, label: 'Total Marinade', unit: 'g', steps: [
        { label: 'Meat weight', value: `${v.meatWeight} g` },
        { label: 'Marinade amount', value: `${totalMarinade.toFixed(0)} g (${(v.intensity * 100).toFixed(0)}%)` },
        { label: 'Oil (50%)', value: `${oil.toFixed(0)} g` },
        { label: 'Acid (25%) — citrus/vinegar', value: `${acid.toFixed(0)} g` },
        { label: 'Seasonings (25%)', value: `${seasonings.toFixed(0)} g` },
        { label: 'Marinate time', value: '30 min (fish), 2-4 hrs (chicken), 4-12 hrs (beef/pork)' },
      ]}
    },
    description: 'Calculate marinade ingredients based on meat weight. Classic ratio: 50% oil, 25% acid (vinegar/citrus), 25% seasonings. Adjust marinate time by protein type.',
    example: { label: '500g chicken, medium (50%)', value: '250g marinade: 125g oil, 63g acid, 63g seasonings' }
}

export default calcDef
