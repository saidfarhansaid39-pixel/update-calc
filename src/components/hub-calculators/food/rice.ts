import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' },
      { name: 'type', label: 'Rice Type', type: 'select', options: [
        { label: 'White rice (1:1.5 ratio)', value: '1.5_white' }, { label: 'Brown rice (1:2 ratio)', value: '2_brown' },
        { label: 'Jasmine (1:1.25 ratio)', value: '1.25_jasmine' }, { label: 'Basmati (1:1.5 ratio)', value: '1.5_basmati' },
        { label: 'Sushi rice (1:1.1 ratio)', value: '1.1_sushi' }, { label: 'Wild rice (1:3 ratio)', value: '3_wild' },
      ] },
    ],
    compute: (v) => {
      const parts = v.type.split('_'); const ratio = parseFloat(parts[0]); const riceG = v.servings * 75; const water = riceG * ratio
      return { result: riceG, label: 'Uncooked Rice', unit: 'g', steps: [
        { label: 'Servings', value: `${v.servings}` },
        { label: 'Rice type', value: `${parts.slice(1).join(' ')}` },
        { label: 'Uncooked rice', value: `${riceG} g (75g per serving)` },
        { label: 'Water needed', value: `${water} mL (${ratio}:1 ratio)` },
        { label: 'Cook time', value: ratio > 2 ? '40-50 min' : ratio > 1.5 ? '18-20 min' : '12-15 min' },
      ]}
    },
    description: 'Perfect rice-to-water ratios for any variety. White rice uses 1:1.5, brown rice 1:2, sushi rice 1:1.1. One serving = 75g uncooked rice = ~200g cooked.',
    example: { label: '2 servings jasmine rice', value: '150g rice + 188mL water' }
}

export default calcDef
