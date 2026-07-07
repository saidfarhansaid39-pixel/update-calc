import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ throwDistance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), aspectRatio: z.string().min(1), screenType: z.string().min(1) }),
  fields: [
    { name: 'throwDistance', label: 'Throw Distance (ft)', type: 'number', min: 3, max: 100, step: '1' },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: [{ label: '16:9 (Widescreen)', value: '16:9' }, { label: '4:3 (Standard)', value: '4:3' }, { label: '2.35:1 (CinemaScope)', value: '2.35:1' }] },
    { name: 'screenType', label: 'Screen Type', type: 'select', options: [{ label: 'Standard Throw (1.5:1 ratio)', value: 'standard' }, { label: 'Short Throw (0.5:1 ratio)', value: 'short' }, { label: 'Ultra Short Throw (0.25:1 ratio)', value: 'ultraShort' }] },
  ],
  compute: (v) => {
    const throwRatios: Record<string, number> = { standard: 1.5, short: 0.5, ultraShort: 0.25 }
    const ratio = throwRatios[v.screenType as keyof typeof throwRatios] || 1.5
    const width = v.throwDistance / ratio
    const aspectParts = v.aspectRatio.split(':').map(Number)
    const height = width / (aspectParts[0] / aspectParts[1])
    const diagonal = Math.sqrt(width * width + height * height)
    return { result: diagonal, label: 'Screen Diagonal', unit: 'in', steps: [{ label: 'Throw Ratio', value: `${ratio}:1` }, { label: 'Screen Width', value: `${width.toFixed(1)} ft` }, { label: 'Screen Height', value: `${height.toFixed(1)} ft` }, { label: 'Diagonal', value: `${diagonal.toFixed(1)} ft (${(diagonal * 12).toFixed(0)} in)` }] }
  },
  description: 'Calculate the projected screen size based on throw distance, aspect ratio, and projector type for home theater or presentation setups.',
  formula: 'Width = Distance/ThrowRatio | Diagonal = √(W²+H²) | 16:9 standard, 2.35:1 for cinema',
  interpretation: 'Standard throw (1.5:1) is most common. Short throw (0.5:1) works in small rooms. Ultra short throw (0.25:1) sits inches from the wall. For 100 in diagonal at 16:9, place a standard projector ~11 ft away.'
}

export default calcDef
