import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ windowWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), windowHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rodOverhang: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), fullness: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'windowWidth', label: 'Window Width (in)', type: 'number', min: 12, step: '6' },
    { name: 'windowHeight', label: 'Window Height (in)', type: 'number', min: 12, step: '6' },
    { name: 'rodOverhang', label: 'Rod Overhang Each Side (in)', type: 'number', min: 0, step: '3' },
    { name: 'fullness', label: 'Fullness Factor', type: 'number', min: 1, max: 3, step: '0.5' },
  ],
  compute: (v) => {
    const totalRodWidth = v.windowWidth + (v.rodOverhang * 2)
    const fabricWidth = totalRodWidth * v.fullness
    const panelsNeeded = Math.ceil(fabricWidth / 54)
    const fabricPerPanel = v.windowHeight + 8
    const totalFabric = panelsNeeded * fabricPerPanel / 36
    return { result: panelsNeeded, label: 'Panels Needed', unit: 'panels', steps: [{ label: 'Rod Width', value: `${totalRodWidth.toFixed(0)} in (window ${v.windowWidth} + overhang ${v.rodOverhang}×2)` }, { label: 'Fabric Width Needed', value: `${fabricWidth.toFixed(0)} in (${v.fullness}x fullness)` }, { label: 'Panels (54 in each)', value: `${panelsNeeded}` }, { label: 'Total Fabric', value: `${totalFabric.toFixed(1)} yards` }] }
  },
  description: 'Determine curtain panel count and fabric yardage needed for your window based on width, height, rod overhang, and fullness factor.',
  formula: 'Panels = Ceil((WindowW + 2×Overhang) × Fullness / 54)',
  interpretation: 'Extend rod 6-12 in past window for a wider look. Curtains should be 84, 96, or 108 in standard lengths. Allow 4 in hem at bottom and 4 in header. Blackout lining adds $5-15 per panel.'
}

export default calcDef
