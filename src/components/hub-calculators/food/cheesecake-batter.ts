import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'pan', label: 'Pan Size', type: 'select', options: [{ label: '6" (serves 4-6)', value: '340' }, { label: '8" (serves 8-10)', value: '680' }, { label: '9" (serves 12)', value: '900' }, { label: '10" (serves 14-16)', value: '1130' }] },
      { name: 'style', label: 'Style', type: 'select', options: [{ label: 'New York (dense)', value: 'ny' }, { label: 'Classic', value: 'classic' }, { label: 'Light/fluffy', value: 'light' }] }
    ],
    compute: (v) => {
      const cc = parseInt(v.pan); const ratios: Record<string, { s: number; e: number; c: number }> = { ny: { s: 1/3, e: 1.5/3, c: 1/3 }, classic: { s: 1/2.5, e: 1/2.5, c: 0.75/2.5 }, light: { s: 0.75/2, e: 0.75/2, c: 0.5/2 } }; const r = ratios[v.style]; const sugar = cc * r.s; const eggs = Math.round(cc * r.e / 50); const cream = cc * r.c; return { result: cc, label: 'Cream Cheese', unit: 'g', steps: [{ label: 'Pan', value: v.pan + '"' }, { label: 'Cream cheese', value: cc + ' g' }, { label: 'Sugar', value: sugar.toFixed(0) + ' g' }, { label: 'Eggs', value: eggs + ' large' }, { label: 'Cream', value: cream.toFixed(0) + ' mL' }] }
    },
    description: 'Cheesecake batter by pan size. New York style is denser with more cream cheese and eggs.',
    example: { label: '9" New York cheesecake', value: '900g cream cheese, 300g sugar, 6 eggs' }
}

export default calcDef
