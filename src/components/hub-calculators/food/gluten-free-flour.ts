import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'flour', label: 'Total Flour Needed', type: 'number', unit: 'g', min: 50, step: '10' },
      { name: 'blend', label: 'GF Blend Type', type: 'select', options: [{ label: 'Rice base (60% rice + 30% starch + 10% binder)', value: 'rice' }, { label: 'Almond base (70% almond + 30% starch)', value: 'almond' }, { label: 'Oat base (80% oat + 20% starch)', value: 'oat' }] }
    ],
    compute: (v) => {
      const r: Record<string, { b: number; s: number; x: number }> = { rice: { b: 0.6, s: 0.3, x: 0.1 }, almond: { b: 0.7, s: 0.3, x: 0 }, oat: { b: 0.8, s: 0.2, x: 0 } }; const mix = r[v.blend]; const base = v.flour * mix.b; const starch = v.flour * mix.s; const binder = v.flour * mix.x; return { result: v.flour, label: 'GF Flour Blend', unit: 'g', steps: [{ label: 'Total', value: v.flour + ' g' }, { label: 'Base flour', value: base.toFixed(0) + ' g' }, { label: 'Starch', value: starch.toFixed(0) + ' g' }, binder > 0 ? { label: 'Binder (xanthan)', value: binder.toFixed(0) + ' g' } : { label: 'Binder', value: 'Add 1 tsp xanthan per 200g flour' }] }
    },
    description: 'Create custom gluten-free flour blends. Rice-based needs xanthan gum; almond-based is more forgiving.',
    example: { label: '200g rice-based GF blend', value: '120g rice + 60g starch + 20g binder' }
}

export default calcDef
