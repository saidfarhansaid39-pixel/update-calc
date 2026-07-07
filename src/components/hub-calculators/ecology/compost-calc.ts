import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ greens: z.string().optional(), browns: z.string().optional(), volume: z.string().optional() }),
  fields: [
    { name: 'greens', label: 'Green materials (kg/week)', type: 'number', min: 0, step: '0.5' },
    { name: 'browns', label: 'Brown materials (kg/week)', type: 'number', min: 0, step: '0.5' },
    { name: 'volume', label: 'Bin volume (L)', type: 'number', min: 50, step: '10' },
  ],
  compute: (v) => { const greens = parseFloat(v.greens)||0; const browns = parseFloat(v.browns)||0; const ratio = browns > 0 ? greens / browns : 0; const vol = parseFloat(v.volume)||200; const capacityWeeks = browns > 0 ? vol / ((greens + browns) * 0.4) : 0; const status = ratio > 0.5 ? 'Too wet—add browns' : ratio < 0.2 ? 'Too dry—add greens' : 'Balanced C:N'; return { result: ratio, label: 'Greens-to-Browns Ratio', unit: '', steps: [{ label: 'Green (N-rich) per week', value: `${greens} kg` }, { label: 'Brown (C-rich) per week', value: `${browns} kg` }, { label: 'G:B ratio', value: `${ratio.toFixed(2)}` }, { label: 'Status', value: status }, ...(capacityWeeks > 0 ? [{ label: 'Bin fill time', value: `${capacityWeeks.toFixed(0)} weeks` }] : [])] } },
  description: 'Helps optimize compost mix by calculating the carbon-to-nitrogen balance.',
  formula: 'Target C:N ~25-30:1. G:B ratio should be ~1:2 to 1:3 by volume.',
  interpretation: 'Too many greens (N) causes odors. Too many browns (C) slows decomposition. Ideal: 1 part greens to 2-3 parts browns.'
}

export default calcDef
