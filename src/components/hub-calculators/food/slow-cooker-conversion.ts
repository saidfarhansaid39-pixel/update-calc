import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'ovenTime', label: 'Oven Time', type: 'number', unit: 'min', min: 15, step: '5' },
      { name: 'ovenTemp', label: 'Oven Temp', type: 'select', options: [{ label: '160-180°C (standard)', value: 'standard' }, { label: '190-220°C (hot)', value: 'hot' }] }
    ],
    compute: (v) => {
      const hrs = v.ovenTime / 60; const low = v.ovenTemp === 'standard' ? Math.round(hrs * 4) : Math.round(hrs * 6); const high = v.ovenTemp === 'standard' ? Math.round(hrs * 2) : Math.round(hrs * 3); return { result: low, label: 'Slow Cooker LOW', unit: 'hrs', steps: [{ label: 'Oven', value: Math.round(hrs * 10)/10 + ' hrs' }, { label: 'LOW', value: low + ' hrs' }, { label: 'HIGH', value: high + ' hrs' }] ,
    extras: [
      { label: "Serving note", value: "Adjust quantities based on number of servings needed." },
      { label: "Dietary note", value: "Consult a dietitian for personalized nutritional advice." },
      { label: "Substitution tip", value: "Substitutions may alter taste, texture, and nutritional content." }
    ]}
    },
    description: 'Convert oven to slow cooker. 1 hr oven ≈ 4 hrs LOW or 2 hrs HIGH.',
    example: { label: '1 hr oven roast', value: '4 hrs LOW or 2 hrs HIGH' }
}

export default calcDef
